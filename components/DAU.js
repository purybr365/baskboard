import React from "react";
import dynamic from "next/dynamic";

const FeesChart = dynamic(() => import("/components/charts/TVLChart"), {ssr: false});

function formatData(data, users = false) {
  const formattedDailyData = Object.keys(data).map((date) => {
    return {time: date, value: users ? data[date].length : data[date]}
  });

  const orderedDailyData = formattedDailyData.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.time) - new Date(b.time);
  });

  return orderedDailyData
}

export default function DailyActiveUsers(transactions) {
  // console.log("tx2",transactions.transactions);
  
  let dailyTxs = {};
  transactions?.transactions.forEach((tx) => {
    const date =new Date(tx.executedOn).toDateString(); 
    if(Object.keys(dailyTxs)
      .includes(date)) {
      dailyTxs[date]++;
    } else {
      dailyTxs[date] = 1;
    }
  });

  let dailyUsers = {};
  transactions?.transactions.forEach((tx) => {
    const date =new Date(tx.executedOn).toDateString(); 
    if(Object.keys(dailyUsers)
      .includes(date)) {
        dailyUsers[date].includes(tx.walletAddress) ? null : dailyUsers[date].push(tx.walletAddress);
    } else {
      dailyUsers[date] = [tx.walletAddress];
    }
  });

  // console.log("DAU",dailyActiveUsers);

  const orderedDailyTxs = formatData(dailyTxs);
  const orderedDailyUsers = formatData(dailyUsers, true);

  return(
    <>
      <div className="p-5 m-2 rounded-lg bg-sky-800 text-center col-span-2">
        <span className="text-sky-400">Daily Transactions</span><br /><br />
        <FeesChart data={orderedDailyTxs} className="bg-gray-500" />
      </div>
      
      <div className="p-5 m-2 rounded-lg bg-sky-800 text-center col-span-2">
        <span className="text-sky-400">Daily Active Users</span><br /><br />
        <FeesChart data={orderedDailyUsers} className="bg-gray-500" />
      </div>
    </>  
  )
}