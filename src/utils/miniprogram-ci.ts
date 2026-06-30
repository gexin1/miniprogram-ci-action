import * as miniprogramCI from "miniprogram-ci";

const ci = (
  miniprogramCI as typeof miniprogramCI & { default?: typeof miniprogramCI }
).default ?? miniprogramCI;

export default ci;
