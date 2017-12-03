class Leaf {
  constructor(value) {
    this.value = value;
    this.type = getType(value);
    this.$$vnodes = [];
  }
  toString() {
    return this.value;
  }
}

function createLeaf(target, property, value) {
  // debugger;
  let $leafData = transformData(value);
  target.$$leafData[property] = $leafData;
  return $leafData;
}

function updateLeaf(target, property, value) {
  let $leafData = target.$$leafData[property];

  if ($leafData instanceof Leaf && typeof value !== 'object') {
    $leafData.value = value;
  } else {
    target.$$leafData[property] = transformData(value);
  }
}

function removeLeaf(target, property) {
  Reflect.deleteProperty(target.$$leafData, property);
}