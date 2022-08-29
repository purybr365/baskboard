// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//import useSWR from "swr";

//const fetcher = (...args) => fetch(...args).then((res) => res.json());

const baseUrls = {
  "root": "https://dev.defibasket.org",
  "get-portfolios": "/api/get-portfolios/",
  "get-tvl": "/api/v1/get-tvl/",
  "get-assets": "/api/get-assets/",
  "get-transactions": "/api/get-transactions/",
};

export default async function handler(request, response) {

  const {
    queryFunction,
    perPage,
    networkName,
  } = await request.query;

  function buildHeader(networkName, walletAddress, pageIndex, perPage) {
    
    return {
      networkName: networkName ? networkName : null,
      walletAddress: walletAddress ? walletAddress : null,
      pageIndex: pageIndex ? pageIndex : null,
      perPage: perPage ? perPage : null,
    }
    
  }

  const body = JSON.stringify(buildHeader(networkName, null, null, perPage));

  console.log("query", body);

  // Direct request  
  try {
    
    await fetch(
      baseUrls.root + baseUrls[queryFunction],
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body, // body
      })
      .then((res) => res.json());
    
    // return response.status(200);
  }
  catch (e) {
    response.status(500).json(e);
  }  

  response.status(200)
}
