from __future__ import annotations

import csv
import hashlib
import json
import math
from dataclasses import dataclass, asdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageStat


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = ROOT / "public"
MUM_ROOT = PUBLIC_ROOT / "images" / "mum"
REPORT_DIR = ROOT / "review-screenshots" / "mum-image-audit"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


@dataclass
class ImageAudit:
    rel_path: str
    site_src: str
    width: int
    height: int
    bytes: int
    exact_sha256: str
    ahash: str
    dhash: str
    edge_variance: float
    brightness: float
    saturation_hint: float
    bucket: str
    decision: str
    reasons: str
    duplicate_of: str = ""


def image_files() -> list[Path]:
    return sorted(
        p
        for p in MUM_ROOT.rglob("*")
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS
    )


def to_site_src(path: Path) -> str:
    return "/" + path.relative_to(PUBLIC_ROOT).as_posix()


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def bits_to_hex(bits: list[int]) -> str:
    value = 0
    for bit in bits:
        value = (value << 1) | int(bit)
    return f"{value:0{math.ceil(len(bits)/4)}x}"


def average_hash(img: Image.Image, size: int = 8) -> str:
    gray = img.convert("L").resize((size, size), Image.Resampling.LANCZOS)
    px = list(gray.getdata())
    avg = sum(px) / len(px)
    return bits_to_hex([p >= avg for p in px])


def difference_hash(img: Image.Image, width: int = 9, height: int = 8) -> str:
    gray = img.convert("L").resize((width, height), Image.Resampling.LANCZOS)
    px = list(gray.getdata())
    bits: list[int] = []
    for y in range(height):
        row = px[y * width : (y + 1) * width]
        for x in range(width - 1):
            bits.append(row[x] > row[x + 1])
    return bits_to_hex(bits)


def hamming_hex(a: str, b: str) -> int:
    return (int(a, 16) ^ int(b, 16)).bit_count()


def edge_variance(img: Image.Image) -> float:
    gray = img.convert("L").resize((320, 320), Image.Resampling.LANCZOS)
    edges = gray.filter(ImageFilter.FIND_EDGES)
    return float(ImageStat.Stat(edges).var[0])


def brightness(img: Image.Image) -> float:
    return float(ImageStat.Stat(img.convert("L").resize((64, 64))).mean[0])


def saturation_hint(img: Image.Image) -> float:
    rgb = img.convert("RGB").resize((80, 80), Image.Resampling.LANCZOS)
    vals = []
    for r, g, b in rgb.getdata():
        vals.append(max(r, g, b) - min(r, g, b))
    return float(sum(vals) / len(vals))


def bucket_for(path: Path) -> str:
    rel = path.relative_to(MUM_ROOT).as_posix().lower()
    if "service-card" in rel or "service_" in rel or "newspaper" in rel:
        return "service_or_newspaper"
    if "approval-sheet" in rel:
        return "approval_sheet"
    if "approval/separate-images/remote_" in rel:
        return "remote_base44_archive"
    if "approval/separate-images/fs" in rel:
        return "raw_slideshow_duplicate_source"
    if "funeral-slideshow/captured" in rel:
        return "raw_funeral_slideshow"
    if "memory-lane" in rel:
        return "memory_lane_curated"
    return "standalone_mum_asset"


def initial_reasons(path: Path, audit: ImageAudit) -> list[str]:
    rel = path.relative_to(MUM_ROOT).as_posix().lower()
    reasons: list[str] = []
    if audit.bucket in {"service_or_newspaper", "approval_sheet"}:
        reasons.append("service/newspaper/approval material kept out of visual garden")
    if audit.bucket == "raw_slideshow_duplicate_source":
        reasons.append("raw duplicate source; use curated memory-lane copy if approved")
    if audit.edge_variance < 55:
        reasons.append("blur/low-edge-detail candidate")
    if audit.width < 220 or audit.height < 220:
        reasons.append("too small for premium display")
    if "grave" in rel or "coffin" in rel or "cemetery" in rel:
        reasons.append("grave/coffin/cemetery keyword")
    if path.stem.upper().endswith("FS124") or "fs124" in rel:
        reasons.append("memorial title slide, not a living garden photo")
    return reasons


