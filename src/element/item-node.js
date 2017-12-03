class ItemNode extends ValleyNode {
  constructor(data, key) {
    super();
    this.tagName = 'item';
    this.element = null;
    this.data = data;
    this.key = key;
  }

  createAction() {
    super.createAction();
    this.children.forEach(child => child.createAction());
    return this.element;
  }

  deleteAction() {
    this.children.forEach(child => child.deleteAction());
  }

  updateAction() {
    this.children.forEach(child => child.deleteAction());
  }

  getAction() {
  }
}