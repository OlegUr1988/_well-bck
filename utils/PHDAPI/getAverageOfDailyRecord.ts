import PHDQuery from "../../constants/PHDQuery";
import {
  GetDataQuery,
  GetDataResponse,
  HttpError,
  getData,
} from "../../services/api-client";

const getAverageOfDailyRecord = async (tag: string) => {
  const params: GetDataQuery = {
    ...PHDQuery,
    TagName: tag,
    ReductionData: "Average",
  };
  try {
    const res: GetDataResponse[] = await getData({ params });

    return res[0].Value[0];
  } catch (error) {
    const { response } = error as HttpError;
    throw Error(response?.data.message);
  }
};

export default getAverageOfDailyRecord;
