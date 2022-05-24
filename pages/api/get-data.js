// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//import useSWR from "swr";

//const fetcher = (...args) => fetch(...args).then((res) => res.json());

const baseUrls = {
  "root": "http://defibasket.org",
  "get-portfolios": "/api/get-portfolios/",
  "get-tvl": "/api/v1/get-tvl/",
};

export default async function handler(request, response) {

  const {
    queryFunction,
    pageIndex,
  } = await request.query;

  // Direct request  
  try {
    
    const res = await fetch(
      baseUrls.root + baseUrls[queryFunction],
      {
        body: JSON.stringify({perPage: -1}),
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
