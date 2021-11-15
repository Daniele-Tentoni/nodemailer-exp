/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * Daniele Tentoni wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   Daniele Tentoni
 * ----------------------------------------------------------------------------
 */
"use strict";

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

/*
app.get("/text/:msg", (req, res) =>
  send(req.params.msg, res)
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(500).json({ error }))
);
*/
const mailRouter = require("./routes/mail.routes");
app.use("/text", mailRouter);

/**
 * Start the creation of the nodemailer transport.
 * @returns {Promise<Mail>} Promise for the future nodemailer.
 */
const createDefaultProtocol = () =>
  new Promise(async (resolve, reject) => {
    const { EMAIL, PASS } = process.env.EMAIL;
    const mail = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: EMAIL,
        pass: PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    resolve(mail);
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

app.get("/", (_, res) =>
  res.status(200).json({
    services: ["nodemailer"],
    msg_endpoints: ["/text/:msg", ":service/text/:msg"],
    loop_endpoints: ["/loop/:times/:msg", ":service/loop/:times/:msg"],
  })
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

// Finish configuration steps.

/*
1. Prepare transport object
2. Prepare https://github.com/eleith/emailjs object.
3. Create a route to obtain the status of the previous services
4. Create a params to declare what service use
5. If the param is not given, choose a random service
6. In the info route, give examples of urls.
7. Add the beer license.
*/

module.exports = { app };
