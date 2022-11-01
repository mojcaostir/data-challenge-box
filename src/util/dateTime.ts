import { DateTime } from "luxon";

export function getDateTimeYesterdayMidnight(): string {
  const dateTimeYesterday = DateTime.utc().minus({ day: 1 }).toISO();
  const dateYesterday = dateTimeYesterday.split("T")[0] ?? "2022-09-01";
  return `${dateYesterday} 00:00:00`;
}
