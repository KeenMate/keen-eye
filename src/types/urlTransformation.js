import { BaseTransformation } from "./baseTransformation";

export class UrlTransformation extends BaseTransformation {
  constructor(headerRule, url) {
    super(headerRule);
    this.url = url;
  }
  type = "url";
  url;
  getTranformedUrl(headerValue) {
    return this.url.replace("{}", headerValue);
  }
}
