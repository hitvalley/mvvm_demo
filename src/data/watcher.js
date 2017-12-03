class Watcher {
  constructor() {
    this.vnodeList = [];
  }
  addAction(vnode) {
    // this.
  }
}

// function watchData(data, $$watcher) {
//   if (typeof data !== 'object') {
//     return;
//   }
//   $$watcher && Object.defineProperty(data, '$$watcher', {
//     enumrable: false,
//     value: $$watcher
//   });
//   Object.defineProperty(data, '_w', {
//     enumrable: false,
//     value: {}
//   });
//   Object.keys(data).forEach(key => {
//     data._w[key] = [];
//     watchData(data[key], data._w[key]);
//   });
//   return data._w;
// }

function watchData(data) {
  Object.defineProperty(data, '_w', {
    enumrable: false,
    value: {}
  });
  Object.defineProperty(data, '$$watcher', {
    enumrable: false,
    value: new Proxy(data, {
      get(target, property, receiver) {
        let value = Reflect.get(target, property, receiver);
        if (target && target._w && target._w[property]) {
          return target._w[property];
        }
        return target[property];
      }
    })
  })
  Object.keys(data).forEach(key => {
    data._w[key] = [];
    if (typeof data[key] === 'object') {
      watchData(data[key]);
    }
  });
  // let $$watcher = new Proxy(data, {
  //   get(target, property, receiver) {
  //     return
  //   }
  // })
}