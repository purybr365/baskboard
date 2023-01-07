import useSWR from "swr";

// Transactions
// const txUrl = "https://dev.defibasket.org/api/get-transactions";

async function fetchData(perPage=-1, pageIndex=0) {
  const queryFunction = `get-transactions&perPage=${perPage}&pageIndex=${pageIndex}&networkName=polygon`;
  const data = await fetch("/api/get-data" + "?queryFunction=" + queryFunction)
    .then((res) => res.json()).catch((err) => console.error(err))
  
  // const { data, error } = fetch("/api/get-transactions" + "?queryFunction=" + queryFunction);
  // console.log("data2", data);
  return data;
  // return {
  //   rawTransactions: data,
  //   isLoading: !error && !data,
  //   isError: error,
  // }
};

export async function getTxs(txs, pageIndex=0, setIsLoadingTxs, setTransactionsData) {
  const res = await fetchData(300, pageIndex);
  txs = txs.concat(res.transactions);
  console.log(txs.length);
  if (res.pagination.hasNext) {
    pageIndex++;
    // console.log("page",pageIndex);
    await getTxs(txs, pageIndex, setIsLoadingTxs, setTransactionsData);
  } else {
    // console.log("CHEGOU");
    setIsLoadingTxs(false);
    setTransactionsData(txs);
    // return {
    //   txs: txs,
    //   isLoading: isLoading,
    // }
  }
};

