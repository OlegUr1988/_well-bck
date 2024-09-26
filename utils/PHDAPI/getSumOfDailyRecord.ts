import _ from "lodash";
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

const getSumOfDailyRecord = async (tag: string) => {
  try {
    const averages = await getAveragesForLastDay(tag);
    return _.sum(averages);
  } catch (error) {
    const { response } = error as HttpError;
    if (response) throw Error(response?.data.message);
  }
};

const getAveragesForLastDay = async (tag: string) => {
  const averages: number[] = [];
  const previousDay = getPreviousDayTime()
  const hoursInDay = 24;

  for (let hour = 0; hour < hoursInDay; hour++) {
    const params: GetDataQuery = {
      ...PHDQuery,
      TagName: tag,
      TimeFormat: 6,

      StartTime: moment(previousDay, [DateTimeFormat])
        .add(hour, "hours")
        .format(DateTimeFormat),
      EndTime: moment(previousDay, [DateTimeFormat])
        .add(hour + 1, "hours")
        .format(DateTimeFormat),
      ReductionData: "Average",
    };

    try {
      const res: GetDataResponse[] = await getData({ params });
      res[0].Value.length > 0
        ? averages.push(res[0].Value[0])
        : averages.push(0);
    } catch (error) {
      const { response } = error as HttpError;
      if (response) throw Error(response?.data.message);
    }
  }

  return averages;
};

export default getSumOfDailyRecord;
