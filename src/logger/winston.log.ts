/* eslint-disable @typescript-eslint/restrict-template-expressions */
import winston from "winston";

const { combine, timestamp, label, printf } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: combine(
    label({ label: "right meow!" }),
    timestamp(),
    printf((info) => {
      return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
    }),
  ],
});
