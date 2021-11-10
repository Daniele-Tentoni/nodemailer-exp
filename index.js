"use strict";

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const nodemailer = require("nodemailer");

app.get("/", (req, res) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  transport
    .sendMail({
      from: "Try",
      to: process.env.DEST,
      subject: "Hello",
      html: "Hello world!",
    })
    .then((res) => console.log("Yes:", res))
    .catch((error) => console.error("Error:", error))
    .finally((after) => console.log("After:", after));
});

app.listen(process.env.PORT, () => {
  console.log("Application running.");
});

module.exports = { app };
