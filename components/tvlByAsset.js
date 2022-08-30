export function calculateTvlByAssets(portfolios, assets) {
  
  // const sumFees = [];
  const totalPortofolioAllocationByAsset = {};
  
  for (const port of portfolios) {
    
    // Summing each asset of the portfolio 
    // to the global summed allocation
    for (const asset of port.allocation) {
      if (totalPortofolioAllocationByAsset[asset.assetId] == undefined) {
        totalPortofolioAllocationByAsset[asset.assetId] = parseInt(asset.amount);
      } else {
        totalPortofolioAllocationByAsset[asset.assetId] += parseInt(asset.amount);
      }
    }
  }

  const tvlByAssets = [];

  // console.log("tot", totalPortofolioAllocationByAsset);

  for (const assetId of Object.keys(totalPortofolioAllocationByAsset)) {
    // console.log("id", assetId);
    try {
      const assetFromTable = assets.find(item => item._id === assetId);
      // console.log("assetTable", assetFromTable);
      const assetAmount = totalPortofolioAllocationByAsset[assetId];
    
      // TODO: Replace latestPrice for historical price at fee acrrual time
      const assetInUsd = assetFromTable ? assetFromTable.latestPrice * assetAmount : 0;
      const assetSymbol = assetFromTable ? assetFromTable.symbol : "";

      tvlByAssets.push({
        asset: assetId, 
        symbol: assetSymbol, 
        amountInUsd: assetInUsd})
    } catch (error) {
      console.error(error)
    };
  }

  // console.log("tvlByassets", tvlByAssets);
  return tvlByAssets;

}

export function TvlByAssetComponent({ data }) {
  
  // console.log("data1", data);
  let largestAssets = data.sort((a,b) => (a.amountInUsd < b.amountInUsd) ? 1 : -1);
  // console.log("largest", largestAssets);

  return (
    <div className="col-span-2 p-5 m-2 rounded-lg bg-sky-800 text-center">
      <span className="text-sky-400">Largest assets by TVL</span><br />
      <div className="mt-3 flex flex-col text-left max-h-72 w-full">
          <div className="overflow-x-auto">
            <div className="inline-block w-full py-2 align-middle">
              <table className="w-full divide-y divide-sky-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-4 pr-1 text-left text-sm font-light text-sky-600 sm:pl-6 md:pl-0"
                    >
                      Asset
                    </th>
                    <th scope="col" className="py-2 px-3 text-left text-sm font-light text-sky-600">
                      TVL
                    </th>
                    <th scope="col" className="py-2 px-3 text-left text-sm font-light text-sky-600">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-800">
                  {largestAssets.map((asset) => (
                    <tr key={asset.asset}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-1 text-sm font-medium text-gray-200 sm:pl-6 md:pl-0">
                        {asset.symbol}
                      </td>
                      <td className="whitespace-nowrap py-2 px-3 text-left text-sm text-gray-200">{asset.amountInUsd.toFixed(2)}</td>
                      <td className="whitespace-nowrap py-2 px-3 text-left text-sm text-gray-200">TBC</td>
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