var typeStr = "Boolean Number String Function Array Date RegExp Object Error Symbol";
var class2type = {};
var toString = Object.prototype.toString;

typeStr.split( " " ).forEach(item => (class2type[`[object ${item}]`] = item.toLowerCase()));

function getType(obj) {
  if ( obj == null ) {
    return obj + "";
  }

  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === "object" || typeof obj === "function" ?
      class2type[ toString.call(obj) ] || "object" :
      typeof obj;
}

function getLeafType(obj) {
  if (obj instanceof Leaf) {
    return 'leaf';
  }
  return getType(obj);
}