import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ESLint } from "eslint";
import ts from "typescript";

const root = process.cwd();
const baselinePath = path.join(root, "tools", "quality-baseline.json");
const mode = process.argv[2] || "all";
const validModes = new Set(["lint", "typecheck", "all", "baseline"]);

if (!validModes.has(mode)) {
  console.error("Usage: node tools/quality-gate.mjs [lint|typecheck|all|baseline]");
  process.exit(2);
}

function normalizePath(filePath) {
  if (!filePath) return "<global>";
  const relative = path.isAbsolute(filePath)
    ? path.relative(root, filePath)
    : filePath;
  return relative.replaceAll("\\", "/") || "<global>";
}

function normalizeText(value) {
  return String(value ?? "")
    .replaceAll(root.replaceAll("\\", "/"), "<root>")
    .replaceAll(root, "<root>")
    .replace(/\s+/g, " ")
    .trim();
}

function sourceLineFromText(text, line) {
  if (!text || !line) return "";
  return normalizeText(text.split(/\r?\n/)[line - 1] || "");
}

function fingerprint(entry) {
  const raw = JSON.stringify([
    entry.tool,
    entry.path,
    entry.code,
    entry.severity,
    entry.message,
    entry.source,
  ]);
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function countFingerprints(entries) {
  const counts = {};
  for (const entry of entries) {
    const key = fingerprint(entry);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function summarize(entries) {
  const bySeverity = {};
  const byCode = {};
  for (const entry of entries) {
    bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
    byCode[entry.code] = (byCode[entry.code] || 0) + 1;
  }
  return {
    total: entries.length,
    bySeverity,
    byCode: Object.fromEntries(
      Object.entries(byCode).sort((a, b) => b[1] - a[1]),
    ),
  };
}

function hashFile(relativePath) {
  const filePath = path.join(root, relativePath);
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

function packageVersion(packageName) {
  const packagePath = path.join(
    root,
    "node_modules",
    ...packageName.split("/"),
    "package.json",
  );
  return JSON.parse(fs.readFileSync(packagePath, "utf8")).version;
}

function sourceCommit() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unavailable";
  }
}

async function collectLint() {
  const eslint = new ESLint({ cwd: root });
  const results = await eslint.lintFiles(["."]);
  const diagnostics = [];
  const hardFailures = [];

  for (const result of results) {
    const relativePath = normalizePath(result.filePath);
    for (const message of result.messages) {
      const entry = {
        tool: "eslint",
        path: relativePath,
        code: message.ruleId || "parser",
        severity: message.severity === 2 ? "error" : "warning",
        message: normalizeText(message.message),
        source: sourceLineFromText(result.source, message.line),
      };
      if (message.fatal || !message.ruleId) {
        hardFailures.push(entry);
      } else {
        diagnostics.push(entry);
      }
    }
  }

  return { diagnostics, hardFailures };
}

function tsEntry(diagnostic) {
  const file = diagnostic.file;
  const start = file && diagnostic.start !== undefined
    ? file.getLineAndCharacterOfPosition(diagnostic.start)
    : null;
  return {
    tool: "typescript",
    path: normalizePath(file?.fileName),
    code: `TS${diagnostic.code}`,
    severity:
      diagnostic.category === ts.DiagnosticCategory.Warning ? "warning" : "error",
    message: normalizeText(
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    ),
    source: sourceLineFromText(file?.text, start ? start.line + 1 : null),
  };
}

function uniqueTsDiagnostics(diagnostics) {
  const seen = new Set();
  return diagnostics.filter((diagnostic) => {
    const entry = tsEntry(diagnostic);
    const key = JSON.stringify(entry);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function collectTypecheck() {
  const configPath = path.join(root, "jsconfig.json");
  const readResult = ts.readConfigFile(configPath, ts.sys.readFile);
  if (readResult.error) {
    return { diagnostics: [], hardFailures: [tsEntry(readResult.error)] };
  }

  const parsed = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    root,
    {},
    configPath,
  );
  if (parsed.errors.length > 0) {
    return {
      diagnostics: [],
      hardFailures: uniqueTsDiagnostics(parsed.errors).map(tsEntry),
    };
  }

  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
  });

  const structural = uniqueTsDiagnostics([
    ...program.getConfigFileParsingDiagnostics(),
    ...program.getOptionsDiagnostics(),
    ...program.getGlobalDiagnostics(),
    ...program.getSyntacticDiagnostics(),
  ]).map(tsEntry);

  const diagnostics = [];
  const hardFailures = [...structural];
  const alwaysHardCodes = new Set([2307, 2688]);

  for (const diagnostic of program.getSemanticDiagnostics()) {
    const entry = tsEntry(diagnostic);
    if (
      alwaysHardCodes.has(diagnostic.code) ||
      entry.path.startsWith("node_modules/")
    ) {
      hardFailures.push(entry);
    } else {
      diagnostics.push(entry);
    }
  }

  return { diagnostics, hardFailures };
}

function printEntries(label, entries, limit = 20) {
  if (entries.length === 0) return;
  console.error(`${label} (${entries.length}):`);
  for (const entry of entries.slice(0, limit)) {
    console.error(
      `  ${entry.path} ${entry.code} ${entry.severity}: ${entry.message}`,
    );
  }
  if (entries.length > limit) {
    console.error(`  ... ${entries.length - limit} more`);
  }
}

function compare(tool, currentEntries, baseline) {
  const current = countFingerprints(currentEntries);
  const allowed = baseline.fingerprints?.[tool] || {};
  const currentByHash = new Map();

  for (const entry of currentEntries) {
    const key = fingerprint(entry);
    if (!currentByHash.has(key)) currentByHash.set(key, entry);
  }

  const additions = [];
  let improvementCount = 0;

  for (const [key, count] of Object.entries(current)) {
    const allowedCount = allowed[key] || 0;
    if (count > allowedCount) {
      additions.push({
        ...currentByHash.get(key),
        increase: count - allowedCount,
      });
    }
  }

  for (const [key, count] of Object.entries(allowed)) {
    improvementCount += Math.max(0, count - (current[key] || 0));
  }

  return { additions, improvementCount };
}

function verifyHashes(tool, baseline) {
  const expected = baseline.hashes || {};
  const required =
    tool === "eslint"
      ? ["eslint.config.js", "package-lock.json"]
      : ["jsconfig.json", "package-lock.json"];
  const mismatches = [];

  for (const file of required) {
    const actual = hashFile(file);
    if (expected[file] !== actual) {
      mismatches.push(file);
    }
  }
  return mismatches;
}

async function collect(requestedMode) {
  const output = {};
  if (requestedMode === "lint" || requestedMode === "all" || requestedMode === "baseline") {
    output.eslint = await collectLint();
  }
  if (requestedMode === "typecheck" || requestedMode === "all" || requestedMode === "baseline") {
    output.typescript = await collectTypecheck();
  }
  return output;
}

function readBaseline() {
  if (!fs.existsSync(baselinePath)) return null;
  return JSON.parse(fs.readFileSync(baselinePath, "utf8"));
}

function writeBaseline(results, previous) {
  const lintEntries = results.eslint.diagnostics;
  const typeEntries = results.typescript.diagnostics;
  const next = {
    version: 1,
    policy: "no-new-issues-vs-baseline",
    generatedAt: new Date().toISOString(),
    sourceCommit: sourceCommit(),
    startingAudit: previous?.startingAudit || {
      scopedLint: {
        total: 472,
        errors: 256,
        warnings: 216,
        note: "Pre-cleanup scoped baseline retained for audit history.",
      },
      scopedTypecheck: {
        total: 6931,
        note: "Pre-cleanup baseline included third-party Three.js diagnostics.",
      },
    },
    toolVersions: {
      eslint: packageVersion("eslint"),
      typescript: packageVersion("typescript"),
    },
    hashes: {
      "eslint.config.js": hashFile("eslint.config.js"),
      "jsconfig.json": hashFile("jsconfig.json"),
      "package-lock.json": hashFile("package-lock.json"),
    },
    summaries: {
      eslint: summarize(lintEntries),
      typescript: summarize(typeEntries),
    },
    fingerprints: {
      eslint: countFingerprints(lintEntries),
      typescript: countFingerprints(typeEntries),
    },
  };

  fs.writeFileSync(baselinePath, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    `Quality baseline saved: ESLint ${lintEntries.length}, TypeScript ${typeEntries.length}.`,
  );
}

async function main() {
  const results = await collect(mode);
  const hardFailures = Object.values(results).flatMap(
    (result) => result.hardFailures,
  );

  if (hardFailures.length > 0) {
    printEntries("Unbaselineable quality failures", hardFailures);
    process.exit(1);
  }

  if (mode === "baseline") {
    const previous = readBaseline();
    if (previous) {
      for (const [tool, result] of Object.entries(results)) {
        const comparison = compare(tool, result.diagnostics, previous);
        if (comparison.additions.length > 0) {
          printEntries(
            `Baseline update refused; new ${tool} diagnostics`,
            comparison.additions,
          );
          process.exit(1);
        }
      }
    }
    writeBaseline(results, previous);
    return;
  }

  const baseline = readBaseline();
  if (!baseline) {
    console.error(
      "Missing tools/quality-baseline.json. Run the explicit baseline command after review.",
    );
    process.exit(1);
  }

  let failed = false;
  for (const [tool, result] of Object.entries(results)) {
    const hashMismatches = verifyHashes(tool, baseline);
    if (hashMismatches.length > 0) {
      console.error(
        `${tool} configuration/dependency hash changed: ${hashMismatches.join(", ")}. Review diagnostics and run the downward-only baseline update.`,
      );
      failed = true;
      continue;
    }

    const comparison = compare(tool, result.diagnostics, baseline);
    if (comparison.additions.length > 0) {
      printEntries(
        `New or increased ${tool} diagnostics`,
        comparison.additions,
      );
      failed = true;
    } else {
      console.log(
        `${tool}: pass (${result.diagnostics.length} current; ${comparison.improvementCount} baseline diagnostics removed).`,
      );
    }
  }

  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(2);
});
