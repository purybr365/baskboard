// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//import useSWR from "swr";

//const fetcher = (...args) => fetch(...args).then((res) => res.json());

const baseUrls = {
  "root": "https://defibasket.org",
  "get-portfolios": "/api/get-portfolios/",
  "get-tvl": "/api/v1/get-tvl/",
};

export default async function getData(type, pageIndex = 0) {

  // Direct request  
  try {
    
    const query = {"pageIndex": pageIndex};
    //const queryString = Object.keys(query).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`).join('&');
    
    const res = await fetch(
      baseUrls.root + baseUrls[type],
      {
        body: JSON.stringify(query),
        headers: {
          //"Content-Type": "application/json;charset=utf8",
          "Accept": "*/*",
        },
        method: "POST",
      })
      .then((res) => res.json());
    return res;
  }
  catch (e) {
    return "Error: " + e;
  }  
}
