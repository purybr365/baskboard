import fetch from "node-fetch";

async function fetchData(url, perPage=-1, pageIndex=0) {
  return fetch(url, {
    "headers": {
      "accept": "application/json",
      "content-type": "application/json",
    },
    "body": JSON.stringify({perPage: perPage, pageIndex: pageIndex}),
    "method": "POST"
  }).then((res) => res.json()).catch((err) => console.error(err))
};

console.log(`
===============
API CALLS TESTS
===============`);

// Portfolios
const portfoliosUrl = "https://dev.defibasket.org/api/get-portfolios";
const res = await fetchData(portfoliosUrl);

console.log("");
console.log("Testing `get-portfolios` API call...");
console.log("Number of portfolios retrieved: ", res.error ? res : res.portfolios.length);

// Transactions
const txUrl = "https://dev.defibasket.org/api/get-transactions";
let txs = [];
let pageIndex = 0;
async function getTxs() {
  await fetchData(txUrl, 300, pageIndex).then(async (res) => {
    txs = txs.concat(res.transactions);
    console.log(txs.length);
    if (res.pagination.hasNext) {
      pageIndex++;
      await getTxs();
    }
  });
  // console.log(curTx.transactions.length);
  
}
await getTxs();
// console.log(txs);

let names = [];
let feesCount = 0;
txs.forEach((x) => {
  if (!names.includes(x.functionName)) {
    names.push(x.functionName);
  }
  if (x.fees.length > 0) {
    feesCount = feesCount + 1;
  }
});




console.log("");
console.log("Testing `get-transactions` API call...");
console.log("Number of transactions retrieved: ", txs.error ? txs : txs.length);
console.log("Number of different functionNames: ", names);
console.log("Number of txs with fees: ", feesCount);

// TVL
const tvlUrl = "https://dev.defibasket.org/api/get-tvl";
const resTvl = await fetchData(tvlUrl);

console.log("");
console.log("Testing `get-tvl` API call...");
console.log("Current TVL: ", resTvl);

console.log(`
--- END ---
`);