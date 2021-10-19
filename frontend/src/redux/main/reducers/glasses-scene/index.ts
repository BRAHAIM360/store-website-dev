import { GlassesSceneProps } from "t9entries/main/scenes/glasses";
import { actionType } from "t9redux/main/constants";

export const glassesScene = (
  state: GlassesSceneProps = {
    glasses: undefined,
  },
  action: {
    type: string,
    payload: object,
  }) => {
  switch (action.type) {
    case actionType.UPDATE_SCENE_GLASSES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
