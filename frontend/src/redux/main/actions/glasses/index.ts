import Axios from "axios";
import { getUrlNodeByLevel } from "src/utils";
import { mainConfig } from "t9entries/main/config";
import { actionType } from "t9redux/main/constants";
import { DispatchInterface as DI, Glasses, MainStoreStateInterface as MSSI } from "t9types/main-types";
import { OpsCB } from "t9types/template-types";

export const fetchDataForGlassesScene = (cb?: OpsCB) => ((dispatch: DI, getState: MSSI) => {
  const slug = getUrlNodeByLevel(3, window.globals.nextURL);
  const glassesId = slug.substr(slug.lastIndexOf("~") + 1);

  Axios.post(
    mainConfig.app.backendURL,
    // tslint:disable-next-line: max-line-length
    { query: `{ glasses(where: { _id: "${glassesId}" }) { name price code brand { name } images { image { url } } categories { name } lenses { name } shapes { name } } }` },
  ).then((res) => {
    if (res.data.data.glasses && res.data.data.glasses.length > 0) {
      // apply Cloudinary resize API to image URL
      const glasses = {
        ...(res.data.data.glasses[0] as Glasses),
        images: (res.data.data.glasses[0] as Glasses).images.map((image, i) => (
          {
            image: {
              url: image.image.url.replace("image/upload", "image/upload/w_1024,c_scale"),
            },
          }
        )),
      };
      // update state
      dispatch({ type: actionType.UPDATE_SCENE_GLASSES, payload: { glasses } });
    }
    if (cb) { cb(); }
  }).catch((err) => { if (cb) { cb({ message: err }); } });
});
