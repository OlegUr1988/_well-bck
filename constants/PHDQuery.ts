import ms from "ms";
import { GetDataQuery } from "../services/api-client";

const PHDQuery: GetDataQuery = {
  TagName: "",
  StartTime: "NOW-24H",
  EndTime: "NOW",
  OutputTimeFormat: 2,
  MaxRows: 24,
  MinimumConfidense: 100,
  SampleInterval: ms("1h"),
};

export default PHDQuery;
