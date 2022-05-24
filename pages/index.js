import useSWR from "swr";
import React from "react";
import Head from "next/head";
import Link from "next/link";

// Importing dashboard components
import OneByOne from "/components/OneByOne";
import TotalTVL from "/components/TotalTVL";
import TwobyTwoChart from "/components/TwobyTwoChart";

/////////
// Fetch all portfolios to be shared among components
/////////

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function getPortfolios () {
  const queryFunction = "get-portfolios";
  const { data, error } = useSWR("/api/get-data" + "?queryFunction=" + queryFunction, fetcher);
  
  return {
    rawPortfoliosData: data,
    isLoading: !error && !data,
    isError: error,
  }
}

function getTVL () {
  const queryFunction = "get-tvl";
  const { data, error } = useSWR("/api/get-data" + "?queryFunction=" + queryFunction, fetcher);

  return {
    rawTvlData: data,
    isLoading: !error && !data,
    isError: error,
  }
}

function calculateMetricsFromPortfolios (portfolios, tvl) {

  let d = new Date();
  let curr_date = d.getDate();
  let last_wk = curr_date - 7;

  let port_above_0 = 0;
  let port_above_50 = 0;
  let port_above_1000 = 0;
  
  let counts = {};
  let counts_10 = {};
  console.log("portfoio", portfolios);
  for (const port of portfolios) {
    
    // Counting Unique Deposit Addresses (UDAs)
    counts[port.ownerAddress] = 1 + (counts[port.ownerAddress] || 0);

    if (port.cached.value >10) {
      counts_10[port.ownerAddress] = 1 + (counts_10[port.ownerAddress] || 0);
    }

    // Summing # of ports on each value threshold
    if (port.cached.value > 1000) {
      port_above_0++;
      port_above_50++;
      port_above_1000++;
    } else if (port.cached.value > 50) {
      port_above_0++;
      port_above_50++;
    } else {
      port_above_0++;
    }
  }

  let latestPortfolios = portfolios.slice(portfolios.length-10,portfolios.length);
  const latestPortfoliosHeader = {
    header1: "nftId", 
    header2: "Date", 
    header3: "TVL"
  };

  return {
    "data": {
      "tvl": ["TVL", tvl, "$_thousands", "Total Value Locked"],
      "port_0": ["Baskets > $0", port_above_0, "int", ""],
      "port_50": ["Baskets > $50", port_above_50, "int", ""],
      "port_1000": ["Baskets > $1k", port_above_1000, "int", ""],
      "uda": ["UDA", Object.keys(counts).length, "int", "Unique Deposit Address"],
      "active_users": ["Active users", Object.keys(counts_10).length, "int", "UDA with value > $10"],
      "latestPorts": ["Latest baskets", latestPortfolios, "table", latestPortfoliosHeader, ""],
      "latestTransacs": ["Latest transactions", "", "table", ""],
      "portfolios": ["Raw portfolios", portfolios, "", ""]
    }
  }

}

export default function Test() {

  //const queryFunction = "get-portfolios";
  //const { data, error } = useSWR("/api/get-data" + "?queryFunction=" + queryFunction, fetcher);

  const { rawPortfoliosData, isLoading, error } = getPortfolios();
  
  const { rawTvlData, isLoadingTVL, errorTVL } = getTVL();
  

  if (error) return <div>failed to load</div>
  if (isLoading) return (
    <div className="relative w-screen h-screen font-mono bg-sky-900 p-10">
      <div className="content-center"><h1 className="animate-pulse text-center text-4xl text-white font-mono mb-10">Loading</h1></div>
    </div>
  )
  
  const { data } = calculateMetricsFromPortfolios(rawPortfoliosData.portfolios, rawTvlData.tvl);

  console.log("data", data);
  return (
    <div className="relative w-full h-full font-mono bg-sky-900">
      <Head>
        <title>Baskboard</title>
        <meta name="description" content="The ultimate DeFi Basket dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="p-5 pt-10 mx-auto">
        <h1 className="text-center text-4xl text-white font-mono mb-10">
          DeFi Basket Dashboard
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