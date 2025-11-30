import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_ACCOUNT,
    pass: process.env.MAILER_PASSWORD,
  },
});

const htmlTemplate = `<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 8px;
      background-color: #faf8f2;
      color: #333;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <!-- Container -->
    <div
      style="
        max-width: 520px;
        margin: 0 auto;
        background: #ffffff;
        padding: 40px 30px;
        border-radius: 12px;
      "
    >
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 25px;">
        <p style="font-size: 26px; font-weight: bold; color: #000; letter-spacing: 2px; margin: 0;">
        TRIPLY
        </p>
        </div>

      <!-- Illustration -->
      <div style="text-align: center; margin-top: 10px;">
        <p style="
            font-size: 40px;
            font-weight: bold;
            color: #061bff;
            letter-spacing: 8px;
            margin: 0;
            ">
        {{CODE}}
        </p>
       </div>


      <!-- Title -->
      <h2
        style="
          text-align: center;
          font-size: 26px;
          color: #333;
          margin-top: 30px;
          margin-bottom: 10px;
        "
      >
        Verify your email address
      </h2>

      <!-- Subtitle -->
      <p style="text-align: center; font-size: 15px; line-height: 22px;">
        You’re almost there!
        Use the verification code below to continue your journey with us.
        Please note that this code is valid for only <b>2 minutes</b>, so be sure to use it soon.
      </p>


      <!-- Footer -->
      <p
        style="
          text-align: center;
          font-size: 13px;
          color: #777;
          line-height: 20px;
        "
      >
        If you have any questions, please visit our FAQs or contact us at
        <a href="mailto:help@example.com" style="color:#061bffff;">help@example.com</a>.
      </p>

      <!-- Social icons -->
      <div style="text-align: center; margin-top: 25px;">
        <a href="#">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="22" />
        </a>
        <a href="#" style="margin:0 12px;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" width="22" />
        </a>
        <a href="#">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="22" />
        </a>
      </div>
    </div>
  </body>
</html>
`;

export const mailTemplate = async ({
  from,
  to,
  subject,
  text,
  code,
}: {
  from: string;
  to: string;
  subject: string;
  text: string;
  code: string;
}) => {
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: htmlTemplate.replace("{{CODE}}", code),
  });
  console.log("Message sent: %s", info.messageId);
};

//run mail test
