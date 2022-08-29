import fetch from "node-fetch";

function fetchData(url) {
  return fetch(url, {
    "headers": {
      "accept": "application/json",
      "content-type": "application/json",
    },
    "body": "{\"perPage\":-1}",
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
const resTx = await fetchData(txUrl);

console.log("");
console.log("Testing `get-transactions` API call...");
console.log("Number of transactions retrieved: ", resTx.error ? resTx : resTx.transactions.length);

// TVL
const tvlUrl = "https://dev.defibasket.org/api/get-tvl";
const resTvl = await fetchData(tvlUrl);

console.log("");
console.log("Testing `get-tvl` API call...");
console.log("Current TVL: ", resTvl);

console.log(`
--- END ---
`);