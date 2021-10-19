import Axios from "axios";
import { mainConfig } from "t9entries/main/config";
import { actionType } from "t9redux/main/constants";
import { DispatchInterface as DI, MainStoreStateInterface as MSSI } from "t9types/main-types";
import { OpsCB } from "t9types/template-types";
import { updateCatalogFilters } from "../catalog";

export const fetchCategories = (cb?: OpsCB) => ((dispatch: DI, getState: MSSI) => {
  const l = mainConfig.defaultLanguage.isDefaultLanguage ? "" : "_" + mainConfig.defaultLanguage.languageCode;

  Axios.post(
    mainConfig.app.backendURL,
    { query: `{ categories { name: name${l} } }` },
  ).then((res) => {
    if (res.data.data) {
      dispatch({ type: actionType.UPDATE_CATEGORIES, payload: res.data.data.categories });
      // update filters state
      updateCatalogFilters(dispatch, getState);
    }
    if (cb) { cb(); }
  }).catch((err) => { if (cb) { cb({ message: err }); } });
});
