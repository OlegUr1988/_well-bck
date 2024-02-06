import axios, { AxiosError, AxiosRequestConfig } from "axios";
import * as https from "https";
import { prisma } from "../prisma/client";

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

// Factory function to create axios instance with dynamic baseURL
const createAxiosInstance = async () => {
  const baseURL = await getBaseUrl();

  const axiosInstance = axios.create({
    baseURL,
    httpsAgent: agent,
    insecureHTTPParser: true,
  });

  return axiosInstance;
};

const getBaseUrl = async () => {
  const dataSource = await prisma.dataSource.findUnique({
    where: { id: 1 },
  });

  if (!dataSource) {
    throw new Error("Could not get datasource");
  }

  return `https://${dataSource.host}:${dataSource.port}`;
};

export const getTags = async () => {
  const axiosInstance = await createAxiosInstance();

  return axiosInstance
    .get<TagListResponse>("/TagList")
    .then((res) => res.data)
    .catch((err) => err);
};

export const getData = async (params: AxiosRequestConfig) => {
  const axiosInstance = await createAxiosInstance();

  return axiosInstance
    .get<GetDataResponse[]>("/GetData", params)
    .then((res) => res.data)
    .catch((err) => err);
};
