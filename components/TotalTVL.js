import React from "react";
import dynamic from "next/dynamic";

const TVLChart = dynamic(() => import("/components/charts/TVLChart"), {ssr: false});

function TotalTVL( { data } ) {

  // Build the rawTVL array
  let rawTVL = [];
  const portfolios = data[1];
  
  //console.log(data[1]);

  for (const portId in portfolios) {

    const portDate = portfolios[portId].createdOn.substring(0, 10);
    
    const portTVL = portfolios[portId].cached.value;
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

  //console.log(dataGraph);

  ///////////
  // Start configuring the AreaClosed chart
  ///////////
  
  return(
    <div className="p-5 m-2 rounded-lg bg-sky-800 text-center col-span-2">
      <span className="text-sky-400">TVL</span><br /><br />
      <TVLChart data={dataGraph} className="bg-gray-500" />
    </div>
  )
}

export default TotalTVL