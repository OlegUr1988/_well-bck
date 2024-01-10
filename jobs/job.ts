import schedule from "node-schedule";
import writeDailyRecords from "../utils/PHDAPI/writeDailyRecords";

const job = schedule.scheduleJob("2 0 * * *", () => {
  writeDailyRecords();
});

export default job;
