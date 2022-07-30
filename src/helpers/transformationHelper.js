import { types } from "@/constants/transformations";
import { BaseTransformation } from "@/types/baseTransformation";
import { UrlTransformation } from "@/types/urlTransformation";

export function parseTranformation(transformation) {
  switch (transformation.type) {
    case types.basic:
      return new BaseTransformation(transformation.headerRule);

    case types.url:
      return new UrlTransformation(
        transformation.headerRule,
        transformation.url
      );

    default:
      break;
  }
}

export function parseTranformations(settings) {
  if (!settings?.transformations || !Array.isArray(settings.transformations))
    return;
  console.log("transformations set gonna parse...");
  settings.transformations = settings.transformations.map((trans) =>
    parseTranformation(trans)
  );
}