import { JobLogger } from "../../misc/logger";
import { prisma } from "../../prisma/client";
import getSumOfDailyRecord from "./getSumOfDailyRecord";

const writeDailyRecords = async () => {
  JobLogger.info("Starting job...");
  try {
    const tags = await prisma.pHDTag.findMany();
    for (let tag of tags) {
      const sum = await getSumOfDailyRecord(tag.tagname);

      await prisma.record.create({
        data: {
          PHDTagId: tag.id,
          value: sum,
        },
      });
    }
    JobLogger.info("Job successfully executed...");
    JobLogger.info(`Added ${tags.length} records`);
  } catch (error) {
    JobLogger.error(error);
  }
};

export default writeDailyRecords;
