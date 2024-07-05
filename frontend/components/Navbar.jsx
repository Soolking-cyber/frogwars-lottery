import React from "react";
import ConnectBtn from "./subComponents/btns/ConnectBtn";
import Logo from "./subComponents/logo/Logo";

export default function Navbar() {
  return (
    <div className="px-10 py-5 border-b-[1px] font-customFont border-gray-200 flex justify-between items-center">
      <Logo />
      <ConnectBtn />
    </div>
  );
}
