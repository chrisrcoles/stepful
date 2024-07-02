const { parse } = require("date-fns");
const convertToUTC = (date, startTime, endTime) => {
  const startDateTimeStr = `${date} ${startTime}`;
  const endDateTimeStr = `${date} ${endTime}`;

  const dateFormat = 'yyyy-MM-dd HH:mm';

  const startDateTimeLocal = parse(startDateTimeStr, dateFormat, new Date());
  const endDateTimeLocal = parse(endDateTimeStr, dateFormat, new Date());

  const start = new Date(startDateTimeLocal);
  const end = new Date(endDateTimeLocal);

  const startDate = start.toISOString();
  const endDate = end.toISOString();

  return {
    start_time: startDate,
    end_time: endDate
  };
};

export {
  convertToUTC,

}