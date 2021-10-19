import { LandingSceneProps } from "t9entries/main/scenes/landing";
import { actionType } from "t9redux/main/constants";

export const landingScene = (
  state: LandingSceneProps = {
    collections: undefined,
    slides: undefined,
    topics: undefined,
  },
  action: {
    type: string,
    payload: object,
  }) => {
  switch (action.type) {
    case actionType.UPDATE_SCENE_LANDING:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
