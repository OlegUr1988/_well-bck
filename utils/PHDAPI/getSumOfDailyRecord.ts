import _ from "lodash";
import PHDQuery from "../../constants/PHDQuery";
import {
  GetDataQuery,
  GetDataResponse,
  HttpError,
  getData,
} from "../../services/api-client";

const getSumOfDailyRecord = async (tag: string) => {
  try {
    const averages = await getAveragesForLastDay(tag);
    return _.sum(averages);
  } catch (error) {
    const { response } = error as HttpError;
    throw Error(response?.data.message);
  }
};

const getAveragesForLastDay = async (tag: string) => {
  const averages: number[] = [];
  for (let hour = 24; hour > 0; hour--) {
    const params: GetDataQuery = {
      ...PHDQuery,
      TagName: tag,
      StartTime: `NOW-${hour}H`,
      EndTime: `NOW-${hour - 1}H`,
      ReductionData: "Average",
    };

    try {
      const res: GetDataResponse[] = await getData({ params });
      averages.push(res[0].Value[0]);
    } catch (error) {
      const { response } = error as HttpError;
      throw Error(response?.data.message);
    }
  }
  return averages;
};

export default getSumOfDailyRecord;
