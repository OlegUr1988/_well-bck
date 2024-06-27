import moment from "moment";
import { JobLogger } from "../../misc/logger";
import { prisma } from "../../prisma/client";
import getSumOfDailyRecord from "./getSumOfDailyRecord";
import getAverageOfDailyRecord from "./getAverageOfDailyRecord";

const writeDailyRecords = async () => {
  JobLogger.info("Starting job...");

  const timestamp = moment().format("YYYY-MM-DDTHH:mm:ss");

  try {
    const tags = await prisma.pHDTag.findMany({ include: { unit: true } });
    for (let tag of tags) {
      const value =
        tag.unit.name === "%"
          ? await getAverageOfDailyRecord(tag.tagname)
          : await getSumOfDailyRecord(tag.tagname);

      await prisma.record.create({
        data: {
          PHDTagId: tag.id,
          value: value | 0,
          timestamp,
        },
      });
      JobLogger.info(
        `Tagname: ${tag.tagname}, Value: ${
          value ? value : "replaced with 0 since no value provided by PHD"
        }, Units: ${tag.unit.name}`
      );
    }
    JobLogger.info("Job successfully executed...");
    JobLogger.info(`Added ${tags.length} records`);
  } catch (error) {
    JobLogger.error(error);
  }
};

export default writeDailyRecords;
