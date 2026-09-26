// backend/utils/email.js
import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in backend/.env'
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  });

  return transporter;
}

export async function sendPasswordResetEmail({ to, fullName, resetUrl }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const t = getTransporter();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #f8f9ff;">
      <div style="background: #ffffff; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(118,182,227,0.08);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 56px; height: 56px; border-radius: 50%; background: #76b6e3; color: #fff; line-height: 56px; font-size: 28px;">♡</div>
          <h1 style="font-size: 22px; color: #17648d; margin: 16px 0 4px;">SmartCare Baby</h1>
        </div>

        <h2 style="font-size: 20px; color: #0b1c30; margin: 0 0 12px;">Reset your password</h2>

        <p style="font-size: 15px; color: #40484e; line-height: 1.6; margin: 0 0 12px;">
          Hi ${fullName || 'there'},
        </p>
        <p style="font-size: 15px; color: #40484e; line-height: 1.6; margin: 0 0 24px;">
          Someone (hopefully you) requested a password reset for your SmartCare Baby account.
          Click the button below to set a new password. This link is valid for <strong>15 minutes</strong>.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
             style="display: inline-block; padding: 14px 32px; background: #17648d; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 15px;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 13px; color: #71787f; line-height: 1.6; margin: 24px 0 0;">
          If the button doesn't work, paste this URL into your browser:
        </p>
        <p style="font-size: 13px; color: #17648d; word-break: break-all; margin: 6px 0 0;">
          ${resetUrl}
        </p>

        <p style="font-size: 13px; color: #71787f; line-height: 1.6; margin: 24px 0 0; padding-top: 24px; border-top: 1px solid #e5eeff;">
          If you didn't request this, ignore this email — your password won't change.
        </p>
      </div>

      <p style="text-align: center; font-size: 12px; color: #71787f; margin-top: 20px;">
        SmartCare Baby · Safe Child Health Systems
      </p>
    </div>
  `;

  const text = `Reset your SmartCare Baby password\n\nHi ${fullName || 'there'},\n\nOpen this link within 15 minutes to reset your password:\n${resetUrl}\n\nIf you didn't request this, ignore this email.`;

  return t.sendMail({
    from,
    to,
    subject: 'Reset your SmartCare Baby password',
    text,
    html,
  });
}