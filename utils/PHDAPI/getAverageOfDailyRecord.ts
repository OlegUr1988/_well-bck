import moment from "moment";
import { DateTimeFormat } from "../../constants/DateTimeFormats";
import PHDQuery from "../../constants/PHDQuery";
import {
  GetDataQuery,
  GetDataResponse,
  HttpError,
  getData,
} from "../../services/api-client";
import { getPreviousDayTime } from "./helperFunctions";

const getAverageOfDailyRecord = async (tag: string) => {
  const currentDay = moment().startOf("day").format(DateTimeFormat);
  const previousDay = getPreviousDayTime()

  const params: GetDataQuery = {
    ...PHDQuery,
    TagName: tag,
    TimeFormat: 6,
    StartTime: previousDay,
    EndTime: currentDay,
    ReductionData: "Average",
  };
  try {
    const res: GetDataResponse[] = await getData({ params });
    return res[0].Value.length > 0 ? res[0].Value[0] : 0;
  } catch (error) {
    const { response } = error as HttpError;
    if (response) throw Error(response?.data.message);
  }
};

export default getAverageOfDailyRecord;
