export class BaseTransformation {
  constructor(headerRule) {
    this.headerRule = headerRule;
  }
  type = "base";
  headerRule;
}
