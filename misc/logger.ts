import winston from "winston";
import fs from "fs";
import moment from "moment";

const basePath = "logs/";
export const assetsLogPath = basePath + "assets-import.log";
export const equipmentsLogPath = basePath + "equipments-import.log";

const localTimestamp = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
};

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const deleteLog = (path: string) => {
  if (fs.existsSync(path)) {
    fs.truncateSync(path);
  }
};

const format = winston.format.combine(
  winston.format.timestamp({ format: localTimestamp }),
  logFormat
);

export const assetLogger = winston.createLogger({
  format,
  transports: [
    new winston.transports.File({
      filename: "logs/assets-import.log",
    }),
  ],
});

export const equipmentLogger = winston.createLogger({
  format,
  transports: [
    new winston.transports.File({
      filename: "logs/equipments-import.log",
    }),
  ],
});
