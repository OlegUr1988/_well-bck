import moment from "moment";
import ms from "ms";
import { DateFormat } from "../../constants/DateTimeFormats";
import { JobLogger } from "../../misc/logger";
import { prisma } from "../../prisma/client";
import getAverageOfDailyRecord from "./getAverageOfDailyRecord";
import getSumOfDailyRecord from "./getSumOfDailyRecord";

const MAX_RETRIES = 3; // Maximum number of retry attempts
const RETRY_DELAY = ms("5s"); // Delay between retries
const TRANSACTION_TIMEOUT = ms("10m"); // Transaction timeout in milliseconds (10 minutes)

const writeDailyRecords = async () => {
  JobLogger.info("Starting job...");

  // Getting previous date
  const timestamp = moment().subtract(1, "days").format(DateFormat);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Start a transaction
      await prisma.$transaction(
        async (tx) => {
          const tags = await tx.pHDTag.findMany({ include: { unit: true } });
          for (let tag of tags) {
            const value =
              tag.unit.name === "%"
                ? await getAverageOfDailyRecord(tag.tagname)
                : await getSumOfDailyRecord(tag.tagname);

            await tx.record.create({
              data: {
                PHDTagId: tag.id,
                value: value || 0,
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
        },
        { timeout: TRANSACTION_TIMEOUT }
      );
      break; // Break out of the loop if transaction succeeds
    } catch (error) {
      JobLogger.error(`Transaction attempt ${attempt} failed: `, error);
      if (attempt === MAX_RETRIES) {
        JobLogger.error("All retry attempts failed.");
        throw error; // Re-throw the error after all attempts failed
      }
      JobLogger.info(
        `Retrying transaction in ${RETRY_DELAY / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

export default writeDailyRecords;
