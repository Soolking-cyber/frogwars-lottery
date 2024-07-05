import React from "react";
import { Loading } from "web3uikit";

export default function Btn(handleClick, disabled, children, title) {
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className="px-4 py-2 text-white bg-blue-500 rounded-md cursor-pointer font-customFont hover:bg-blue-600"
    >
      {children}
    </button>
  );
}