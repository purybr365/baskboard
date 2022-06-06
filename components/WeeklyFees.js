import React from "react";
import dynamic from "next/dynamic";

const FeesChart = dynamic(() => import("/components/charts/TVLChart"), {ssr: false});

function WeeklyFees( { data } ) {
  
  //console.log(data[1]);
  const newWeeklyFees = [];

  for (const week of data) {
    
    newWeeklyFees.push({
      time: week.date.toISOString().toString().substring(0, 10), 
      value: week.feeInUsd});
  }
  
  const orderedWeeklyFees = newWeeklyFees.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.time) - new Date(b.time);
  });
  // console.log("ordered", orderedWeeklyFees);
  // TODO: Create a second series for accumulated fees

  // const creds = dataTVLOrdered.reduce((iterVals, val, curIndex, arr) => {
  //   let { sum, res } = iterVals;
  //   sum += val.TVL;
  //   res.push({time:val.date, value:sum});
  //   return { sum, res };
  // }, {
  //   sum: 0,
  //   res: []
  // });

  ///////////
  // Start configuring the AreaClosed chart
  ///////////
  
  return(
    <div className="p-5 m-2 rounded-lg bg-sky-800 text-center col-span-2">
      <span className="text-sky-400">Weekly Fees in USD</span><br /><br />
      <FeesChart data={orderedWeeklyFees} className="bg-gray-500" />
    </div>
  )
}

export default WeeklyFees