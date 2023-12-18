import winston from "winston";
import fs from "fs";

const basePath = "logs/";
export const assetLogPath = basePath + "asset-imports.log";

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const deleteLog = (path: string) => {
  if (fs.existsSync(path)) {
    fs.truncateSync(path);
  }
};

export const assetLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.File({
      filename: "logs/asset-imports.log",
    }),
  ],
});
