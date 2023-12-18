import winston from "winston";
import fs from "fs";

const basePath = "logs/";
export const assetsLogPath = basePath + "assets-import.log";
export const equipmentsLogPath = basePath + "equipments-import.log";

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const deleteLog = (path: string) => {
  if (fs.existsSync(path)) {
    fs.truncateSync(path);
  }
};

export const assetLogger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.File({
      filename: "logs/assets-import.log",
    }),
  ],
});

export const equipmentLogger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.File({
      filename: "logs/equipments-import.log",
    }),
  ],
});
