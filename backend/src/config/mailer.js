const nodemailer = require("nodemailer");

/**
 * Escape text for safe HTML rendering.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build the shared branded email template.
 *
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.subjectLine
 * @param {string} options.bodyIntro
 * @param {string} [options.bodyOutro]
 * @param {string} [options.otpCode]
 * @param {number} [options.expiresInMinutes]
 * @param {string} [options.ctaUrl]
 * @param {string} [options.ctaLabel]
 * @param {string} [options.notice]
 * @returns {string}
 */
function renderEmailTemplate({
  title,
  subjectLine,
  bodyIntro,
  bodyOutro,
  otpCode,
  expiresInMinutes,
  ctaUrl,
  ctaLabel,
  notice,
}) {
  const hasOtp = Boolean(otpCode);
  const hasCta = Boolean(ctaUrl);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHtml(subjectLine)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Source+Sans+3:wght@300;400;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #f0ede6; font-family: 'Source Sans 3', Georgia, sans-serif; color: #2c2c2c; -webkit-font-smoothing: antialiased; }
    .email-wrapper { max-width: 620px; margin: 48px auto; background: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 40px rgba(26, 39, 68, 0.12); }
    .header { background-color: #1a2744; padding: 36px 48px 32px; text-align: center; position: relative; }
    .header::after { content: ''; display: block; width: 56px; height: 2px; background: #c9a84c; margin: 18px auto 0; }
    .header .logo-text { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: 0.04em; }
    .header .logo-tagline { font-family: 'Source Sans 3', sans-serif; font-size: 11px; font-weight: 300; color: #a8b4cc; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 6px; }
    .hero-band { background: #f8f6f1; border-bottom: 1px solid #e8e2d8; padding: 28px 48px 24px; text-align: center; }
    .hero-band .greeting { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 500; color: #1a2744; line-height: 1.3; }
    .hero-band .greeting span { color: #c9a84c; }
    .body { padding: 40px 48px; }
    .body p { font-size: 15px; line-height: 1.75; color: #4a4a4a; font-weight: 300; }
    .otp-container, .cta-container { margin: 32px 0; text-align: center; }
    .otp-label { font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #888; margin-bottom: 14px; }
    .otp-box { display: inline-block; background: #1a2744; border-radius: 4px; padding: 22px 52px; position: relative; }
    .otp-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #c9a84c; border-radius: 4px 4px 0 0; }
    .otp-code { font-family: 'Playfair Display', Georgia, serif; font-size: 42px; font-weight: 700; color: #ffffff; letter-spacing: 0.28em; line-height: 1; }
    .otp-expiry { margin-top: 14px; font-size: 12px; color: #999; letter-spacing: 0.05em; }
    .otp-expiry strong { color: #c9a84c; font-weight: 600; }
    .cta-button { display: inline-block; background: #1a2744; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-size: 14px; font-weight: 600; letter-spacing: 0.04em; }
    .cta-button:hover { background: #233257; }
    .divider { border: none; border-top: 1px solid #ece8e0; margin: 32px 0; }
    .security-notice { background: #f8f6f1; border-left: 3px solid #c9a84c; border-radius: 0 3px 3px 0; padding: 14px 18px; margin-top: 8px; }
    .security-notice p { font-size: 13px !important; color: #666 !important; line-height: 1.6 !important; }
    .security-notice p strong { color: #1a2744; font-weight: 600; }
    .footer { background-color: #1a2744; padding: 28px 48px; text-align: center; }
    .footer-links { margin-bottom: 14px; }
    .footer-links a { font-size: 12px; color: #a8b4cc; text-decoration: none; margin: 0 10px; letter-spacing: 0.05em; }
    .footer-links a:hover { color: #c9a84c; }
    .footer-divider { width: 40px; height: 1px; background: #c9a84c; margin: 14px auto; opacity: 0.5; }
    .footer p { font-size: 11px; color: #6a7a99; line-height: 1.7; font-weight: 300; letter-spacing: 0.03em; }
    @media (max-width: 640px) {
      .email-wrapper { margin: 0; border-radius: 0; }
      .header, .body, .hero-band, .footer { padding-left: 28px; padding-right: 28px; }
      .otp-code { font-size: 32px; letter-spacing: 0.2em; }
      .otp-box { padding: 18px 36px; }
      .hero-band .greeting { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="logo-text">Funeral Home</div>
      <div class="logo-tagline">Honoring every life with dignity</div>
    </div>
    <div class="hero-band">
      <div class="greeting">Your <span>${escapeHtml(title)}</span></div>
    </div>
    <div class="body">
      <p>${escapeHtml(bodyIntro)}</p>

      ${
        hasOtp
          ? `
      <div class="otp-container">
        <div class="otp-label">One-Time Passcode</div>
        <div class="otp-box">
          <div class="otp-code">${escapeHtml(otpCode)}</div>
        </div>
        ${expiresInMinutes ? `<div class="otp-expiry">This code expires in <strong>${escapeHtml(expiresInMinutes)} minutes</strong></div>` : ""}
      </div>`
          : ""
      }

      ${
        hasCta
          ? `
      <div class="cta-container">
        <a class="cta-button" href="${escapeHtml(ctaUrl)}">${escapeHtml(ctaLabel || "Continue")}</a>
      </div>`
          : ""
      }

      ${bodyOutro ? `<p>${escapeHtml(bodyOutro)}</p>` : ""}

      <hr class="divider" />

      <div class="security-notice">
        <p>
          <strong>Didn't request this?</strong> ${escapeHtml(notice || "If you did not request this email, you can safely ignore it.")}
        </p>
      </div>
    </div>
    <div class="footer">
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Help Center</a>
        <a href="#">Find a Memorial</a>
      </div>
      <div class="footer-divider"></div>
      <p>
        © 2026 Funeral Home. All rights reserved.<br/>
        You are receiving this email because an action was initiated for this address.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Build a mail transporter from environment configuration.
 *
 * @returns {import("nodemailer").Transporter | null}
 */
function createMailTransporter() {
  const smtpUrl = process.env.EMAIL_SMTP_URL || process.env.SMTP_URL;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (smtpUrl) {
    return nodemailer.createTransport(smtpUrl);
  }

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * Send an email using the configured transporter.
 * Falls back to logging in development when SMTP is not configured.
 *
 * @param {object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.title
 * @param {string} options.bodyIntro
 * @param {string} [options.bodyOutro]
 * @param {string} [options.otpCode]
 * @param {number} [options.expiresInMinutes]
 * @param {string} [options.ctaUrl]
 * @param {string} [options.ctaLabel]
 * @param {string} [options.notice]
 * @returns {Promise<void>}
 */
async function sendMail(options) {
  const { to, subject } = options;
  const transporter = createMailTransporter();
  const from =
    process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@example.com";
  const html = renderEmailTemplate({
    ...options,
    subjectLine: subject,
  });

  if (!transporter) {
    console.log("Mail transport not configured. Email preview:", {
      to,
      subject,
      html,
    });
    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    text: options.text || options.bodyIntro,
    html,
  });
}

module.exports = { sendMail };
