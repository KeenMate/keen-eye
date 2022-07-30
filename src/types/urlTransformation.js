import { types } from "@/constants/transformations";
import { BaseTransformation } from "./baseTransformation";

export class UrlTransformation extends BaseTransformation {
  constructor(headerRule, url) {
    super(headerRule);
    this.url = url;
  }
  type = types.url;
  url;
  getTranformedUrl(headerValue) {
    return this.url.replace("{}", headerValue);
  }
}
