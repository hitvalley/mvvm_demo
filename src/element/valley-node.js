class ValleyNode {
  constructor() {
    this.actions = [];
    this.children = [];
    this.parentNode = null;

    this.element = null;
    this.parentElement = null;

    this.init();
  }

  init() {
  }

  getParentElement() {
    // console.log(this.element.tagName, this, this.parentNode && this.parentNode.tagName)
    if (this.parentElement) {
      return this.parentElement;
    }

    if (!this.parentNode) {
      return null;
    }

    if (this.parentNode.element) {
      this.parentElement = this.parentNode.element;
      return this.parentElement;
    }

    this.parentElement = this.parentNode.getParentElement();
    return this.parentElement;
  }

  addChild(child) {
    this.children.push(child);
    child.parentNode = this;

    // child.parentElement = this.element || this.parentElement;
    // console.log(this.tagName, this.element, this.parentElement);
  }

  createAction(key, value, target) {
    this.parentElement = this.getParentElement();
    // console.log(this.tagName, this.element, this.parentElement);
  }

  deleteAction(key, value, target) {
    console.log(key, value, target);
  }

  updateAction(key, value, target) {
    console.log(key, value, target);
  }

  getAction(key, value, target) {
    console.log(key, value, target);
  }

  notify(type, key, value, target) {
    // type: create, delete, update, get
    let action = this[`${type}Action`];
    if (this[`${type}Action`]) {
      this[`${type}Action`](key, value, target);
    }
  }
}