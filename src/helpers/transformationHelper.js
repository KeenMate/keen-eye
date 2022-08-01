import { types } from "@/constants/transformations";
import { BaseTransformation } from "@/types/baseTransformation";
import { UrlTransformation } from "@/types/urlTransformation";

export function parseTranformation(transformation) {
  switch (transformation?.type) {
    case types.basic:
      return new BaseTransformation(transformation.headerRule);

    case types.url:
      return new UrlTransformation(
        transformation.headerRule,
        transformation.url
      );

    default:
      return undefined;
  }
}

export function parseTranformations(settings) {
  if (!settings?.transformations || !Array.isArray(settings.transformations))
    return;

  //this is to remove null and undefs
  settings.transformations = settings?.transformations.filter((val) => val);

  settings.transformations = settings.transformations.map((trans) =>
    parseTranformation(trans)
  );
}