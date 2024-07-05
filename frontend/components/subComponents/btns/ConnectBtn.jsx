import { ConnectButton } from "thirdweb/react";
import React from "react";
import { client } from "../../EnterLottery";

export default function ConnectBtn() {
  return (
    <ConnectButton client={client} />
  );
}
