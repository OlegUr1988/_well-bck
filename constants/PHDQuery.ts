import ms from "ms";
import { GetDataQuery } from "../services/api-client";

const PHDQuery: GetDataQuery = {
  TagName: "",
  StartTime: "NOW-24H",
  EndTime: "NOW",
  RawData: false,
  OutputTimeFormat: 2,
  MinimumConfidence: 100,
  SampleInterval: ms("1h"),
};

export default PHDQuery;
