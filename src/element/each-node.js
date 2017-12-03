class EachNode extends ValleyNode {
  constructor(name, item, index) {
    super();
    this.tagName = 'each';
    this.name = name;
    this.item = item;
    this.index = index;
  }

  addItem() {
  }

  createAction() {
    super.createAction();
    this.children.forEach(child => child.createAction());
  }

  deleteAction() {
    this.children.forEach(child => child.deleteAction());
  }

  updateAction() {
    this.children.forEach(child => child.updateAction());
  }

}