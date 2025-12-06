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
<html lang="vi" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Xác minh Email</title>
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

      <!-- Code -->
      <div style="text-align: center; margin-top: 10px;">
        <p
          style="
            font-size: 40px;
            font-weight: bold;
            color: #061bff;
            letter-spacing: 8px;
            margin: 0;
          "
        >
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
        Xác minh địa chỉ email của bạn
      </h2>

      <!-- Subtitle -->
      <p style="text-align: center; font-size: 15px; line-height: 22px;">
        Bạn sắp hoàn tất rồi!
        Hãy sử dụng mã xác minh dưới đây để tiếp tục hành trình cùng chúng tôi.
        Lưu ý rằng mã này chỉ có hiệu lực trong <b>2 phút</b>, vì vậy hãy sử dụng ngay nhé.
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
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng truy cập trang FAQ hoặc liên hệ với chúng tôi tại
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
</html>`;

const googleSuccessTemplate = `<!DOCTYPE html>
<html lang="vi" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chào mừng đến với Triply</title>
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

      <!-- Title -->
      <h2
        style="
          text-align: center;
          font-size: 26px;
          color: #333;
          margin-top: 24px;
          margin-bottom: 10px;
        "
      >
        Tài khoản Triply của bạn đã được tạo thành công 🎉
      </h2>

      <!-- Subtitle -->
      <p style="text-align: center; font-size: 15px; line-height: 23px; color:#555">
        Xin chào <b>{{NAME}}</b>, <br/>
        Cảm ơn bạn đã đăng ký bằng Google! Tài khoản Triply của bạn đã được kích hoạt và sẵn sàng sử dụng.
        Hãy bắt đầu khám phá các điểm đến, nhận gợi ý du lịch và tạo lịch trình riêng cho chuyến đi của bạn ngay hôm nay.
      </p>

      <p style="text-align: center; margin-top: 20px;">
        <a
          href="{{LOGIN_LINK}}"
          style="
            display:inline-block;
            background:#061bff;
            color:white;
            padding:12px 26px;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Bắt đầu hành trình
        </a>
      </p>

      <!-- Footer -->
      <p
        style="
          text-align: center;
          font-size: 13px;
          color: #777;
          line-height: 20px;
          margin-top: 32px;
        "
      >
        Nếu bạn không thực hiện hành động này, vui lòng bỏ qua email
        hoặc liên hệ với chúng tôi ngay tại
        <a href="mailto:help@example.com" style="color:#061bff;">help@example.com</a>.
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

const googleAddScheduleSuccess = `<!DOCTYPE html>
<html lang="vi" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lịch trình đã được thêm vào Google Calendar</title>
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

      <!-- Title -->
      <h2
        style="
          text-align: center;
          font-size: 24px;
          color: #333;
          margin-top: 10px;
          margin-bottom: 14px;
        "
      >
        Lịch trình của bạn đã được thêm vào Google Calendar
      </h2>

      <!-- Subtitle -->
      <p style="text-align: center; font-size: 15px; line-height: 23px; color:#555">
        Xin chào <b>{{NAME}}</b>, <br/>
        Lịch trình <b>{{TRIP_TITLE}}</b> đã được đồng bộ thành công với Google Calendar.
        Bạn có thể dễ dàng xem, theo dõi và quản lý toàn bộ hoạt động trong chuyến đi của mình.
      </p>

      <!-- Trip info box -->
      <div
        style="
          background:#f6f6ff;
          border-left:4px solid #061bff;
          padding:14px 18px;
          border-radius:8px;
          margin-top: 22px;
          font-size:14px;
          line-height:22px;
        "
      >
        <p><b>Tên lịch trình:</b> Khám phá du lịch tại {{TRIP_TITLE}} cùng Triply</p>
        <p><b>Thời gian:</b> {{START_DATE}} – {{END_DATE}}</p>
        <p><b>Tổng số hoạt động:</b> {{TOTAL_EVENTS}}</p>
      </div>

      <p style="text-align: center; margin-top: 24px;">
        <a
          href="{{CALENDAR_LINK}}"
          style="
            display:inline-block;
            background:#061bff;
            color:white;
            padding:12px 26px;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Mở Google Calendar
        </a>
      </p>

      <!-- Footer -->
      <p
        style="
          text-align: center;
          font-size: 13px;
          color: #777;
          line-height: 20px;
          margin-top: 32px;
        "
      >
        Nếu bạn không yêu cầu thêm lịch trình này, vui lòng bỏ qua email
        hoặc liên hệ ngay với chúng tôi tại
        <a href="mailto:help@example.com" style="color:#061bff;">help@example.com</a>.
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
</html>`;

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
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: htmlTemplate.replace("{{CODE}}", code),
  });
};

export const sendGoogleSuccessEmail = async ({
  to,
  name,
  loginLink,
}: {
  to: string;
  name: string;
  loginLink: string;
}) => {
  const html = googleSuccessTemplate
    .replace("{{NAME}}", name)
    .replace("{{LOGIN_LINK}}", loginLink);

  await transporter.sendMail({
    from: "Triply <no-reply@triply.com>",
    to,
    subject: `Welcome to Triply, ${name}!`,
    text: `Your Triply account has been created successfully.`,
    html,
  });
};

export const sendGoogleAddScheduleEmail = async ({
  to,
  name,
  tripTitle,
  startDate,
  endDate,
  totalEvents,
  calendarLink,
}: {
  to: string;
  name: string;
  tripTitle: string;
  startDate: string;
  endDate: string;
  totalEvents: number;
  calendarLink: string;
}) => {
  const html = googleAddScheduleSuccess
    .replace("{{NAME}}", name)
    .replaceAll("{{TRIP_TITLE}}", tripTitle)
    .replace("{{START_DATE}}", startDate)
    .replace("{{END_DATE}}", endDate)
    .replace("{{TOTAL_EVENTS}}", totalEvents.toString())
    .replace("{{CALENDAR_LINK}}", calendarLink);

  await transporter.sendMail({
    from: "Triply <no-reply@triply.com>",
    to,
    subject: `Lịch trình "${tripTitle}" đã được thêm vào Google Calendar`,
    text: `Lịch trình "${tripTitle}" đã được đồng bộ thành công với Google Calendar.`,
    html,
  });
};
