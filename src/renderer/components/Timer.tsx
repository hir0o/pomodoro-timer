import { useEffect, useState } from "react";
import { useTime } from "~/hooks/useTime";

const getM = (time: Date): number => {
  const minutes = time.getMinutes();
  if (minutes > 50) {
    return 59 - minutes;
  }
  return 49 - minutes;
};

const getS = (time: Date): number => {
  const seconds = time.getSeconds();
  return 59 - seconds;
};

// 8時から何回目のタイマーなのか
const getCount = (time: Date) => {
  const hours = time.getHours();
  // TODO: 24時以降の処理
  return hours - 8;
};

const zeroPadding = (num: number): string => {
  return ("0" + num.toString()).slice(-2);
};

export const PomodoroTimer = () => {
  const time = useTime();
  const [m, setM] = useState("");
  const [s, setS] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setM(zeroPadding(getM(time)));
    setS(zeroPadding(getS(time)));
    setCount(getCount(time));
  }, [time]);

  return (
    <div className="timer">
      <span className="timer__content">
        {m}:{s}
      </span>
      <span className="timer__count">#{count}</span>
    </div>
  );
};
