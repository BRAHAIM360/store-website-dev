import Axios from "axios";
import { mainConfig } from "t9entries/main/config";
import { actionType } from "t9redux/main/constants";
import { DispatchInterface as DI, MainStoreStateInterface as MSSI } from "t9types/main-types";
import { OpsCB } from "t9types/template-types";

export const fetchDataForLandingScene = (cb?: OpsCB) => ((dispatch: DI, getState: MSSI) => {
  const l = mainConfig.defaultLanguage.isDefaultLanguage ? "" : "_" + mainConfig.defaultLanguage.languageCode;

  Axios.post(
    mainConfig.app.backendURL,
    // tslint:disable-next-line: max-line-length
    { query: `{ slides { image { url } } topics { title: title${l} description : description${l} actionText: actionText${l} actionLink image { url } } collections { title:title${l} glasses { id name brand { name } thumbnail { url } } } }` }
  ).then((res) => {
    if (res.data.data) {
      dispatch({ type: actionType.UPDATE_SCENE_LANDING, payload: res.data.data });
    }
    if (cb) { cb(); }
  }).catch((err) => { if (cb) { cb({ message: err }); } });
});
