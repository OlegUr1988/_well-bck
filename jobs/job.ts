import schedule from "node-schedule";
import writeDailyRecords from "../utils/PHDAPI/writeDailyRecords";

const job = schedule.scheduleJob("0 2 * * *", () => {
  writeDailyRecords();
});

export default job;
