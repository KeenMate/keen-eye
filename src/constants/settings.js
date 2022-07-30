export const EMPTY_SETTINGS = {
  inject: false,
  headerRules: [],
  requestsRules: [],
  locale: null,
  position: { x: 0, y: 0 },
  transformations: [],
};

export const levels = {
  page: "page",
  origin: "origin",
  domain: "domain",
  global: "global",
};

export const colors = {
  [levels.global]: "LightBlue",
  [levels.domain]: "LightGreen",
  [levels.origin]: "LightCoral",
  [levels.page]: "LightYellow",
};
