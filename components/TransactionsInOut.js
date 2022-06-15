import { setToMonday, findAmountInUsd } from "/components/utils";

function calculateInflowOutflow (transactions, assets) {
    
    const sortedTransactions = transactions.sort((a,b) => (a.createdOn < b.createdOn) ? 1 : -1);

    const sumWeeklyFlows = [];
  
    for (const transac of sortedTransactions) {

        // Determining flows by week
        if (transac.inflow) {
            for (const flow of transac.inflow) {
                sumWeeklyFlows.push({
                    date: setToMonday(new Date(transac.createdOn)), 
                    inflowInUsd: findAmountInUsd(flow, assets),
                });
            };
        };
        
        if (transac.outflow) {
            for (const flow of transac.outflow) {
                sumWeeklyFlows.push({
                    date: setToMonday(new Date(transac.createdOn)), 
                    outflowInUsd: findAmountInUsd(flow, assets),
                });
            };
        };
    };

    console.log("weekly", sumWeeklyFlows);
    return sumWeeklyFlows;

};

export default function TransactionsInOut ({ transactions, assets }) {
    // const typeOfEvent = {
    //   "DEFIBASKET_EDIT": {event: "edit", color: "bg-yellow-100 text-yellow-800"},
    //   "DEFIBASKET_CREATE": {event: "create", color: "bg-green-100 text-green-800"},
    //   "DEFIBASKET_WITHDRAW": {event: "withdraw", color: "bg-red-100 text-red-800"},
    //   "DEFIBASKET_DEPOSIT": {event: "deposit", color: "bg-blue-100 text-blue-800"},
    //   "Transfer": {event: "transfer", color: "bg-blue-100 text-blue-800"},
    // };
  
    const weeklyData = calculateInflowOutflow(transactions, assets);
  
    return (
      <>
        Testing
        { console.log(weeklyData) }
      </>
  
    ); 
  
  }