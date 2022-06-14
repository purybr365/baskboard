// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//import useSWR from "swr";

//const fetcher = (...args) => fetch(...args).then((res) => res.json());

const baseUrls = {
  "root": "http://defibasket.org",
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

  function buildHeader(perPage, networkName) {
    var query = {};
    if (perPage !== undefined) {
      query["perPage"] = perPage;
    }

    if (networkName !== undefined) {
      query["networkName"] = networkName;
    }

    return query;
  }

  const query = buildHeader(perPage, networkName)

  // console.log("query", query);

  // Direct request  
  try {
    
    const res = await fetch(
      baseUrls.root + baseUrls[queryFunction],
      {
        body: JSON.stringify(query),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
      .then((res) => res.json());
    
    response.json(res);
  }
  catch (e) {
    response.status(500).json(e);
  }  

  response.status(200)
}
