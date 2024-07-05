import React, { useEffect } from "react";
import EnterLottery from "./EnterLottery";
import ConnectBtn from "./subComponents/btns/ConnectBtn";
import Logo from "./subComponents/logo/Logo";
// import { useMoralis } from "react-moralis";

export default function Navbar() {
  return (
    <div className="px-10 py-5 border-b-[1px] font-customFont border-gray-200 flex justify-between items-center">
      <Logo />
      <ConnectBtn />
      <a href="https://www.nile.build/swap?to=0x21d624c846725ABe1e1e7d662E9fB274999009Aa" type="button" className="w-40 h-10 px-4 py-2 mt-12 text-white bg-purple-600 rounded-md cursor-pointer font-customFont hover:bg-purple-700">Get Crystals</a>
    </div>
  );
}
