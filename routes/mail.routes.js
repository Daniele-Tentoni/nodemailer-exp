"use strict";

const router = require("express").Router();
const nmService = require("../services/nodemailer.service");

router.get("/:message", async (req, res) => {
  const { message } = req.params;
  const mailer = await nmService.mailer();
  const result = await nmService.sendMail(message, mailer);
  res.status(200).json({ result, message });
});

module.exports = router;
