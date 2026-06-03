const nodemailer = require("nodemailer");

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
 * @param {string} options.text
 * @param {string} [options.html]
 * @returns {Promise<void>}
 */
async function sendMail({ to, subject, text, html }) {
  const transporter = createMailTransporter();
  const from =
    process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@example.com";

  if (!transporter) {
    console.log("Mail transport not configured. Email preview:", {
      to,
      subject,
      text,
      html,
    });
    return;
  }

  await transporter.sendMail({ from, to, subject, text, html });
}

module.exports = { sendMail };
