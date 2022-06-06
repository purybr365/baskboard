function relativeDate(dateString) {
  // Make a fuzzy time
  const delta = Math.round((new Date - new Date(dateString)) / 1000);

  const minute = 60,
      hour = minute * 60,
      day = hour * 24,
      week = day * 7;

  var fuzzy;

  if (delta < 30) {
      fuzzy = 'just then.';
  } else if (delta < minute) {
      fuzzy = delta + ' seconds ago.';
  } else if (delta < 2 * minute) {
      fuzzy = 'a minute ago.'
  } else if (delta < hour) {
      fuzzy = Math.floor(delta / minute) + ' minutes ago.';
  } else if (Math.floor(delta / hour) == 1) {
      fuzzy = '1 hour ago.'
  } else if (delta < day) {
      fuzzy = Math.floor(delta / hour) + ' hours ago.';
  } else if (delta < day * 2) {
      fuzzy = 'yesterday';
  } else {
      fuzzy = Math.round(delta / day).toString() + ' days ago.';
  }

  return fuzzy;

}

export default function TransactionList ({ data }) {
  const typeOfEvent = {
    "DEFIBASKET_EDIT": {event: "edit", color: "bg-yellow-100 text-yellow-800"},
    "DEFIBASKET_CREATE": {event: "create", color: "bg-green-100 text-green-800"},
    "DEFIBASKET_WITHDRAW": {event: "withdraw", color: "bg-red-100 text-red-800"},
    "DEFIBASKET_DEPOSIT": {event: "deposit", color: "bg-blue-100 text-blue-800"},
    "Transfer": {event: "transfer", color: "bg-blue-100 text-blue-800"},
  };

  const sortedTransactions = data.sort((a,b) => (a.createdOn < b.createdOn) ? 1 : -1);

  // TODO -> include helper fields in the transactions list: 
  // status (IN/OUT), type (create, edit, withdraw)

  return (
    <div className="col-span-2 p-5 m-2 rounded-lg bg-sky-800 text-center">
      <span className="text-sky-400">List of Transactions</span><br />
      <div className="mt-3 flex flex-col text-left overflow-scroll max-h-72">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-sky-700">
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
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-200 sm:pl-6 md:pl-0">
                        <a href={"https://polygonscan.com/tx/" + transaction.txHash} target="_blank">
                          <span className={"inline-flex items-center px-2 py-0.5 rounded text-xs font-medium " + typeOfEvent[transaction.mainEventName].color}>
                            {typeOfEvent[transaction.mainEventName].event}
                          </span>
                        </a>
                      </td>
                      <td className="whitespace-nowrap py-2 px-3 text-left text-sm text-gray-200">{relativeDate(transaction.createdOn)}</td>
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