/**
 * S
 * 空字符: White Space
 * [https://www.w3.org/TR/REC-xml/#NT-S]
 * S ::= (#x20 | #x9 | #xD | #xA)+
 */
const whiteSpaceRegExpStr = '\\s+';
const whiteSpaceMayRegExpStr = '\\s*';

/**
 * Name
 * 名称
 * [https://www.w3.org/TR/REC-xml/#NT-Name]
 * NameStartChar ::= ":" | "_" | [A-Z] | [a-z]
 * NameChar ::=  NameStartChar | "-" | "." | [0-9]
 * Name ::= NameStartChar (NameChar)*
 */
const nameStartChar = '[A-Za-z_:]';
const nameChar = '[\\w\\.\\-\\:]';
const nameRegExpStr = `${nameStartChar}${nameChar}*`

/**
 * TagName
 * 标签名称
 * TagNameStartChar ::= [A-Z] | [a-z]
 * TagNameChar ::= TagNameStartChar | [0-9] | "-" | "." | "_" | ":"
 * TagName ::= TagNameStartChar (TagNameChar)*
 */
const tagNameStartChar = '[A-Za-z]';
const tagNameRegExpStr = `${tagNameStartChar}${nameChar}*`;

/**
 * Eq
 * 等于
 * Eq ::= S* '=' S*
 */
const eqRegExpStr = `${whiteSpaceMayRegExpStr}=${whiteSpaceMayRegExpStr}`;

/**
 * Attribute
 * 属性
 */
const value1Str = '[^"]+';
const value2Str = "[^']+";
const value3Str = '[^>\\s]+';
const attrValueRegExpStr = `"(${value1Str})"|'(${value2Str})'|(${value3Str})`;
const attrValueNoGroupRegExpStr = `"${value1Str}"|'${value2Str}'|${value3Str}`;
const attrRegExpStr = `(${nameRegExpStr})(${eqRegExpStr}(?:${attrValueRegExpStr}))?`;
const attrNoGroupRegExpStr = `(?:${nameRegExpStr})(?:${eqRegExpStr}(?:${attrValueNoGroupRegExpStr}))?`;

/**
 * RegExp
 */
// white space
const vWhiteSpaceRegExp = new RegExp(`^${whiteSpaceRegExpStr}`, 'm');
// start tag
// const startTagRegExp = new RegExp(`<(${tagNameRegExpStr})((?:\\s+${attrNoGroupRegExpStr})*)\\s*\\\/?\\s*>`, 'm');
const startTagRegExp = new RegExp(`<(${tagNameRegExpStr})(?:${whiteSpaceRegExpStr}([^>]+))?>`)
// end tag
const endTagRegExp = new RegExp(`<\/(${tagNameRegExpStr})${whiteSpaceMayRegExpStr}>`, 'm');
// comment
const commentRegExp = /<!--((?:.|[\n\r])*?)-->/m;

// console.log(startTagRegExp);

const tagRegExp = /\{\{([^{}]*?)\}\}/g;

