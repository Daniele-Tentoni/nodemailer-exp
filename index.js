"use strict";

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const nodemailer = require("nodemailer");

const createDefaultProtocol = () =>
  nodemailer.createTransport({
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

/**
 * Send a text with transport protocol.
 * @param {*} transport Transport protocol implementation.
 * @param {*} text Text to send.
 * @returns Resolved promise.
 */
const sendMailWithText = (transport, text) =>
  new Promise((resolve, reject) => {
    transport.sendMail(
      {
        from: `"Try" <${process.env.EMAIL}>`,
        to: process.env.DEST,
        subject: "Hello",
        text,
      },
      function (error, result) {
        if (error) {
          console.error("Error:", error);
          reject(error);
        }

        console.log("Yes:", result);
        resolve(result);
      }
    );
  });

const send = (msg) => {
  const transport = createDefaultProtocol();
  return sendMailWithText(transport, msg);
};

app.get("/", (req, res) =>
  send("Hello world!", res)
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(500).json({ error }))
);

app.get("/text/:msg", (req, res) =>
  send(req.params.msg, res)
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(500).json({ error }))
);

app.get("/loop/:times/:msg", async (req, res) => {
  try {
    const times = Number(req.params.times || 2);
    console.log("Times:", times);
    const items = Array.from(Array(times)); //  Array.from(Array(times));
    console.log("Times:", items);
    const promises = items.map((each, i) =>
      send(`${req.params.msg}: ${each}, ${i}`)
    );
    console.log("Promises:", promises);
    const results = await Promise.all(promises);
    console.log("Results:", results);
    res.status(200).json({ results });
  } catch (error) {
    console.log("Error:", times);
    res.status(500).json({ error });
  }
});

const port = process.env.PORT || 12000;
app.listen(port, () => {
  console.log("Application running on http://localhost:12000");
});

module.exports = { app };
