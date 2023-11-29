import React, { Dispatch, SetStateAction } from "react";

const ItemView = ({
  setView,
}: {
  setView: Dispatch<SetStateAction<"small" | "medium" | "large">>;
}) => {
  return (
    <ul className="flex flex-col font-bold gap-y-1 text-white sticky top-8 h-fit w-fit pr-4 pt-4">
      <button
        className="bg-pink-300 rounded-md w-10 h-10"
        onClick={(e) => setView("small")}
      >
        S
      </button>
      <button
        className="bg-indigo-300 rounded-md w-10 h-10"
        onClick={(e) => setView("medium")}
      >
        M
      </button>
      <button
        className="bg-orange-300 rounded-md w-10 h-10"
        onClick={(e) => setView("large")}
      >
        L
      </button>
    </ul>
  );
};

export default ItemView;
