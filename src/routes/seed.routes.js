const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("../config/env");
const Admin = require("../models/admin.model");
const Content = require("../models/content.model");
const { asyncHandler } = require("../middleware/error.middleware");

const router = Router();

/* POST /api/seed
   Temporary one-time route, same as `npm run seed`:
   creates the admin account if none exists yet.
   Does nothing when an admin already exists.
   Remove this route after the first successful seed. */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const existing = await Admin.findOne();
    if (existing) {
      return res.json({ ok: true, created: false, email: existing.email });
    }
    const hash = await bcrypt.hash(config.admin.password, 10);
    const admin = await Admin.create({ email: config.admin.email, passwordHash: hash });
    await Content.getSingleton();
    res.json({ ok: true, created: true, email: admin.email });
  }),
);

module.exports = router;
