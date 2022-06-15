// Helper function to group by week
export function setToMonday( date ) {
    var day = date.getDay() || 7;  
    if( day !== 1 ) 
        date.setHours(-24 * (day - 1)); 
    return date;
}

// Helper function to find fee in USD based on latestPrice
// from assets db list
function findAmountInUsd (flow, assets) {
    const asset = assets.find(item => item._id === flow._id);
    //const feeAmount = fee.amount ;
    
    // TODO: Replace latestPrice for historical price at fee acrrual time
    return asset.latestPrice * flow.amount;
}