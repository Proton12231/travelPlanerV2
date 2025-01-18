/**
 * 火车类型枚举
 * code: 车次前缀字母
 * name: 类型全称
 * shortName: 类型简称
 */
export const TRAIN_TYPES = [
  {
    code: "G",
    name: "高速动车组列车",
    shortName: "高铁",
  },
  {
    code: "D",
    name: "动车组列车",
    shortName: "动车",
  },
  {
    code: "C",
    name: "城际动车组列车",
    shortName: "城际",
  },
  {
    code: "Z",
    name: "直达特快列车",
    shortName: "直特",
  },
  {
    code: "T",
    name: "特快列车",
    shortName: "特快",
  },
  {
    code: "K",
    name: "快速列车",
    shortName: "快车",
  },
  {
    code: "Y",
    name: "旅游列车",
    shortName: "旅游",
  },
];

/**
 * 根据车次前缀获取火车类型信息
 */
export const getTrainTypeByCode = (code) => {
  return TRAIN_TYPES.find((type) => type.code === code?.toUpperCase());
};

/**
 * 格式化火车类型信息
 * @param {string} code 车次前缀
 * @param {'name' | 'shortName'} type 返回类型
 */
export const formatTrainType = (code, type = "shortName") => {
  const trainType = getTrainTypeByCode(code);
  return trainType ? trainType[type] : code;
};
