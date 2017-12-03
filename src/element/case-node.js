class CaseNode extends ValleyNode {
  constructor(judgement) {
    super();
    this.tagName = 'if-case';
    this.element = null;
    this.judgement = judgement || '';
    this.elements = [];
    // console.log(this.judgement)
  }

  // checkVariable

  // check() {
  //   return this.judgement === 'default' || (new Function(`return ${this.judgement};`)());
  // }

  createAction() {
    super.createAction();
    let self = this;
    this.children.forEach(child => {
      let element = child.createAction();
      self.elements.push(element);
    });
    return this.elements;
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