import { fromJS, Map } from "immutable";
import { updateCollection } from "src/utils";
import { Filter } from "t9entries/main/types/main-types";
import { actionType } from "t9redux/main/constants";
import { Category } from "t9types/main-types";

export const categories = (
  state: Category[] | null = null,
  action: {
    type: string,
    payload: Category[],
  }) => {
  switch (action.type) {
    case actionType.UPDATE_CATEGORIES:
      return action.payload;
    case actionType.UPDATE_SCENE_CATALOG_FILTER:
      const { key, name, checked } = action.payload as unknown as Filter;
      if (key !== "categories") {
        return state;
      }
      let ImmutableState = (fromJS(state) as Map<unknown, unknown>).toJS() as Category[];
      if (key) {
        ImmutableState = updateCollection(ImmutableState, [{ name, checked }], "name");
      }
      return ImmutableState;
    default:
      return state;
  }
};
