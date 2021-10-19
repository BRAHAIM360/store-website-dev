import { fromJS, Map } from "immutable";
import { updateCollection } from "src/utils";
import { CatalogSceneProps } from "t9entries/main/scenes/catalog";
import { Filter } from "t9entries/main/types/main-types";
import { actionType } from "t9redux/main/constants";

export const catalogScene = (
  state: CatalogSceneProps = {
    brands: undefined,
    glassesList: undefined,
    lenses: undefined,
    page: 1,
    searchId: "",
    shapes: undefined,
    sort: "d-name",
  },
  action: {
    type: string,
    payload: object | Filter,
  }) => {
  switch (action.type) {
    case actionType.UPDATE_SCENE_CATALOG:
      return { ...state, ...action.payload };
    case actionType.UPDATE_SCENE_CATALOG_FILTER:
      const { key, name, checked } = action.payload as Filter;
      if (key === "categories") {
        return state;
      }
      const ImmutableState = (fromJS(state) as Map<unknown, unknown>).toJS() as CatalogSceneProps;
      if (key) {
        (ImmutableState as any)[key] = updateCollection((ImmutableState as any)[key], [{ name, checked }], "name");
      }
      return ImmutableState;
    default:
      return state;
  }
};
