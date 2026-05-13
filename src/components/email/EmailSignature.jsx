// Email signature component for all outbound emails

const BANNER_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cff3bb798_Untitleddesign.jpg';

export const GANNON_SIGNATURE_HTML = `
<div style="margin-top: 32px; padding-top: 0; border-top: none;">
  <!-- Thank You banner with side fades (inline table trick for email clients) -->
  <div style="position: relative; max-width: 540px; margin: 0 auto 20px auto; border-radius: 10px; overflow: hidden; line-height: 0;">
    <img src="${BANNER_URL}" alt="Thank You — Gannon Waye · 05 June 2026"
      style="width: 100%; max-width: 540px; display: block; border-radius: 10px;" />
    <!-- Top fade overlay -->
    <div style="position: absolute; top: 0; left: 0; right: 0; height: 40%; background: linear-gradient(to bottom, rgba(14,16,21,0.85), transparent); border-radius: 10px 10px 0 0;"></div>
    <!-- Bottom fade overlay -->
    <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 45%; background: linear-gradient(to top, rgba(14,16,21,0.90), transparent); border-radius: 0 0 10px 10px;"></div>
    <!-- Left fade -->
    <div style="position: absolute; top: 0; left: 0; bottom: 0; width: 15%; background: linear-gradient(to right, rgba(14,16,21,0.80), transparent);"></div>
    <!-- Right fade -->
    <div style="position: absolute; top: 0; right: 0; bottom: 0; width: 15%; background: linear-gradient(to left, rgba(14,16,21,0.80), transparent);"></div>
  </div>
  <div style="padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); max-width: 540px; margin: 0 auto;">
    <p style="font-family: 'Inter', sans-serif; font-size: 13px; color: rgba(255, 255, 255, 0.75); margin: 0 0 8px 0; line-height: 1.6;">
      With gratitude &amp; respect,
    </p>
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d02a2452f_2.png" alt="Gannon Waye" style="height: 38px; margin: 10px 0;" />
    <p style="font-family: 'Playfair Display', Georgia, serif; font-size: 12px; color: #f5d06e; margin: 6px 0 0 0; font-weight: 500; letter-spacing: 0.05em;">
      Gannon Waye
    </p>
    <p style="font-family: 'Inter', sans-serif; font-size: 10px; color: rgba(255,255,255,0.35); margin: 4px 0 0 0; letter-spacing: 0.15em; text-transform: uppercase;">
      Thank You · 05 June 2026
    </p>
  </div>
</div>
`;

export const GANNON_SIGNATURE_TEXT = `
With gratitude & respect,
Gannon Waye
Thank You — out 05 June 2026
`;