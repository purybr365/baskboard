import useSWR from "swr";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import calculateMetricsFromPortfolios from "/components/utils/calculateWithPortfolios";

// Importing dashboard components
import OneByOne from "/components/OneByOne";
import TotalTVL from "/components/TotalTVL";
import TwobyTwoChart from "/components/TwobyTwoChart";

/////////
// Fetch all portfolios to be shared among components
/////////

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function GetPortfolios () {
  const queryFunction = "get-portfolios";
  const { data, error } = useSWR("/api/get-data" + "?queryFunction=" + queryFunction, fetcher);
  
  return {
    rawPortfoliosData: data,
    isLoading: !error && !data,
    isError: error,
  }
}

function GetTVL () {
  const queryFunction = "get-tvl";
  const { data, error } = useSWR("/api/get-data" + "?queryFunction=" + queryFunction, fetcher);

  return {
    rawTvlData: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default function Index() {

  //const queryFunction = "get-portfolios";
  //const { data, error } = useSWR("/api/get-data" + "?queryFunction=" + queryFunction, fetcher);

  const { rawPortfoliosData, isLoading, error } = GetPortfolios();
  
  const { rawTvlData, isLoadingTVL, errorTVL } = GetTVL();
  

  if (error) return <div>failed to load</div>
  if (isLoading) return (
    <div className="relative w-screen h-screen font-mono bg-sky-900 p-10">
      <div className="content-center"><h1 className="animate-pulse text-center text-4xl text-white font-mono mb-10">Loading</h1></div>
    </div>
  )
  
  const { data } = calculateMetricsFromPortfolios(rawPortfoliosData.portfolios, rawTvlData.tvl);

  // console.log("data", data);

  return (
    <div className="relative w-full h-full font-mono bg-sky-900">
      <Head>
        <title>Baskboard</title>
        <meta name="description" content="The ultimate DeFi Basket dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="p-5 pt-10 mx-auto">
        <h1 className="text-center text-4xl text-white font-mono mb-10">
          DeFi Basket Dashboard Test
        </h1>
        {!data.error ? 
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-6">

          <OneByOne data={data.uda} />
          <OneByOne data={data.active_users} />
          <OneByOne data={data.tvl} />
          <OneByOne data={data.port_0} />
          <OneByOne data={data.port_50} />
          <OneByOne data={data.port_1000} />
          <TotalTVL data={data.portfolios} />
 
        </div>
        :
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-6">
          <div className="col-span-2 p-5 m-2 rounded-lg bg-sky-800 text-center">
            <span className="bg-red-500 bg-opacity-50 rounded-md text-center text-xl text-white font-mono mb-10">Error - Couldn&apos;t update data <br />
            Message: {data.error_msg}</span>
          </div>
        </div>
        }
      </main>

      <footer className="relative w-full text-center border-sky-800 p-3">
        <span className="text-sky-400 font-mono text-sm font-light">
          Made with &hearts;<br /> 
          <Link href="https://github.com/purybr365/baskboard" className="hover:underline underline-offset-2">GitHub</Link>
          {" "}|{" "}
          <Link href="https://discord.gg/5AVTGwkCEs" className="hover:underline underline-offset-2">Discord</Link>

        </span>
        
      </footer>
    </div>
  )
}