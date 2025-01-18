/**
 * 航空公司枚举
 * code: 航司二字码，用于显示在输入框前缀
 * name: 航司全称
 * shortName: 航司简称
 */
export const AIRLINES = [
  {
    value: "CZ",
    code: "CZ",
    name: "中国南方航空公司",
    shortName: "南方航空",
  },
  {
    value: "MU",
    code: "MU",
    name: "中国东方航空公司",
    shortName: "东方航空",
  },
  {
    value: "CA",
    code: "CA",
    name: "中国国际航空公司",
    shortName: "国航",
  },
  {
    value: "HU",
    code: "HU",
    name: "海南航空公司",
    shortName: "海南航空",
  },
  {
    value: "3U",
    code: "3U",
    name: "四川航空公司",
    shortName: "四川航空",
  },
  {
    value: "MF",
    code: "MF",
    name: "厦门航空公司",
    shortName: "厦门航空",
  },
  {
    value: "ZH",
    code: "ZH",
    name: "深圳航空公司",
    shortName: "深圳航空",
  },
  {
    value: "FM",
    code: "FM",
    name: "上海航空公司",
    shortName: "上海航空",
  },
  {
    value: "KN",
    code: "KN",
    name: "中国联合航空公司",
    shortName: "中国联合航空",
  },
  {
    value: "GS",
    code: "GS",
    name: "天津航空公司",
    shortName: "天津航空",
  },
];

/**
 * 根据航司代码获取航司信息
 */
export const getAirlineByCode = (code) => {
  return AIRLINES.find((airline) => airline.code === code?.toUpperCase());
};

/**
 * 格式化航司信息
 * @param {string} code 航司代码
 * @param {'name' | 'shortName'} type 返回类型
 */
export const formatAirline = (code, type = "shortName") => {
  const airline = getAirlineByCode(code);
  return airline ? airline[type] : code;
};
