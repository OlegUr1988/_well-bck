import axios, { AxiosError, AxiosRequestConfig } from "axios";
import * as https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

interface TagListResponse {
  TagNumber: number;
  TagName: string;
  DataType: string;
  DataLength: number;
}

export interface GetDataResponse {
  TagName: string;
  TimeStamp: string[];
  Value: number[];
  Confidence: number[];
}

export interface GetDataQuery {
  TagName: string;
  StartTime: string;
  EndTime: string;
  OutputTimeFormat: number;
  SampleInterval: number;
  MinimumConfidense: number;
  MaxRows: number;
}

interface AxiosValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface HttpError
  extends AxiosError<AxiosValidationError, Record<string, unknown>> {}

const axiosInstance = axios.create({
  baseURL: "https://10.0.1.84:3152",
  httpsAgent: agent,
  insecureHTTPParser: true,
});

export const getTags = axiosInstance
  .get<TagListResponse>("/TagList")
  .then((res) => res.data)
  .catch((err) => err);

export const getData = (params: AxiosRequestConfig) =>
  axiosInstance
    .get<GetDataResponse[]>("/GetData", params)
    .then((res) => res.data)
    .catch((err) => err);
