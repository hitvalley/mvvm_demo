class TagNode extends ValleyNode {
  constructor(tagName, attrs) {
    super();

    this.tagName = tagName;
    this.attrs = attrs || {};

    this.element = document.createElement(this.tagName);
  }

  createAction() {
    super.createAction();
    // this.element = document.createElement(this.tagName);
    this.children.forEach(child => child.createAction());
    if (this.element && this.parentElement) {
      this.parentElement.appendChild(this.element);
    }
    return this.element;
  }

  deleteAction() {
    return this.element.remove();
  }

}