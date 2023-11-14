import React from "react";

const Year = ({ years }: { years: string[] }) => {
  return (
    <ul className="flex gap-x-2 text-lg font-bold w-fit col-start-2 col-end-3">
      {years.map((year) => (
        <li
          key={year + "-btn-srt"}
          className="bg-purple-100 px-12 py-2 rounded-full"
        >
          {year}
        </li>
      ))}
    </ul>
  );
};

export default Year;
