import {
  GetDataQuery,
  GetDataResponse,
  HttpError,
  getData,
} from "../../services/api-client";
import ms from "ms";

const getSumOfDailyRecord = async (tag: string) => {
  const params: GetDataQuery = {
    TagName: tag,
    StartTime: "NOW-24H",
    EndTime: "NOW",
    OutputTimeFormat: 2,
    MaxRows: 24,
    MinimumConfidense: 100,
    SampleInterval: ms("1h"),
  };
  try {
    const res: GetDataResponse[] = await getData({ params });

    const sum = res[0].Value.reduce((acc, value) => acc + value, 0);
    return sum;
  } catch (error) {
    const { response } = error as HttpError;
    throw Error(response?.data.message);
  }
};

export default getSumOfDailyRecord;
