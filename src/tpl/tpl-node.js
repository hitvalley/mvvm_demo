let id = 0;

class TplNode {
  constructor(tag, content) {
    if (!tag) {
      throw 'no tag name';
    }
    this.id = id++;
    this.tag = tag;
    this.content = content || '';
    this.children = [];
    this.parentNode = null;
    this.attrs = {};
    TplNode.list[this.id] = this;
  }
  addChild(child) {
    if (!child) {
      return;
    }
    this.children.push(child);
    child.parentNode = this;
  }
  addAttr(key, value) {
    this.attrs[key] = value;
  }
}

TplNode.list = [];