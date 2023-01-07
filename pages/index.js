import useSWR from "swr";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { calculateTvlByAssets, TvlByAssetComponent } from "/components/tvlByAsset";
// import rawAssets from "/common/assets.json";

// Importing dashboard components
import OneByOne from "/components/OneByOne";
import TotalTVL from "/components/TotalTVL";
import WeeklyFees from "/components/WeeklyFees";
import TransactionList from "/components/TransactionList";
import TwobyTwoChart from "/components/TwobyTwoChart";
import { getTxs } from "../framework/get-transactions";

/////////
// Fetch all portfolios to be shared among components
/////////

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function GetPortfolios () {
  const queryFunction = "get-portfolios&perPage=999";
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

function GetAssets () {
  const queryFunction = "get-assets&networkName=polygon&perPage=-1";
  const { data, error } = useSWR("/api/get-data" + "?queryFunction=" + queryFunction, fetcher);

  return {
    rawAssets: data,
    isLoading: !error && !data,
    isError: error,
  }
}

async function GetTransactions (tempTxsData, setTempTxsData, setTransactionsData, isLoadingTxs, setIsLoadingTxs) {
  
  let txs = [];
  let pageIndex = 0;
  setTempTxsData([]);

  await getTxs(txs, pageIndex, setIsLoadingTxs, setTransactionsData);

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

    if (port.value >10) {
      counts_10[port.ownerAddress] = 1 + (counts_10[port.ownerAddress] || 0);
    }

    // Summing # of ports on each value threshold
    if (port.value > 1000) {
      port_above_0++;
      port_above_50++;
      port_above_1000++;
    } else if (port.value > 50) {
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

// Helper function to group by week
function setToMonday( date ) {
  var day = date.getDay() || 7;  
  if( day !== 1 ) 
      date.setHours(-24 * (day - 1)); 
  return date;
}

// Helper function to find fee in USD based on latestPrice
// from assets db list
function findFeeInUsd (fee, assets) {
  //const asset = assets.find(item => item._id === fee._id);
  //const feeAmount = fee.amount ;
  
  // TODO: Replace latestPrice for historical price at fee acrrual time
  const feeInUsd = fee.currentPriceUsd * fee.amount;

  return feeInUsd;
}

function calculateMetricsFromTransactions(transactions, assets) {
  
  const sumWeeklyFees = [];
  // console.log("transac", transactions);
  if (transactions.length >0) {
    for (const transac of transactions) {
      //console.log("intrans", transac);
      // Determining fees by date
      if (transac.fees.length > 0) {
        for (const fee of transac.fees) {
          sumWeeklyFees.push({
            date: setToMonday(new Date(transac.executedOn)), 
            feeInUsd: fee.value,
          });
        }
      }
    }
  };

  // console.log("fees", sumFees);

  const weeklyFees = sumWeeklyFees.reduce((acc, obj) => {
    var existObj = acc.find(item => new Date(item.date).toDateString() === new Date(obj.date).toDateString());
    if (existObj) {
      existObj.feeInUsd = existObj.feeInUsd + obj.feeInUsd;
      return acc;
    } 
    acc.push(obj);
    return acc;
  },[]);
  
  // console.log("weeklyFee", weeklyFees);
  return weeklyFees;

  // Grouping fees by week

}

export default function App() {
  const [tempTxsData, setTempTxsData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [isLoadingTxs, setIsLoadingTxs] = useState(true);
  const [weeklyFees, setWeeklyFees] = useState([])

  const { rawPortfoliosData, isLoading, error } = GetPortfolios();
  const { rawTvlData, isLoadingTVL, errorTVL } = GetTVL();
  const { rawAssets,  isLoadingAssets, errorAssets } = GetAssets();

  const loading =
    <div className="relative w-screen h-screen font-mono bg-sky-900 p-10">
      <div className="content-center"><h1 className="animate-pulse text-center text-4xl text-white font-mono mb-10">Loading</h1></div>
    </div>

  useEffect(() => {
    GetTransactions(tempTxsData, setTempTxsData, setTransactionsData, isLoadingTxs, setIsLoadingTxs);
  }, []);

  useEffect(() => {
    // console.log("data", transactionsData);
    setWeeklyFees(calculateMetricsFromTransactions(transactionsData, rawAssets));
    console.log("fess", weeklyFees);
  }, [transactionsData, rawAssets, isLoadingTxs]);

  if (error) return <div>failed to load</div>
  if (isLoading) return loading
  if (isLoadingTxs) return loading
  if (isLoadingAssets) return loading

  const { data } = calculateMetricsFromPortfolios(rawPortfoliosData.portfolios, rawTvlData?.tvl);
  const tvlByAssets = calculateTvlByAssets(rawPortfoliosData.portfolios, rawAssets);

  // console.log("tvlByAssets", tvlByAssets);
  // console.log("fee", weeklyFees);
  // console.log("txtx", transactionsData);
  
  return (
    <div className="relative w-full h-full font-mono bg-sky-900">
      <Head>
        <title>Baskboard</title>
        <meta name="description" content="The ultimate Picnic dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="p-5 pt-10 mx-auto">
        <h1 className="text-center text-4xl text-white font-mono mb-10">
          Picnic Dashboard
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
          <TvlByAssetComponent data={tvlByAssets} />
          <WeeklyFees data={weeklyFees} />
          {transactionsData && <TransactionList data={transactionsData}/>}
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