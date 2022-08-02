import { matchWithStairs } from "@/helpers/stringHelpers";

export class BaseTransformation {
  constructor(headerRule) {
    this.headerRule = headerRule;
  }
  type = "base";
  headerRule;
  match(headerName) {
    return matchWithStairs(headerName, this.headerRule);
  }
}
