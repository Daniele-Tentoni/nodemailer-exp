"use strict";

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const nodemailer = require("nodemailer");

const send = (msg, res) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  transport.sendMail(
    {
      from: `"Try" <${process.env.EMAIL}>`,
      to: process.env.DEST,
      subject: "Hello",
      text: msg,
    },
    function (error, result) {
      if (error) {
        console.error("Error:", error);
        return res.status(500).json({ error });
      }

      console.log("Yes:", result);
      return res.status(200).json({ result });
    }
  );
};

app.get("/", (req, res) => send("Hello world!", res));

app.get("/text/:msg", (req, res) => send(req.params.msg, res));

const port = process.env.PORT || 12000;
app.listen(port, () => {
  console.log("Application running on http://localhost:12000");
});

module.exports = { app };
