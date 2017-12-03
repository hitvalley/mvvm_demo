function initNodeTree(tplNode, data) {
  let keys = Object.keys(data);
  let values = Object.values(data);

  let tpl = keys.map(key => `let ${key} = data.${key};`).join('\n');
  tpl += '\n';
  tpl += initNodeFunc(tplNode);
  tpl += 'return vnode';

  // console.log(tpl)
  let func = new Function('data', tpl);

  return func(data);
  // let func = new Function(Object.keys(data))
}

function getTabStr(level) {
  if (!level) {
    return '';
  }
  return new Array(level * 2 + 1).join(' ');
}

function getVarNames(wholeKey) {
  let reg1 = /\[(['"])([^\]'"]+)\1\]$/;
  let reg2 = /\.([^\.]+)$/;
  let res;
  if (res = wholeKey.match(reg1)) {
    return {
      own: res[2],
      parent: wholeKey.replace(reg1, '')
    };
  } else if (res = wholeKey.match(reg2)) {
    return {
      own: res[1],
      parent: wholeKey.replace(reg2, '')
    };
  }
  return {
    own: wholeKey,
    parent: ''
  };
}

function initNodeFunc(tplNode, level) {
  level = level || 0;
  let tagName = tplNode.tag;
  let content = tplNode.content;
  let tabstr = getTabStr(level);
  // console.log(tplNode.tag, level, `[${tabstr}]`);
  let funstr = '';
  switch(tagName) {
  case 'string':
    content = content.replace(/[\r\n]+/, '');
    funstr += `${tabstr}var vnode = new TextNode("${content}")\n`;
    break;
  case 'var':
    funstr += `${tabstr}var vnode = new VarNode(${content})\n`;
    funstr += `${tabstr}if (${content} && ${content}.$$vnodes) {\n`;
    funstr += `${tabstr}  ${content}.$$vnodes.push(vnode);\n`;
    funstr += `${tabstr}} else if (typeof ${content}VNodes !== 'undefined') {\n`;
    funstr += `${tabstr}  ${content}VNodes.push(vnode);\n`;
    funstr += `${tabstr}}\n`;
    break;
  case 'if':
    funstr += `${tabstr}var vnode = new IfNode();\n`;
    // funstr += `${tabstr}(funciton(){\n`;
    funstr += initCaseFunc(tplNode, level + 1);
    // funstr += `${tabstr}}());\n`;
    // funstr += `${tabstr}${content}.$$vnodes.push(vnode);\n`;
    // funstr += tmp;
    // funstr += initCaseFunc(tplNode, level + 1);
    // funstr += ``;
    break;
  case 'each':
    let tmps = content.split(/\s*as\s*/);
    let eachName = tmps[0];
    let eachInput = tmps[1].split(',');
    let eachValue = (eachInput[0] || '').trim();
    let eachKey = (eachInput[1] || '__vtpl_index').trim();
    funstr += `${tabstr}var vnode = new EachNode("${eachName}", "${eachValue}", "${eachKey}");\n`;
    funstr += `${tabstr}var ${eachKey}VNodes = ${eachName}.$$vnodes;\n`;
    funstr += `${tabstr}vnode.addItem = function(${eachValue}, ${eachKey}, ${eachName}){\n`;
    funstr += `${tabstr}  var ${eachKey}VNodes = ${eachName};\n`;
    funstr += initItemFunc(tplNode, level + 1, eachValue, eachKey);
    funstr += `${tabstr}  ${eachValue}.$$vnodes.push(itemVNode);\n`;
    // funstr += 'debugger;\n';
    funstr += `${tabstr}  this.addChild(itemVNode);\n`;
    funstr += `${tabstr}};\n`;
    funstr += `${tabstr}Object.keys(${eachName}).forEach(function(${eachKey}){\n`;
    funstr += `${tabstr}  let ${eachValue} = ${eachName}[${eachKey}];\n`;
    funstr += `${tabstr}  vnode.addItem(${eachValue}, ${eachKey}, ${eachName});\n`
    funstr += `${tabstr}});\n`;
    funstr += `${tabstr}${eachName}.$$vnodes.push(vnode);\n`;
    break;
  default:
    funstr += `${tabstr}var vnode = new TagNode("${tagName}");\n`;
  }

  if (tagName !== 'each' && tagName !== 'if') {
    funstr += initAppendChildrenFunc(tplNode.children, level);
  }

  funstr += `${tabstr}vnode.tplId = ${tplNode.id};\n`;

  return funstr;
}

function initCaseFunc(ifTplNode, level) {
  let tabstr = getTabStr(level);
  let parstr = getTabStr(Math.max(0, level - 1));
  let funstr = '';
  ifTplNode.children.forEach((child, index) => {
    let content = child.content.replace(/"/g, '\\\"');
    let judgement = child.content.replace(/===/g, '==');
    funstr += `${parstr};(function(){\n`;
    funstr += `${tabstr}var caseNode${index} = new CaseNode("${content}");\n`;
    funstr += `${tabstr}caseNode${index}.check = function(){\n`;
    if (content === 'default') {
      funstr += `${tabstr}  return true;\n`;
    } else {
      funstr += `${tabstr}  return ${judgement};\n`;
    }
    funstr += `${tabstr}};\n`;
    if (child.variables && child.variables.length) {
      child.variables.forEach(variable => {
        // funstr += `console.log(${variable}.$$vnodes);\n`;
        funstr += `${tabstr}${variable}.$$vnodes.push(vnode);\n`;
      });
    }
    funstr += initAppendChildrenFunc(child.children, level, `caseNode${index}`);
    funstr += `${tabstr}vnode.addChild(caseNode${index});\n`;
    funstr += `${parstr}}());\n`;
  });
  return funstr;
}

function initItemFunc(itemTplNode, level, data, key) {
  // console.log('item', level);
  let tabstr = getTabStr(level);
  let funstr = `${tabstr}var itemVNode = new ItemNode(${data}, ${key});\n`;
  funstr += `${tabstr}itemVNode.tplId = ${itemTplNode.id};\n`;
  // funstr += `${tabstr}var ${data}W = ${data} && ${data}._w;\n`;
  funstr += initAppendChildrenFunc(itemTplNode.children, level, 'itemVNode');

  return funstr;
}


function initAppendChildrenFunc(children, level, parentName) {
  let tabstr = getTabStr(level);
  let funstr = '';
  (children || []).forEach((child, index) => {
    let childStr = initNodeFunc(child, level + 1);
    let childName = 'child' + index;
    funstr += `${tabstr}let ${childName} = (function(){\n`;
    funstr += childStr;
    funstr += `${tabstr}  return vnode;\n`;
    funstr += `${tabstr}}());\n`;
    funstr += `${tabstr}${parentName || 'vnode'}.addChild(${childName});\n`;
  });
  return funstr;
}

function readVNode(vnode) {
  console.group(vnode.tagName)
  vnode.children.forEach(child => readVNode(child));
  console.groupEnd();
}