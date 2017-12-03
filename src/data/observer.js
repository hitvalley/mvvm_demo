function observeData(data) {
  if (typeof data !== 'object') {
    return;
  }
  let proxy = new Proxy(data, {
    set(target, property, value, receiver) {
      let type;
      if (target[property]) {
        type = 'update';
        updateLeaf(target, property, value);
      } else {
        type = 'create';
        let $leaf = createLeaf(target, property, value);
        target.$$leafData[property] = $leaf;
        // window.$leaf = $leaf;
        // window.__target = target;
        // console.log($leaf)
        // target.__t[property] = initRes.$tplData;
        // target.
        // Reflect.get(target.$$watcher, receiver);
        target.$$leafData.$$vnodes.forEach($vnode => {
          // $vnode.addItem && $vnode.addItem(value.$$leafData, property);
          if ($vnode.addItem) {
            $vnode.addItem(value.$$leafData, property);
          }
        });
      }

      let res = Reflect.set(target, property, value, receiver);
      // // console.log(`[${type}]`, target, property, value);
      let watchers = Reflect.get(target.$$watcher, property);
      watchers && watchers.forEach(vnode => vnode[`${type}Action`] && vnode[`${type}Action`](property, value, target));

      return res;
    },
    deleteProperty(target, property, receiver) {
      console.log('[delete]', target, property);
      removeLeaf(target, property);
      return Reflect.deleteProperty(target, property, receiver);
    },
    get(target, property, receiver) {
      // console.log('[get]', target, property);
      let value = Reflect.get(target, property, receiver);
      if (value && value._ob) {
        return value._ob;
      }
      return value;
    }
  });
  Object.defineProperty(data, '_ob', {
    enumrable: false,
    value: proxy
  });
  return proxy;
}

function observe(data) {
  if (typeof data !== 'object') {
    return;
  }
  Object.keys(data).forEach(key => observe(data[key]));
  return observeData(data);
}

// function getObserveHandler(data) {
//   if (typeof data !== 'object') {
//     return;
//   }
//   Object.keys(data).forEach(key => getObserveHandler(data[key]));
//   let handler = new Proxy(data, {
//     getOwnPropertyDescriptor(target, property) {
//       console.log('[getOwnPropertyDescriptor]', target, property);
//     },
//     get(target, property, receiver) {
//       if (target[property] && target[property]._ob) {
//         return target[property]._ob;
//       }
//       return target[property];
//     }
//   });
//   Object.defineProperty(data, '_h', {
//     enumrable: false,
//     value: handler
//   });
//   return handler;
// }

