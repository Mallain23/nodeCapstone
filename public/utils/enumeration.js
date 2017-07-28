const enumeration = arrOfProps => arrOfProps.reduce((aggregator, el) =>  {
     aggregator[el] ? null : aggregator[el] = el;

     return aggregator;
}, {})
