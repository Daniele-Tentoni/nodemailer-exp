"use strict";

const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

let transport = undefined;

/**
 * Create a protocol to use for future email sending.
 * @returns {Promise<Mail>} Future protocol to use.
 */
const createProtocol = (username, password) =>
  new Promise(async (resolve, reject) => {
    if (typeof username !== "string" || username === "") {
      username = process.env.USER;
    }

    if (typeof password !== "string" || password === "") {
      password = process.env.PASS;
    }

    const mail = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: username,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    if (mail) {
      resolve(mail);
    } else {
      reject("No transport protocol created.");
    }
  });

/**
 * Get Nodemailer instance, creating it if necessary.
 * @returns {Promise<Mail>} Nodemailer instance.
 */
const mailer = async () => {
  if (!transport) {
    transport = await createProtocol();
  }

  return transport;
};

/**
 * Send a text message with transport protocol
 * @param {string} message Message to send
 * @param {Mail} mailer Mail protocol
 * @returns Resolved promise
 */
const sendMail = (message, mailer) =>
  new Promise(async (resolve, reject) => {
    if (!mailer) {
      // Without mailer we cannot send emails.
      reject("Missing mailer");
    }

    try {
      // From here you can send an empty message.
      const result = await mailer.sendMail({
        from: `"Try" <${process.env.EMAIL}>`,
        to: process.env.DEST,
        subject: "Hello",
        message,
      });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

module.exports = { mailer, sendMail };
