import React from 'react'

function TwobyTwoTable({ data }) {

  const tBody = "";

  // console.log({
  //  data1: data[1],
  //  data2: data[2],
  //  data3: data[3].header1
  //  });


  //for (const indexPort in data[1]) {
  //  console.log(data[1][indexPort]);
  //}
  {/*  const tBody = data[1].forEach(function(portfolio) {
      <tr>
        <td className="text-white font-light text-sm">{portfolio.nftId}</td>
        <td className="text-white font-light text-sm">{portfolio.createdOn}</td>
        <td className="text-white font-light text-sm">{portfolio.cached.value}</td>
      </tr>
    }); */}

  return (
    {/*<div className="col-span-2 p-5 m-2 rounded-lg bg-sky-800 text-center">
      <span className="text-sky-400">Latest portfolios</span><br />

    

      <table className="bg-red-500 text-center w-full">
        <thead className="">
            <td><span className="text-white font-bold text-sm">{data[3].header1}</span></td>
            <td><span className="text-white font-bold text-sm">{data[3].header2}</span></td>
            <td><span className="text-white font-bold text-sm">{data[3].header3}</span></td>
        </thead>
        <tbody>
          {console.log(data[1])}
          {data[1].map((portfolio,key) => {
            console.log({"teste":portfolio[1], "item":i});
            return (
              <tr>
                <td className="text-white font-light text-sm">{portfolio[key].nftId}</td>
                <td className="text-white font-light text-sm">{portfolio[key].createdOn}</td>
                <td className="text-white font-light text-sm">{portfolio[key].cached.value}</td>
              </tr>
            )}
          )}
        </tbody>              
      </table>
            </div>*/}
  )}
  
  export default TwobyTwoTable