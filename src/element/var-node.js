class VarNode extends ValleyNode {
  constructor(text) {
    super();
    this.text = text;
    this.element = document.createTextNode(this.text);
  }

  createAction() {
    // debugger;
    super.createAction();
    if (this.element && this.parentElement) {
      this.parentElement.appendChild(this.element);
    }
    return this.element;
  }

  deleteAction() {
    return this.element.remove();
  }

  updateAction(key, value, target) {
    if (target[key] !== value) {
      this.element.nodeValue = value;
    }
    return value;
  }

  getAction() {
    return this.element.nodeValue;
  }
}
