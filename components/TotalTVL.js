import React from "react";
import dynamic from "next/dynamic";

const TVLChart = dynamic(() => import("/components/charts/TVLChart"), {ssr: false});

function calculateHistoricalTvl(transactions) {
  const orderedTxs = transactions?.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.executedOn) - new Date(b.executedOn);
  });

  let historicalTvl = 0;
  let time = 0;
  const chartData = orderedTxs?.map((tx) => {
    time++;
    if (["createPortfolio", "depositPortfolio"].includes(tx.functionName)) {
      historicalTvl += !isNaN(tx.inputs[0]?.value) ? tx.inputs[0]?.value : 0;
      return {time: time, value: historicalTvl};
    } else if (["withdrawPortfolio"].includes(tx.functionName)) {
      // console.log("withdraw", tx);
      historicalTvl -= !isNaN(tx.outputs[0]?.value) ? tx.outputs[0]?.value : 0;
      return {time: time, value: historicalTvl};
    } else {
      return {time: time, value: historicalTvl};
    }
  });

  console.log("datadata",transactions, orderedTxs, chartData);

  return chartData.sort((a,b) => new Date(a.time) - new Date(b.time));
  
}

function TotalTVL( { data, transactionsData } ) {

  // Build the rawTVL array
  let rawTVL = [];
  const portfolios = data[1];
  
  //console.log(data[1]);

  for (const portId in portfolios) {

    const portDate = portfolios[portId].createdOn.substring(0, 10);
    
    const portTVL = portfolios[portId].value;
    //console.log("data", portDate, "tvl", portTVL);
    
    rawTVL.push({date: portDate, TVL: portTVL});
  }

  //console.log(rawTVL);

  // Generate the array with summed TVL for each day

  var dataTVL = rawTVL.reduce((acc, obj)=>{
    var existObj = acc.find(item => item.date === obj.date);
    if (existObj) {
      existObj.TVL = existObj.TVL + obj.TVL;
      return acc;
    }
    acc.push(obj);
    return acc;
  },[]);
  
  const dataTVLOrdered = dataTVL.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.date) - new Date(b.date);
  });

  const creds = dataTVLOrdered.reduce((iterVals, val, curIndex, arr) => {
    let { sum, res } = iterVals;
    sum += val.TVL;
    res.push({time:val.date, value:sum});
    return { sum, res };
  }, {
    sum: 0,
    res: []
  });

  const dataGraph = creds.res;

  console.log("datadataXXX", dataGraph, transactionsData);

  const historicalTvlChartData = calculateHistoricalTvl(transactionsData);

  //console.log(dataGraph);

  ///////////
  // Start configuring the AreaClosed chart
  ///////////
  
  return(
    <>
      <div className="p-5 m-2 rounded-lg bg-sky-800 text-center col-span-2">
        <span className="text-sky-400">TVL</span><br /><br />
        <TVLChart data={dataGraph} className="bg-gray-500" />    
      </div>

      <div className="p-5 m-2 rounded-lg bg-sky-800 text-center col-span-2">
        <span className="text-sky-400">Reconstructed TVL</span><br /><br />
        <TVLChart data={historicalTvlChartData} className="bg-gray-500" />    
      </div>
    </>
  )
}

export default TotalTVL