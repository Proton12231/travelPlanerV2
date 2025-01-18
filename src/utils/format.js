import { getAirlineByCode } from "../constants/airlines";
import { getTrainTypeByCode } from "../constants/trains";

/**
 * 格式化航班号
 * @param {string} flightNo 航班号
 * @returns {object} { airlineCode, flightNumber }
 */
export const parseFlightNo = (flightNo) => {
  if (!flightNo) return { airlineCode: "", flightNumber: "" };

  // 提取航司代码和航班号
  const match = flightNo.match(/^([A-Z0-9]{2})(\d+)$/i);
  if (!match) return { airlineCode: "", flightNumber: flightNo };

  const [, airlineCode, flightNumber] = match;
  return {
    airlineCode: airlineCode.toUpperCase(),
    flightNumber,
  };
};

/**
 * 格式化航班号显示
 * @param {string} flightNo 航班号
 * @returns {string} 格式化后的航班号
 */
export const formatFlightNo = (flightNo) => {
  const { airlineCode, flightNumber } = parseFlightNo(flightNo);
  if (!airlineCode || !flightNumber) return flightNo;

  const airline = getAirlineByCode(airlineCode);
  if (!airline) return flightNo;

  return `${airline.shortName} ${airlineCode}${flightNumber}`;
};

export const formatTransportNo = (type, no) => {
  if (!no) return "";

  switch (type) {
    case "plane": {
      const { airlineCode, flightNumber } = parseFlightNo(no);
      if (!airlineCode) return no;
      const airline = getAirlineByCode(airlineCode);
      return airline ? `${airlineCode} ${flightNumber}` : no;
    }
    case "train": {
      // 如果已经包含前缀，提取出来
      const match = no.match(/^([GDCZKY])?(\d+)$/i);
      if (!match) return no;

      const [, prefix = "G", number] = match;
      return `${prefix.toUpperCase()} ${number}`;
    }
    case "bus":
      return `汽${no}`;
    default:
      return no;
  }
};
