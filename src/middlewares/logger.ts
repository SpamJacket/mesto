import winston from "winston";
import expressWinston from "express-winston";
import "winston-daily-rotate-file";

const requestTransport = new winston.transports.DailyRotateFile({
  filename: "request-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
});

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    requestTransport,
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    errorTransport,
  ],
  format: winston.format.json(),
});
