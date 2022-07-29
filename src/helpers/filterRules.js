import { matchWithStairs } from "@/helpers/stringHelpers";

export default class filterRules {
  constructor(filterRulesArray) {
    this.rules = filterRulesArray ?? [];
  }
  rules;

  //this will replace all rules with * user add if you want to preserve previous rules
  selectAll() {
    this.rules = ["*"];
  }
  exists(rule) {
    return 0 < this.rules.findIndexOf(rule);
  }
  //add rule if not already there
  add(rule) {
    if (this.exists(rule)) this.rules.push(rule);
  }
  remove(rule) {
    this.rules = this.rules.filter((r) => r != rule);
  }
  toggle(rule) {
    if (this.exists(rule)) this.remove(rule);
    this.add(rule);
  }

  filterOne(key) {
    return this.rules.some((allowed) => {
      return matchWithStairs(key, allowed);
    });
  }
  filter(data, propName) {
    if (!data) return [];
    return data.filter(({ [propName]: key }) => {
      return this.filterOne(key);
    });
  }
}
