class TextNode extends ValleyNode {
  constructor(text) {
    super();
    this.element = document.createTextNode(text);
  }

  createAction() {
    super.createAction();
    if (this.element && this.parentElement) {
      this.parentElement.appendChild(this.element);
    }
    return this.element;
  }

  deleteAction() {
    return this.element.remove();
  }
}