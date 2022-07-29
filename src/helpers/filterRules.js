import { matchWithStairs } from "@/helpers/stringHelpers";

export default class filterRules {
  constructor(filterRulesArray, saveFunction) {
    this.rules = filterRulesArray ?? [];
    this.saveFunc = saveFunction;
  }
  rules;
  saveFunc;
  save() {
    if (this.saveFunc && typeof this.saveFunc === "function")
      this.saveFunc(this.rules);
  }

  toggleAll() {
    //"*" is only rule remove it else set it to be only rules
    if (this.exists("*")) {
      this.rules = [];
    } else {
      this.rules = ["*"];
    }
    this.save();
  }
  all() {
    return this.exists("*");
  }

  removeWildCard() {
    this.rules = this.rules.filter(
      (rule) => !rule.includes("*") || rule === "*"
    );
    this.save();
  }
  exists(rule) {
    return this.rules.find((r) => r == rule);
  }
  //add rule if not already there
  add(rule) {
    //enforce star
    if (this.all()) this.toggleAll();
    if (!this.exists(rule)) this.rules.push(rule);
    this.save();
  }
  remove(rule) {
    this.rules = this.rules.filter((r) => {
      return r != rule;
    });
    this.save();
  }
  toggle(rule) {
    if (this.exists(rule)) {
      this.remove(rule);
    } else {
      this.add(rule);
    }
  }

  filterOne(key) {
    return this.rules.some((allowed) => {
      return matchWithStairs(key, allowed);
    });
  }
  filter(data, propName) {
    if (this.all()) return data;
    console.log(data);
    if (!data) return [];
    return data.filter(({ [propName]: key }) => {
      return this.filterOne(key);
    });
  }
}
