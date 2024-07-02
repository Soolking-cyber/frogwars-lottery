import Head from "next/head";
import Image from "next/image";
import EnterLottery from "../components/EnterLottery";
import Navbar from "../components/Navbar";
import ConnectBtn from "../components/subComponents/btns/ConnectBtn";
import Particles from "react-tsparticles";
import tsConfig from '../configs/tsConfig.json'
import { loadFull } from "tsparticles";

export default function Home() {
  const particlesInit = async (main) => {
    console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };

  return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>FrogWars | Decentralized Lottery</title>
        <meta name="description" content="FrogWars Lottery, get a chance to win CRYSTAL" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Particles init={particlesInit} options={tsConfig} />

      <main>
        <Navbar />
        <EnterLottery />
        <button onClick="window.location='https://www.nile.build/swap?to=0x21d624c846725ABe1e1e7d662E9fB274999009Aa';">Buy Crystals</button>
      </main>
    </div>
  );
}
