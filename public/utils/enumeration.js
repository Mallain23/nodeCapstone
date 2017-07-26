const enumeration = arrOfProps => arrOfProps.reduce((aggregator, el) =>  {
  aggregator[el] ? '' : aggregator[el] = el
  return aggregator
}, {})
