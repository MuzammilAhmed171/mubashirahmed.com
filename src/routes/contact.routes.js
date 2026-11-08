const { Router } = require("express");
const { asyncHandler } = require("../middleware/error.middleware");
const contentService = require("../services/content.service");
const mailService = require("../services/mail.service");
const config = require("../config/env");

const router = Router();

/* POST /api/contact
   Public contact-form submission.
   1. Appends the message to the content document so it shows up in the admin panel inbox.
   2. Sends a styled inquiry alert email to the professional email saved in MongoDB.
   3. Sends an auto-responder confirmation email to the visitor/client with a 24-hour SLA promise. */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const record = {
      id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      date: new Date().toISOString(),
      read: false,
    };

    // 1. Always save in MongoDB first so it appears in Admin Inbox
    await contentService.addMessage(record);

    // 2. Fetch live settings from database to get the active professional email
    try {
      const liveContent = await contentService.getContent();
      const adminRecipient = (liveContent?.settings?.email || config.admin.email || "").trim();
      const ownerName = (liveContent?.hero?.name || liveContent?.settings?.copyrightName || "Mubashir Ahmed").trim();

      // Send both emails in background
      Promise.allSettled([
        // A. Email to Admin (User)
        adminRecipient
          ? mailService.sendContactNotificationToAdmin({
              to: adminRecipient,
              clientName: record.name,
              clientEmail: record.email,
              subject: record.subject,
              message: record.message,
              date: record.date,
            })
          : Promise.resolve(),

        // B. Confirmation Email to Client
        mailService.sendContactConfirmationToClient({
          to: record.email,
          clientName: record.name,
          subject: record.subject,
          message: record.message,
          ownerName: ownerName,
          ownerEmail: adminRecipient,
        }),
      ]).then((results) => {
        results.forEach((r, idx) => {
          if (r.status === "rejected") {
            console.error(`[contact] Email task ${idx === 0 ? "admin" : "client"} failed:`, r.reason);
          }
        });
      });
    } catch (mailErr) {
      console.error("[contact] Could not dispatch emails:", mailErr.message);
    }

    res.json({ ok: true, id: record.id });
  }),
);

module.exports = router;
