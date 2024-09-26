import moment from "moment";
import { DateFormat, DateTimeFormat } from "../../constants/DateTimeFormats";

export const getPreviousDay = () =>
  moment().subtract(1, "days").format(DateFormat);

export const getPreviousDayTime = () =>
  moment().subtract(1, "days").startOf("day").format(DateTimeFormat);
