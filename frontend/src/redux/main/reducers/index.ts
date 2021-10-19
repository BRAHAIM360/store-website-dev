import { combineReducers } from "redux";
import { catalogScene } from "./catalog-scene";
import { categories } from "./categories";
import { glassesScene } from "./glasses-scene";
import { landingScene } from "./landing-scene";
import { status } from "./status";

export const mainReducer = combineReducers({
  catalogScene,
  categories,
  glassesScene,
  landingScene,
  status,
});
