function transformData(data) {
  let type = getType(data);
  let $leafData;
  switch (type) {
    case 'object':
      $leafData = {};
      Object.keys(data).forEach(key => $leafData[key] = transformData(data[key]));
      break;
    case 'array':
      $leafData = [];
      $leafData = data.map(item => transformData(item));
      // $leafData.__leng = new Leaf(data.length);
      // Object.defineProperty($leafData, 'length', {
      //   enumrable: false,
      //   value: new Leaf(data.length)
      // });
      break;
    default:
      $leafData = new Leaf(data);
  }

  if (typeof data === 'object') {
    Object.defineProperty($leafData, '$$vnodes', {
      enumrable: false,
      value: []
    });
    Object.defineProperty(data, '$$leafData', {
      enumrable: false,
      value: $leafData
    });
    Object.defineProperty(data, '$$watcher', {
      enumrable: false,
      value: new Proxy(data, {
        get(obj, key, receiver) {
          return $leafData[key].$$vnodes;
        }
      })
    });
  }

  return $leafData;
}



