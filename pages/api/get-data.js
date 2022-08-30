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
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=60, stale-while-revalidate, public"
  );
  const {
    queryFunction,
    perPage,
    networkName,
    pageIndex,
  } = await request.query;

  function buildHeader(networkName, walletAddress, pageIndex, perPage) {
    
    return {
      networkName: networkName ? networkName : null,
      walletAddress: walletAddress ? walletAddress : null,
      pageIndex: pageIndex ? Number(pageIndex) : null,
      perPage: perPage ? Number(perPage) : null,
    }
    
  }

  const body = JSON.stringify(buildHeader(networkName, null, pageIndex, perPage));

  // console.log("query", baseUrls.root + baseUrls[queryFunction]);

  // Direct request  
  try {
    
    const res = await fetch(
      baseUrls.root + baseUrls[queryFunction],
      {
        method: "POST",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
        },
        body, // body
      })
      .then((res) => res.json());
    // console.log("res", res);
    // return response.status(200);
    response.json(res);
  }
  catch (e) {
    response.status(500).json(e);
  }  

  // return response.status(200);
}
