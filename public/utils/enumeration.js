const enumeration = arrOfProps => arrOfProps.reduce((aggregator, el) =>  {
    return aggregator[el] ? '' : { ...aggregator, el }
},{})
