export const convertTime = (timestamp) => {
  const time = timestamp * 1000;
  const date = new Date(time);
  return date.toLocaleString();
};

export function convertUnixTimestamp(unixTime) {
  return Math.floor(new Date(unixTime) / 1000);
}

// 取得目前 Unix 時間戳
export function getCurrentUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

// 將目前的時間戳增加一天
export function addOneDayToUnixTimestamp(timestamp) {
  const oneDayInSeconds = 24 * 60 * 60;
  return timestamp + oneDayInSeconds;
}

// 將 Unix 時間戳轉成 YYYY-MM-DD 格式
export function formatUnixTimestampToDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function convertDateStringToUnixTimestamp(dateString) {
  // 将日期字符串转换为 Date 对象
  const date = new Date(dateString);
  // 返回 Unix 时间戳（秒）
  return Math.floor(date.getTime() / 1000);
}
