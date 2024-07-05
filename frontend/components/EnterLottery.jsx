import React, { useEffect, useState } from "react";
import { contractAddresses, abi, IERC20 } from "../constants";
import {linea} from 'thirdweb/chains';
import { ethers } from "ethers";
import { Loading, useNotification } from "web3uikit";
import { 
  useReadContract,
  useActiveWalletConnectionStatus,  
  // getGasPrice, 
  useActiveAccount,
} from "thirdweb/react";
import {createThirdwebClient, getContract} from "thirdweb";
import {ethers5Adapter} from "thirdweb/adapters/ethers5"
import { useRouter } from "next/router";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
});

export default function EnterLottery() {
  const [entranceFee, setEntranceFee] = useState();
  const [lotteryNotOpen, setLotteryNotOpen] = useState(false);
  const [recentWinner, setRecentWinner] = useState();
  const [allPlayers, setAllPlayers] = useState();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(true);
  const [totalBalance, setTotalBalance] = useState("0.0");
  const router = useRouter();
  
  const chain = linea;
  const account = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus()
  const dispatch = useNotification();

  const lotteryAddress =
    chain && chain.id in contractAddresses ? contractAddresses[chain.id][0] : null;
  const tokenAddress = chain && chain.id in contractAddresses ? contractAddresses[chain.id][1] : null;


  const approveRaw = async function() {
    const signer = await ethers5Adapter.signer.toEthers({client, account, chain});
    const contract = new ethers.Contract(tokenAddress, IERC20, signer);

    const transaction = await contract.approve(
        lotteryAddress,
        ethers.utils.parseEther("1000"),{
          // gasLimit: 200000,
          // gasPrice: gasPrice,
    });
    return transaction;
  }

  const enterLotteryRaw = async function() {
    // const provider = getChainProvider(Linea);
    // const gasPrice = await getGasPrice(provider);
    const signer = await ethers5Adapter.signer.toEthers({client, account, chain});

    const contract = new ethers.Contract(lotteryAddress, abi, signer);

    const transaction = await contract.enterLottery({
      // gasLimit: 200000,
      // gasPrice: gasPrice,
    });
    return transaction;
  }

  const contract = getContract({client, chain, address: lotteryAddress, abi: abi });
  const token = getContract({client, chain, address: tokenAddress, abi: IERC20});

  console.log(lotteryAddress);
  console.log(tokenAddress);
console.log(chain);
console.log(contract);

  const {data: getEntranceFee,
    isLoading,
    isFetching,
  } = useReadContract({
    contract,
    method: "getEntranceFee",
    // params: {},
  });

  const { data: getNumbersOfPlayers } = useReadContract({
    contract,
    method: "getNumbersOfPlayers",
    // params: {},
  });

  const { data: getRecentWinner } = useReadContract({
    contract,
    method: "getRecentWinner",
    // params: {},
  });

  const { data: getLotteryState } = useReadContract({
    contract,
    method: "getLotteryState",
    // params: {},
  });

  const { data: getAllowance } = useReadContract({
    contract: token,
    method: "allowance",
    params: [account.address, lotteryAddress],
  });

  const { data: getTotalBalance } = useReadContract({
    contract: token,
    method: "balanceOf",
    params: [lotteryAddress],
  });

  const handleClick = async () => {
    setBtnLoading(true);

    const allowanceWei = getAllowance;
    const allowance = parseFloat(ethers.utils.formatEther(allowanceWei));
    const fee = parseFloat(ethers.utils.formatUnits(entranceFee));

    if (allowance < fee) {
      let approveTx = undefined;
      try {
        approveTx = await approveRaw();
        await approveTx.wait(1);
        handleNewNotification(approveTx);
      } catch(error) {
        console.error(error);
        return;
      }
    }

    let tx = undefined;
    try {
      tx = await enterLotteryRaw();
      await handleSuccess(tx);
    } catch (error) {
      console.log(error);
    }

  };

  // Notifications
  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    setBtnLoading(false);

    router.refresh();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Completed Successfully",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  useEffect(() => {
    if (connectionStatus === "connected" && lotteryAddress && getEntranceFee !== undefined && 
      getNumbersOfPlayers !== undefined && getTotalBalance !== undefined && 
      getAllowance !== undefined && 
      getLotteryState !== undefined) {
      const getAll = async () => {
        const getFee = (getEntranceFee).toString();
        const getNumOfPlayers = (getNumbersOfPlayers).toString();
        const getWinner = getRecentWinner;
        const getState = getLotteryState;
        setEntranceFee(getFee);
        setAllPlayers(getNumOfPlayers);
        setRecentWinner(getWinner);
        console.log(`State is: ${getState}. Closed? ${(getState != 1)}`);
        setLotteryNotOpen(getState != 1);

        const getBalance = getTotalBalance;
        setTotalBalance(ethers.utils.formatEther(getBalance));
      };
      getAll();
    }
  }, [connectionStatus, getEntranceFee, getNumbersOfPlayers, getTotalBalance, getAllowance, getLotteryState]);

  return (
    <div className="px-10 py-5">
      {lotteryAddress ? (
        <div className="space-y-5">
          <p className=" text-[50px] text-purple-500 font-customFont text-center space-x-5"> 
            <span className="px-5 text-green-500 font-customFont">
              {entranceFee && ethers.utils.formatUnits(entranceFee, "ether")} CRYSTAL
            </span>
          </p>
          <p className=" text-[50px] text-purple-500 font-customFont text-center space-x-5">
            Current Pot =
            <span className="px-5 text-green-500 font-customFont">
              {parseFloat(totalBalance).toFixed(4).toString()} CRYSTAL
            </span>
          </p>
          <p className="text-4xl font-semibold text-center text-gray-300 font-customFont">Players = <span className="text-green-500">
          {allPlayers && allPlayers}
            </span> </p>
          <p className="flex items-center justify-center gap-x-2"> <img className="w-20" src="/images/award-img.png" alt="Winner" /> <span className="text-3xl text-gray-300"> Recent Winner: {recentWinner && !showFullAddress ? recentWinner : recentWinner?.slice(0,6) + "..." + recentWinner?.slice(recentWinner?.length-6)} </span>
           <span>
            <button className="px-3 py-1 text-white bg-blue-500 rounded-md" onClick={() => setShowFullAddress(!showFullAddress)}>{showFullAddress ? "View" : "Hide"}</button>
           </span>
          </p>
          <div className="text-center">
            <button
              className="w-40 h-10 px-4 py-2 mt-12 text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700"
              disabled={isFetching || isLoading || loading || btnLoading || lotteryNotOpen}
              onClick={handleClick}
            >
              {btnLoading || isLoading || isFetching ? (
                <div>
                  <Loading fontSize={20} direction="right" spinnerType="wave" />
                </div>
              ) : (
                <div>{lotteryNotOpen ? "Lottery Not Open" : "Enter Lottery"}</div>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-white">Wallet Not Connected To Linea Mainnet (Connect Using Connect wallet Button in the top right, then switch to Linea Mainnet)</div>
      )}
    </div>
  );
}
