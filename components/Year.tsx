import React from "react";
import DropDown from "./DropDown";

const Year = ({ years }: { years: string[] }) => {
  return (
    <>
      <ul className="gap-x-2 text-lg font-bold w-fit hidden lg:flex">
        {years.map((year) => (
          <li
            key={year + "-btn-srt"}
            className="bg-purple-100 px-6 py-1 rounded-md h-fit cursor-pointer"
          >
            {year}
          </li>
        ))}
      </ul>
      <DropDown
        options={years}
        className="flex flex-col lg:hidden cursor-pointer"
      />
    </>
  );
};

export default Year;
