import { types } from "@/transformations/transformationConstants";
import { BaseTransformation } from "./baseTransformation";

export class UrlTransformation extends BaseTransformation {
  constructor(headerRule, url) {
    super(headerRule);
    this.url = url;
  }
  type = types.url;
  url;
  /**
   * replaces placeholders in url {} = headerValue {name} = value of header with same name
   */
  getTranformedUrl(headerValue, headers) {
    let transformedUrl = this.url.replace("{}", headerValue);
    headers.forEach((header) => {
      transformedUrl = transformedUrl.replace(`{${header.name}}`, header.value);
    });
    return transformedUrl;
  }
}
