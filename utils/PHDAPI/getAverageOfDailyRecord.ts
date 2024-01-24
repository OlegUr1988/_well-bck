import PHDQuery from "../../constants/PHDQuery";
import {
  GetDataQuery,
  GetDataResponse,
  HttpError,
  getData,
} from "../../services/api-client";

const getAverageOfDailyRecord = async (tag: string) => {
  const params: GetDataQuery = { ...PHDQuery, TagName: tag };
  try {
    const res: GetDataResponse[] = await getData({ params });

    const values = res[0].Value;

    return values.reduce((acc, value) => acc + value, 0) / values.length;
  } catch (error) {
    const { response } = error as HttpError;
    throw Error(response?.data.message);
  }
};

export default getAverageOfDailyRecord;
