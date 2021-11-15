/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * Daniele Tentoni wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   Daniele Tentoni
 * ----------------------------------------------------------------------------
 */
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
