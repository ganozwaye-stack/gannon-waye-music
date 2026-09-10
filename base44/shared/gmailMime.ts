// Shared Gmail MIME builder — RFC 2822 message with base64url encoding.
// Extracted so every Gmail-sending backend function builds messages identically.

export function buildMimeMessage({ to, subject, htmlBody }) {
  const boundary = `boundary_${Date.now()}`;
  const raw = [
    `From: Gannon Waye Site <me>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    htmlBody,
    `--${boundary}--`
  ].join('\r\n');
  return btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}