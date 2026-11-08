const nodemailer = require("nodemailer");
const config = require("../config/env");

let transporter = null;

/* Lazily builds (and caches) the SMTP transporter. */
function getTransporter() {
  if (!config.smtp.enabled) return null;
  if (!transporter) {
    const cleanHost = String(config.smtp.host || "").trim().replace(/^["']|["']$/g, "");
    transporter = nodemailer.createTransport({
      host: cleanHost,
      port: config.smtp.port || 587,
      secure: config.smtp.port === 465,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });
  }
  return transporter;
}

/** Escapes special HTML characters to prevent broken layouts or XSS */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* Sends the OTP email for admin password resets. */
async function sendOtpEmail(to, code) {
  const transport = getTransporter();

  if (!transport) {
    console.log("\n===============================================");
    console.log(` [OTP] SMTP not configured. Code for ${to}: ${code}`);
    console.log("===============================================\n");
    return { sent: false, fallback: "console" };
  }

  try {
    await transport.sendMail({
      from: config.smtp.from,
      to,
      subject: "Your verification code",
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#0b0b0b;padding:24px">
          <div style="max-width:480px;margin:0 auto;background:#151515;border:1px solid #2a2a2a;border-radius:12px;padding:28px">
            <p style="color:#9ca3af;margin:0 0 8px">Your verification code is</p>
            <h1 style="color:#ffc107;letter-spacing:8px;margin:0 0 16px">${code}</h1>
            <p style="color:#9ca3af;margin:0">It expires in 10 minutes. If you did not request this, you can ignore this email.</p>
          </div>
        </div>`,
    });
    console.log(`[mail] OTP email sent successfully to ${to}`);
    return { sent: true };
  } catch (err) {
    console.error("[mail] Error sending OTP email:", err.message);
    throw new Error(`Email sending failed: ${err.message}`);
  }
}

/**
 * Sends an executive, clean notification email to the Admin (Portfolio Owner)
 * whenever a visitor or client submits the contact form.
 * Zero emojis, clean RFC headers, optimized for inbox deliverability.
 */
async function sendContactNotificationToAdmin({ to, clientName, clientEmail, subject, message, date }) {
  const transport = getTransporter();
  if (!transport) {
    console.log(` [INQUIRY] SMTP not configured. Notification for ${to} skipped.`);
    return { sent: false, fallback: "console" };
  }

  const safeName = escapeHtml(clientName);
  const safeEmail = escapeHtml(clientEmail);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const formattedDate = date ? new Date(date).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }) : new Date().toLocaleString();

  const replyMailto = `mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent("Re: " + subject)}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry: ${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background-color:#08080a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#08080a;padding:40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background-color:#121216;border:1px solid #23232c;border-radius:16px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.8);">
          
          <!-- Top Accent Gold Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, #FFC107 0%, #FFE082 50%, #FFC107 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding:34px 38px 24px 38px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <!-- Pill Tag (Clean text, no emojis) -->
                    <span style="display:inline-block;padding:5px 14px;background-color:rgba(255,193,7,0.12);border:1px solid rgba(255,193,7,0.32);border-radius:24px;color:#FFC107;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;">
                      PORTFOLIO INQUIRY
                    </span>
                    <h1 style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;margin:0 0 8px 0;letter-spacing:-0.3px;">
                      New Message from ${safeName}
                    </h1>
                    <p style="color:#9ca3af;font-size:14px;line-height:1.5;margin:0;">
                      A new client inquiry has been submitted through your portfolio contact form.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 38px;">
              <div style="height:1px;background-color:#202028;"></div>
            </td>
          </tr>

          <!-- Content Details Area -->
          <tr>
            <td style="padding:28px 38px 36px 38px;">
              
              <!-- Client Information Summary Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#18181f;border:1px solid #292934;border-radius:12px;margin-bottom:26px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      
                      <!-- Sender Name -->
                      <tr>
                        <td width="30%" style="padding:7px 0;color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Client Name</td>
                        <td width="70%" style="padding:7px 0;color:#ffffff;font-size:14px;font-weight:600;">${safeName}</td>
                      </tr>
                      
                      <!-- Sender Email -->
                      <tr>
                        <td style="padding:7px 0;color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Email Address</td>
                        <td style="padding:7px 0;">
                          <a href="mailto:${safeEmail}" style="color:#FFC107;font-size:14px;font-weight:600;text-decoration:none;">
                            ${safeEmail}
                          </a>
                        </td>
                      </tr>

                      <!-- Subject Line -->
                      <tr>
                        <td style="padding:7px 0;color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Topic</td>
                        <td style="padding:7px 0;color:#ffffff;font-size:14px;font-weight:600;">${safeSubject}</td>
                      </tr>

                      <!-- Date & Time -->
                      <tr>
                        <td style="padding:7px 0;color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Submitted At</td>
                        <td style="padding:7px 0;color:#a1a1aa;font-size:13px;">${formattedDate}</td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Section Header -->
              <p style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 10px 0;">
                Message Content:
              </p>

              <!-- Message Box with Golden Left Border -->
              <div style="background-color:#0b0b0e;border:1px solid #23232c;border-left:4px solid #FFC107;border-radius:8px;padding:22px;color:#e4e4e7;font-size:14px;line-height:1.75;margin-bottom:32px;">
                ${safeMessage}
              </div>

              <!-- Quick Action Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${replyMailto}" style="display:inline-block;background-color:#FFC107;color:#000000;font-size:13px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;text-decoration:none;padding:14px 34px;border-radius:28px;">
                      Reply to ${safeName}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="padding:22px 38px;background-color:#0c0c0e;border-top:1px solid #1c1c22;text-align:center;">
              <p style="color:#52525b;font-size:12px;line-height:1.6;margin:0;">
                Delivered to portfolio owner address: <span style="color:#71717a;">${escapeHtml(to)}</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    await transport.sendMail({
      from: config.smtp.from,
      to,
      replyTo: clientEmail,
      subject: `Portfolio Inquiry from ${clientName}: ${subject}`,
      text: `Portfolio Inquiry\n\nClient: ${clientName} (${clientEmail})\nSubject: ${subject}\nDate: ${formattedDate}\n\nMessage:\n${message}\n\nReply directly to: ${clientEmail}`,
      html,
      headers: {
        "X-Priority": "3",
      },
    });
    console.log(`[mail] Admin notification sent successfully to ${to}`);
    return { sent: true };
  } catch (err) {
    console.error(`[mail] Error sending admin notification to ${to}:`, err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * Sends a clean, executive confirmation email to the Client
 * confirming that their message has been received and will be reviewed within 24 hours.
 * Zero emojis, clean professional formatting to ensure inbox delivery.
 */
async function sendContactConfirmationToClient({ to, clientName, subject, message, ownerName, ownerEmail }) {
  const transport = getTransporter();
  if (!transport) {
    console.log(` [CONFIRMATION] SMTP not configured. Client confirmation skipped for ${to}`);
    return { sent: false, fallback: "console" };
  }

  const safeName = escapeHtml(clientName);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const brandName = escapeHtml(ownerName || "Mubashir Ahmed");
  const brandEmail = escapeHtml(ownerEmail || "muzammilahmed0013@gmail.com");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Received: Thank you for contacting ${brandName}</title>
</head>
<body style="margin:0;padding:0;background-color:#08080a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#08080a;padding:40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background-color:#121216;border:1px solid #23232c;border-radius:16px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.8);">
          
          <!-- Top Accent Gold Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, #FFC107 0%, #FFE082 50%, #FFC107 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding:34px 38px 24px 38px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <!-- Brand Top Row -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                      <tr>
                        <td align="left">
                          <span style="font-size:16px;font-weight:800;letter-spacing:-0.3px;color:#ffffff;">
                            ${brandName}<span style="color:#FFC107;">.</span>
                          </span>
                        </td>
                        <td align="right">
                          <span style="display:inline-block;padding:4px 12px;background-color:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:20px;color:#10b981;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                            MESSAGE RECEIVED
                          </span>
                        </td>
                      </tr>
                    </table>

                    <h1 style="color:#ffffff;font-size:22px;font-weight:700;line-height:1.3;margin:0 0 10px 0;letter-spacing:-0.3px;">
                      Thank you for reaching out, ${safeName}
                    </h1>
                    <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0;">
                      I have received your inquiry regarding <strong style="color:#ffffff;">"${safeSubject}"</strong> and will personally review the details.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 38px;">
              <div style="height:1px;background-color:#202028;"></div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:28px 38px 36px 38px;">
              
              <!-- 24-Hour Review Notice Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,193,7,0.06);border:1px solid rgba(255,193,7,0.22);border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <h3 style="color:#FFC107;font-size:13px;font-weight:700;margin:0 0 6px 0;text-transform:uppercase;letter-spacing:0.8px;">
                      Response Commitment
                    </h3>
                    <p style="color:#d4d4d8;font-size:13px;line-height:1.6;margin:0;">
                      I review all project inquiries personally and will respond with technical feedback and scheduling availability within <strong>24 hours</strong>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What Happens Next: 3-Step Process -->
              <p style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 14px 0;">
                Next Steps:
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#16161c;border:1px solid #262630;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #202028;">
                    <strong style="color:#FFC107;font-size:13px;">1. Project Scope Review</strong>
                    <p style="color:#9ca3af;font-size:12px;line-height:1.5;margin:4px 0 0 0;">
                      Evaluating your goals, tech stack preferences, and delivery timeline.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #202028;">
                    <strong style="color:#FFC107;font-size:13px;">2. Technical Assessment</strong>
                    <p style="color:#9ca3af;font-size:12px;line-height:1.5;margin:4px 0 0 0;">
                      Formulating the most efficient architectural approach (Full Stack MERN, React Native, or AI/ML).
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0 2px 0;">
                    <strong style="color:#FFC107;font-size:13px;">3. Direct Response</strong>
                    <p style="color:#9ca3af;font-size:12px;line-height:1.5;margin:4px 0 0 0;">
                      Sending a personalized reply directly to <span style="color:#ffffff;">${escapeHtml(to)}</span>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Copy of Submitted Message -->
              <p style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 10px 0;">
                Summary of Your Message:
              </p>
              <div style="background-color:#0b0b0e;border:1px solid #23232c;border-left:4px solid #3f3f46;border-radius:8px;padding:18px 20px;color:#a1a1aa;font-size:13px;line-height:1.7;margin-bottom:28px;">
                <strong style="color:#ffffff;display:block;margin-bottom:6px;">Subject: ${safeSubject}</strong>
                ${safeMessage}
              </div>

              <!-- Direct contact note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #202028;padding-top:20px;">
                <tr>
                  <td>
                    <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0 0 4px 0;">
                      For urgent requirements, you may reply directly to this email or reach out to:
                    </p>
                    <a href="mailto:${brandEmail}" style="color:#FFC107;font-size:13px;font-weight:600;text-decoration:none;">
                      ${brandEmail}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Signature & Footer -->
          <tr>
            <td style="padding:24px 38px;background-color:#0c0c0e;border-top:1px solid #1c1c22;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="color:#ffffff;font-size:14px;font-weight:700;margin:0 0 2px 0;">
                      ${brandName}
                    </p>
                    <p style="color:#71717a;font-size:12px;line-height:1.5;margin:0 0 10px 0;">
                      Full Stack Web & Mobile App Developer | AI/ML Engineer
                    </p>
                    <p style="color:#52525b;font-size:11px;line-height:1.5;margin:0;">
                      © ${new Date().getFullYear()} ${brandName}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const senderAddress = brandEmail ? `"${brandName}" <${brandEmail}>` : config.smtp.from;

  try {
    await transport.sendMail({
      from: senderAddress,
      to,
      replyTo: brandEmail,
      subject: `Message Received: Thank you for contacting ${brandName}`,
      text: `Hello ${clientName},\n\nThank you for reaching out! I have received your message regarding "${subject}".\nI personally review all inquiries and will respond within 24 hours.\n\nSummary of your message:\n${message}\n\nBest regards,\n${ownerName || "Mubashir Ahmed"}\n${brandEmail}`,
      html,
      headers: {
        "X-Priority": "3",
      },
    });
    console.log(`[mail] Client auto-responder sent successfully to ${to}`);
    return { sent: true };
  } catch (err) {
    console.error(`[mail] Error sending client auto-responder to ${to}:`, err.message);
    return { sent: false, error: err.message };
  }
}

module.exports = {
  sendOtpEmail,
  sendContactNotificationToAdmin,
  sendContactConfirmationToClient,
};