def draw_contact_sheet(rows: list[ImageAudit], output: Path, title: str, thumb_w=180, thumb_h=135, cols=5) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default()
    pad = 16
    label_h = 50
    title_h = 42
    rows_count = math.ceil(len(rows) / cols)
    sheet = Image.new("RGB", (cols * (thumb_w + pad) + pad, title_h + rows_count * (thumb_h + label_h + pad) + pad), "#071007")
    draw = ImageDraw.Draw(sheet)
    draw.text((pad, 14), title, fill="#f5d06e", font=font)

    for i, item in enumerate(rows):
        path = PUBLIC_ROOT / item.site_src.lstrip("/").replace("/", "\\")
        x = pad + (i % cols) * (thumb_w + pad)
        y = title_h + (i // cols) * (thumb_h + label_h + pad)
        try:
            img = Image.open(path).convert("RGB")
            img.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            frame = Image.new("RGB", (thumb_w, thumb_h), "#0b120b")
            frame.paste(img, ((thumb_w - img.width) // 2, (thumb_h - img.height) // 2))
            sheet.paste(frame, (x, y))
        except Exception:
            draw.rectangle((x, y, x + thumb_w, y + thumb_h), outline="#7f1d1d")
            draw.text((x + 6, y + 6), "LOAD ERROR", fill="#fecaca", font=font)
        border = "#166534" if item.decision == "keep" else "#991b1b"
        draw.rectangle((x, y, x + thumb_w, y + thumb_h), outline=border, width=4)
        label = Path(item.rel_path).stem
        short_reason = item.reasons.split(";")[0] if item.reasons else "keep"
        draw.text((x, y + thumb_h + 6), label[:28], fill="#fff7df", font=font)
        draw.text((x, y + thumb_h + 22), f"{item.decision} · blur {item.edge_variance:.0f}", fill="#d4af37", font=font)
        draw.text((x, y + thumb_h + 38), short_reason[:32], fill="#b7a88a", font=font)

    sheet.save(output, quality=92)


def main() -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    audits: list[ImageAudit] = []
    for path in image_files():
        with Image.open(path) as img:
            img = img.convert("RGB")
            rel = path.relative_to(ROOT).as_posix()
            item = ImageAudit(
                rel_path=rel,
                site_src=to_site_src(path),
                width=img.width,
                height=img.height,
                bytes=path.stat().st_size,
                exact_sha256=sha256(path),
                ahash=average_hash(img),
                dhash=difference_hash(img),
                edge_variance=edge_variance(img),
                brightness=brightness(img),
                saturation_hint=saturation_hint(img),
                bucket=bucket_for(path),
                decision="keep",
                reasons="",
            )
            reasons = initial_reasons(path, item)
            if reasons:
                item.decision = "exclude"
                item.reasons = "; ".join(reasons)
            audits.append(item)

    # Exact duplicate and near-duplicate pass. Prefer memory-lane, then standalone/remote, then raw slideshow.
    rank = {
        "memory_lane_curated": 0,
        "standalone_mum_asset": 1,
        "remote_base44_archive": 2,
        "raw_funeral_slideshow": 3,
        "raw_slideshow_duplicate_source": 4,
        "service_or_newspaper": 5,
        "approval_sheet": 6,
    }
    audits.sort(key=lambda a: (rank.get(a.bucket, 99), a.rel_path))

    for i, item in enumerate(audits):
        if item.decision == "exclude":
            continue
        for prior in audits[:i]:
            if prior.decision == "exclude":
                continue
            if item.exact_sha256 == prior.exact_sha256:
                item.decision = "exclude"
                item.duplicate_of = prior.site_src
                item.reasons = f"exact duplicate of {prior.site_src}"
                break
            if hamming_hex(item.dhash, prior.dhash) <= 4 and hamming_hex(item.ahash, prior.ahash) <= 7:
                item.decision = "exclude"
                item.duplicate_of = prior.site_src
                item.reasons = f"near duplicate of {prior.site_src}"
                break

    # Public garden allowlist: curated memory-lane and standalone warm assets only.
    clean_gallery = [
        {
            "id": Path(a.site_src).stem,
            "src": a.site_src,
            "source": "Cleaned Mum Garden image audit",
            "caption": "A real family memory, included in the public garden set after duplicate, blur, and funeral-context screening.",
        }
        for a in audits
        if a.decision == "keep" and a.bucket in {"memory_lane_curated", "standalone_mum_asset"}
    ]

    (REPORT_DIR / "mum_image_audit.json").write_text(
        json.dumps([asdict(a) for a in audits], indent=2), encoding="utf-8"
    )
    with (REPORT_DIR / "mum_image_audit.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(asdict(audits[0]).keys()))
        writer.writeheader()
        for a in audits:
            writer.writerow(asdict(a))

    (MUM_ROOT / "memory-lane" / "_clean_public_gallery_manifest.json").write_text(
        json.dumps({"items": clean_gallery}, indent=2), encoding="utf-8"
    )

    draw_contact_sheet(
        [a for a in audits if a.bucket in {"memory_lane_curated", "standalone_mum_asset"}],
        REPORT_DIR / "01_clean_candidate_contact_sheet.jpg",
        "Mum Garden clean candidates: green kept, red excluded",
    )
    draw_contact_sheet(
        [a for a in audits if a.decision == "exclude"][:80],
        REPORT_DIR / "02_excluded_contact_sheet_part1.jpg",
        "Excluded images part 1: duplicates, blur, service/newspaper/raw source",
    )
    draw_contact_sheet(
        [a for a in audits if a.decision == "exclude"][80:160],
        REPORT_DIR / "03_excluded_contact_sheet_part2.jpg",
        "Excluded images part 2",
    )

    summary = {
        "total_images_reviewed": len(audits),
        "kept_for_public_gallery": len(clean_gallery),
        "excluded": len([a for a in audits if a.decision == "exclude"]),
        "excluded_by_bucket": {},
        "reports": {
            "json": str(REPORT_DIR / "mum_image_audit.json"),
            "csv": str(REPORT_DIR / "mum_image_audit.csv"),
            "clean_manifest": str(MUM_ROOT / "memory-lane" / "_clean_public_gallery_manifest.json"),
            "clean_contact_sheet": str(REPORT_DIR / "01_clean_candidate_contact_sheet.jpg"),
        },
    }
    for a in audits:
        if a.decision == "exclude":
            summary["excluded_by_bucket"][a.bucket] = summary["excluded_by_bucket"].get(a.bucket, 0) + 1
    (REPORT_DIR / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
