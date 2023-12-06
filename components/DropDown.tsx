"use client";

import { onClickOutside } from "@/utils/onClickOutside";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import React, { MouseEvent, useState } from "react";

const DropDown = ({
  options,
  style,
  className,
}: {
  options: string[];
  style?: React.CSSProperties;
  className?: string;
}) => {
  const [openMenu, setOpenMenu] = useState<{
    open: boolean;
    selected: string | null;
  }>({
    open: false,
    selected: "Select",
  });
  const handleOpenMenu = (e: React.MouseEvent) => {
    const { currentTarget } = e;
    setOpenMenu((prev) => ({
      ...prev,
      open: true,
    }));
    onClickOutside(currentTarget as HTMLElement, () => {
      setOpenMenu((prev) => ({
        ...prev,
        open: false,
      }));
    });
  };
  const handleClick = (e: MouseEvent, option: string) => {
    e.stopPropagation();
    setOpenMenu({
      open: false,
      selected: option,
    });
  };

  return (
    <div className={className} style={{ zIndex: 50, position: "relative" }}>
      <ul
        style={style}
        onClick={handleOpenMenu}
        className="absolute border border-neutral-200 rounded-md overflow-hidden bg-white shadow-md w-full min-w-[83px]"
      >
        {!openMenu.open && (
          <span className="pl-4 pr-6">{openMenu.selected}</span>
        )}
        {openMenu.open &&
          options.map((option) => (
            <li
              key={option + "-dropdown-btn"}
              onClick={(e) => handleClick(e, option)}
              className={`${
                option === openMenu.selected ? "bg-blue-300" : "bg-transparent"
              } pl-4 pr-6 hover:bg-blue-200`}
            >
              {option}
            </li>
          ))}
        {!openMenu.open && (
          <KeyboardArrowDownRounded className="absolute top-0 right-0" />
        )}
        {openMenu.open && (
          <KeyboardArrowUpRounded className="absolute top-0 right-0" />
        )}
      </ul>
    </div>
  );
};

export default DropDown;
