"use client";

import Head from "next/head";
import Navbar from "./Navbar";
import Particles from "react-tsparticles";
import tsConfig from '../configs/tsConfig.json'
import { loadFull } from "tsparticles";
import styles from "../styles/Home.module.css";

export default function PageContent({content}) {
  const particlesInit = async (main) => {
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };

  return (
    <div className="min-h-screen bg-black ">
      <Head>
        <title>FrogWars | Decentralized Lottery</title>
        <meta name="description" content="FrogWars Lottery, get a chance to win CRYSTAL" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Particles init={particlesInit} options={tsConfig} />

      <main>
        <Navbar />
        <div className={styles.collectionContainer}>
          {content}
        </div>
        <a href="https://www.nile.build/swap?to=0x21d624c846725ABe1e1e7d662E9fB274999009Aa" type="button" className="w-40 h-10 px-4 py-2 mt-12 text-white bg-purple-600 rounded-md cursor-pointer font-customFont hover:bg-purple-700">Get Crystals</a>
      </main>
    </div>
  );
}
