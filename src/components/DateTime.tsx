"use client";

import { useState, useEffect } from "react";

const DateTime: React.FC<{ locale?: string; options?: Intl.DateTimeFormatOptions }> = ({
  locale = "en-US",
  options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" },
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-md font-bold">
      {new Intl.DateTimeFormat(locale, options).format(currentDate)}
    </div>
  );
};

export default DateTime;
