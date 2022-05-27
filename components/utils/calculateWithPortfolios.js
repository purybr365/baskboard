

export function calculateMetricsFromPortfolios (portfolios, tvl) {

    let d = new Date();
    let curr_date = d.getDate();
    let last_wk = curr_date - 7;
  
    let port_above_0 = 0;
    let port_above_50 = 0;
    let port_above_1000 = 0;
    
    let counts = {};
    let counts_10 = {};
    // console.log("port", portfolios);
    for (const port of portfolios) {
      
      // Counting Unique Deposit Addresses (UDAs)
      counts[port.ownerAddress] = 1 + (counts[port.ownerAddress] || 0);
  
      if (port.cached.value >10) {
        counts_10[port.ownerAddress] = 1 + (counts_10[port.ownerAddress] || 0);
      }
  
      // Summing # of ports on each value threshold
      if (port.cached.value > 1000) {
        port_above_0++;
        port_above_50++;
        port_above_1000++;
      } else if (port.cached.value > 50) {
        port_above_0++;
        port_above_50++;
      } else {
        port_above_0++;
      }
    }
  
    let latestPortfolios = portfolios.slice(portfolios.length-10,portfolios.length);
    const latestPortfoliosHeader = {
      header1: "nftId", 
      header2: "Date", 
      header3: "TVL"
    };
  
    return {
      "data": {
        "tvl": ["TVL", tvl, "$_thousands", "Total Value Locked"],
        "port_0": ["Baskets > $0", port_above_0, "int", ""],
        "port_50": ["Baskets > $50", port_above_50, "int", ""],
        "port_1000": ["Baskets > $1k", port_above_1000, "int", ""],
        "uda": ["UDA", Object.keys(counts).length, "int", "Unique Deposit Address"],
        "active_users": ["Active users", Object.keys(counts_10).length, "int", "UDA with value > $10"],
        "latestPorts": ["Latest baskets", latestPortfolios, "table", latestPortfoliosHeader, ""],
        "latestTransacs": ["Latest transactions", "", "table", ""],
        "portfolios": ["Raw portfolios", portfolios, "", ""]
      }
    }
  
  }