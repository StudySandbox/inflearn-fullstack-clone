// 초 -> xx:xx(분:초) 전환
export const formatSecondsToMinSec = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

// 초 -> x시간 x분 전환
export const formatSecondsToHourMin = (seconds: number) => {
  const hours = Math.floor(seconds / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  if (hours === 0) return `${minutes}분`;

  return `${hours}시간 ${minutes}분`;
};

// 날짜 전환
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
