import Tooltip from '@mui/material/Tooltip'

function relativeDate(dateString) {
  // Make a fuzzy time
  const delta = Math.round((new Date - new Date(dateString)) / 1000);

  const minute = 60,
      hour = minute * 60,
      day = hour * 24,
      week = day * 7;

  var fuzzy;

  if (delta < 30) {
      fuzzy = 'just now';
  } else if (delta < minute) {
      fuzzy = delta + ' seconds ago.';
  } else if (delta < 2 * minute) {
      fuzzy = 'a min ago'
  } else if (delta < hour) {
      fuzzy = Math.floor(delta / minute) + ' minutes ago.';
  } else if (Math.floor(delta / hour) == 1) {
      fuzzy = '1 h ago'
  } else if (delta < day) {
      fuzzy = Math.floor(delta / hour) + ' hrs ago';
  } else if (delta < day * 2) {
      fuzzy = 'yesterday';
  } else {
      fuzzy = Math.round(delta / day).toString() + ' days ago';
  }

  return fuzzy;

}

export default function TransactionList ({ data }) {
  if (!data) return <></>;

  const typeOfEvent = {
    "editPortfolio": {event: "edit", color: "bg-yellow-100 text-yellow-800"},
    "createPortfolio": {event: "create", color: "bg-green-100 text-green-800"},
    "withdrawPortfolio": {event: "withdraw", color: "bg-red-100 text-red-800"},
    "depositPortfolio": {event: "deposit", color: "bg-blue-100 text-blue-800"},
    // "Transfer": {event: "transfer", color: "bg-blue-100 text-blue-800"},
    undefined: {event: "UNKNOWN", color: "bg-blue-100 text-blue-800"},
  };
  
  // console.log("TL", data);
  const sortedTransactions = data.sort((a,b) => (a.executedOn < b.executedOn) ? 1 : -1);

  // TODO -> include helper fields in the transactions list: 
  // status (IN/OUT), type (create, edit, withdraw)

  console.log("sortedTx", sortedTransactions);

  return (
    <div className="col-span-2 p-5 m-2 rounded-lg bg-sky-800 text-center">
      <span className="text-sky-400">List of Transactions</span><br />
      <div className="mt-3 flex flex-col text-left max-h-72 w-full">
          <div className="overflow-x-auto">
            <div className="inline-block w-full py-2 align-middle">
              <table className="w-full divide-y divide-sky-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-3 text-left text-sm font-light text-sky-600 sm:pl-6 md:pl-0"
                    >
                      Event
                    </th>
                    <th scope="col" className="py-2 px-3 text-left text-sm font-light text-sky-600">
                      Date
                    </th>
                    <th scope="col" className="py-2 px-3 text-left text-sm font-light text-sky-600">
                      NFTId
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-800">
                  {sortedTransactions.map((transaction, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-200 sm:pl-6 md:pl-0">
                        <Tooltip title="Click to PolygonScan" placement="top" arrow>
                          <a href={"https://polygonscan.com/tx/" + transaction.transactionHash} target="_blank" rel="noreferrer">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeOfEvent[transaction.functionName] !== undefined ? typeOfEvent[transaction.functionName].color : transaction.functionName}`}>
                            
                                {transaction.functionName ? typeOfEvent[transaction.functionName].event : "Unknown"}
                            </span>
                          </a>
                        </Tooltip>
                      </td>
                      <td className="whitespace-nowrap py-2 px-3 text-left text-sm text-gray-200">{relativeDate(transaction.executedOn)}</td>
                      <td className="whitespace-nowrap py-2 px-3 text-left text-sm text-gray-200">{transaction.nftId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

  ); 

}