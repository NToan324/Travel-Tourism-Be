import { google } from "googleapis";

import { type User } from "@/models/user.model";

const scopes = ["https://www.googleapis.com/auth/calendar"];

const oauth2Client = new google.auth.OAuth2(
  process.env.CALENDAR_CLIENT_ID,
  process.env.CALENDAR_CLIENT_SECRET,
  process.env.CALENDAR_REDIRECT_URI
);

const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

const getOAuthClientFromUser = (user: User) => {
  oauth2Client.setCredentials({
    access_token: user.googleCalendar?.accessToken,
    refresh_token: user.googleCalendar?.refreshToken,
  });

  return oauth2Client;
};

export { calendar, getOAuthClientFromUser, oauth2Client, scopes };