const numberRegExp = /\d+/;
const stringRegExp = /(['"]).*?\1/;
// const variableRegExp = /^[\$_A-Za-z][\$_\w\.\[\]]*/;

const variableRegExpStr1 = '[\\$_A-Za-z][\$_A-Za-z0-9]*';
const variableRegExpStr2 = `(?:\\.${variableRegExpStr1})`;
const variableRegExpStr3 = '(?:\\[(?:\\d+|"[^"]+"|\'[^\']+\')\\])';
const variableRegExp = new RegExp(`^${variableRegExpStr1}(?:${variableRegExpStr2}|${variableRegExpStr3})*$`);

function toTags(tpl) {
  let res;
  let str;
  let start = 0;
  let mark = 0;
  let content;
  let tagInfo;
  let tagName;
  let tagArr;
  let tags = [];
  let tagObj = {};
  while (res = tagRegExp.exec(tpl)) {
    start = res.index;
    content = res[0];
    tagInfo = res[1];
    if (mark < start) {
      str = tpl.substring(mark, start);
      str.trim() && tags.push({
        type: 'string',
        content: str
      });
    }
    if (tagInfo) {
      tagArr = tagInfo.split(/\s+/);
      tagName = tagArr.shift();
      switch (tagName) {
      case 'if':
      case 'elseif':
        let variables = tagArr.filter(tag => {
          if (!tag) {
            return false;
          }
          tag = tag.trim();
          if (tag === 'null' || tag === 'undefined') {
            return false;
          }
          if (variableRegExp.test(tag)) {
            return true;
          }
          return false;
        });
        tagObj = {
          type: tagName,
          content: tagArr.join(' '),
          variables
        };
        // console.log(tagArr);
        break;
      case 'else':
        tagObj = {
          type: 'else'
        };
        break;
      case '/if':
        tagObj = {
          type: 'endif'
        };
        break;
      case 'for':
      case 'each':
        tagObj = {
          type: tagName,
          content: tagArr.join(' ')
        };
        break;
      case '/each':
        tagObj = {
          type: 'endeach'
        };
        break;
      default:
        tagObj = {
          type: 'var',
          content: tagInfo //{{}}包裹的部分都是变量
        };
      }
      tags.push(tagObj);
    }
    mark = start + content.length;
  }
  if (mark < tpl.length) {
    let str = tpl.substring(mark);
    str.trim() && tags.push({
      type: 'string',
      content: tpl.substring(mark)
    });
  }
  return tags;
}

function parseHtml(template) {

  let marks = [1, 1, 1];
  //      start end comment
  // has    0    0    0
  // no     1    1    1
  const START_MARK = 0;
  const END_MARK = 1;
  const COMMENT_MARK = 2;

  let list = [];

  let root = new TplNode('div');
  root.addAttr('id', 'valley-root')
  let node;
  TplNode.root = root;
  list.push(root);

  function analyzeTags(tags) {
    tags.forEach(tag => {
      switch (tag.type) {
      case 'each':
        tplNode = new TplNode(tag.type, tag.content);
        root.addChild(tplNode);
        root = tplNode;
        break;
      case 'endeach':
        root = root && root.parentNode;
        break;
      case 'if':
        tplNode = new TplNode('if');
        root.addChild(tplNode);
        root = tplNode;
        // add if-case
        tplNode = new TplNode('if-case', tag.content);
        tplNode.variables = tag.variables;
        root.addChild(tplNode);
        root = tplNode;
        break;
      case 'elseif':
        root = root && root.parentNode;
        tplNode = new TplNode('if-case', tag.content);
        tplNode.variables = tag.variables;
        root.addChild(tplNode);
        root = tplNode;
        break;
      case 'else':
        root = root && root.parentNode;
        tplNode = new TplNode('if-case', 'default');
        root.addChild(tplNode);
        root = tplNode;
        break;
      case 'endif':
        // out if-case
        root = root && root.parentNode;
        // out if
        root = root && root.parentNode;
        break;
      default:
        if (tag.content && tag.content.trim()) {
          tplNode = new TplNode(tag.type, tag.content);
          root.addChild(tplNode);
        }
      }
    });
  }

  while (template) {
    let checkList = [];
    template = template.replace(vWhiteSpaceRegExp, '');

    if (!template) {
      break;
    }

    if (marks[START_MARK]) {
      let startTagRes = template.match(startTagRegExp);
      startTagRes ? checkList.push(startTagRes) : (marks[START_MARK] = 0);
    }

    if (marks[END_MARK]) {
      let endTagRes = template.match(endTagRegExp);
      endTagRes ? checkList.push(endTagRes) : (marks[START_MARK] = 0);
    }

    if (marks[COMMENT_MARK]) {
      let commentRes = template.match(commentRegExp);
      commentRes ? checkList.push(commentRes) : (marks[COMMENT_MARK] = 0);
    }

    checkList.sort((item1, item2) => item1.index - item2.index);

    let tagRes = checkList.shift();
    let data = {};

    if (tagRes) {
      let matchStr = tagRes[0];
      if (tagRes.index > 0) {
        // let tags = analyzeText(template.substr(0, tagRes.index));
        let tags = toTags(template.substr(0, tagRes.index));
        analyzeTags(tags);
        template = template.substring(tagRes.index);
      }
      let type;
      if (matchStr.indexOf('</') === 0) {
        root && root.parentNode && (root = root.parentNode);
      } else if (matchStr.indexOf('<!--') === 0) {
      } else {
        let tagName = tagRes[1] || matchStr;
        node = new TplNode(tagName, tagRes[2] || '');
        root.addChild(node);
        root = node;
      }
      template = template.replace(matchStr, '')
    } else {
      // 没有标签
      let tags = toTags(template);
      analyzeTags(tags);
      template = '';
    }
  }
  return TplNode.root;
}

function readTplNode(tplNode) {
  // let tabstr = new Array(2 * level).join(' ');
  console.group(tplNode.tag, tplNode.content || '', tplNode.variables || '');
  tplNode.children.forEach(child => readTplNode(child));
  console.groupEnd();
}