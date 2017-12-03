class IfNode extends ValleyNode {
  constructor() {
    super();
    this.tagName = 'if';
    this.default = null;
    this.selected = null;
  }

  addChild(child) {
    if (child.judgement === 'default') {
      this.default = child;
    }
    super.addChild(child);
  }

  check(act) {
    let selected;
    let self = this;
    this.children.forEach(child => {
      if (!selected && child.check()) {
        selected = child;
        act && child[`${act}Action`]();
      }
    });
    return selected || this.default;
  }

  createAction() {
    super.createAction();
    let child = this.check('create');
    this.selected = child;
    return child.elements;
  }

  deleteAction() {
    this.children.forEach(child => child.deleteAction());
  }

  updateAction() {
    let child = this.check('create');
    this.selected.elements.forEach(element => element && element.remove());
    this.selected = child;
  }

}