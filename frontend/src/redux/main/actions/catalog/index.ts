import Axios from "axios";
import { parseUrl } from "query-string";
import { mainConfig } from "t9entries/main/config";
import { actionType } from "t9redux/main/constants";
import { DispatchInterface as DI, Filter, Glasses, MainStoreStateInterface as MSSI } from "t9types/main-types";
import { OpsCB } from "t9types/template-types";

export const updateCatalogFilters = (
  dispatch: DI,
  getState: MSSI,
  params = parseUrl(window.globals.nextURL).query,
  filterNames = ["categories", "lenses", "shapes", "brands"],
) => {
  // get old state
  const { catalogScene, categories: cats } = getState();
  const oldFiltersState = { ...catalogScene, categories: cats } as any;

  // update state object
  const newFiltersState = filterNames
    // only filters
    .filter((filterName, i) => oldFiltersState[filterName])
    // new checked values
    .map((filterName, i) => ({
      [filterName]: (oldFiltersState[filterName] as Filter[]).map((filter, j) => (
        {
          ...filter,
          checked: (params[filterName] && (params[filterName] as string).split(",").indexOf(filter.name) >= 0) || false,
        }
      )),
    }))
    // convert from array to object
    .reduce((prev, curr, i) => ({ ...prev, ...curr }), {} as any);

  // update Redux store
  const { categories, lenses, shapes, brands } = newFiltersState;
  if (categories) {
    dispatch({ type: actionType.UPDATE_CATEGORIES, payload: categories });
  }
  if (lenses || shapes || brands) {
    dispatch({ type: actionType.UPDATE_SCENE_CATALOG, payload: { lenses, shapes, brands } });
  }
};

export const fetchDataForCatalogScene = (cb?: OpsCB) => ((dispatch: DI, getState: MSSI) => {
  const l = mainConfig.defaultLanguage.isDefaultLanguage ? "" : "_" + mainConfig.defaultLanguage.languageCode;

  // extract filters from URL
  const params = parseUrl(window.globals.nextURL).query;
  const filterNames = ["categories", "lenses", "shapes", "brands"];
  const filters = filterNames
    .filter((filterName, i) => params[filterName])
    // tslint:disable-next-line: max-line-length
    .map((filterName, i) => ({ [filterName !== "brands" ? filterName : "brand"]: { ["name" + (filterName !== "brands" ? l : "")]: (params[filterName] as string).split(",") } }))
    .reduce((prev, curr, i) => ({ ...prev, ...curr }), {} as object);
  const filterQuery = JSON.stringify(filters).replace(/\"([^(\")"]+)\":/g, "$1:");
  const sort = params.sort || "name:desc";
  const limit = 15;
  const page = params.page ? Number(params.page) : 1;

  // update filters state
  updateCatalogFilters(dispatch, getState, params, filterNames);

  // fetch glasses
  Axios.post(
    mainConfig.app.backendURL,
    {
      // tslint:disable-next-line: max-line-length
      query: `{ glasses ( where: ${filterQuery} sort:"${sort}" start: ${(page - 1) * limit} limit: ${limit} ) { id name price brand { name } thumbnail { url } } }`,
    },
  ).then((res) => {
    if (res.data.data.glasses) {
      // apply Cloudinary resize API to image URL
      const glasses = (res.data.data.glasses as Glasses[]).map((oneGlasses, i) => (
        {
          ...oneGlasses,
          thumbnail: {
            url: oneGlasses.thumbnail.url.replace("image/upload", "image/upload/w_512,c_scale"),
          },
        }
      ));
      // update state
      dispatch({
        payload: {
          glassesList: glasses,
          searchId: String(Math.random()),
        },
        type: actionType.UPDATE_SCENE_CATALOG,
      });
      const element = (document.querySelector(".sort-by") as HTMLTableCellElement);
      if (element) { element.scrollIntoView({ behavior: "smooth" }); }
    }
    if (cb) { cb(); }
  }).catch((err) => { if (cb) { cb({ message: err }); } });
});

export const fetchFiltersForCatalogScene = (cb?: OpsCB) => ((dispatch: DI, getState: MSSI) => {
  const l = mainConfig.defaultLanguage.isDefaultLanguage ? "" : "_" + mainConfig.defaultLanguage.languageCode;

  Axios.post(
    mainConfig.app.backendURL,
    { query: `{ lenses { name: name${l} } shapes { name: name${l} } brands { name } }` },
  ).then((res) => {
    if (res.data.data) {
      dispatch({ type: actionType.UPDATE_SCENE_CATALOG, payload: res.data.data });
      // update filters state
      updateCatalogFilters(dispatch, getState);
    }
    if (cb) { cb(); }
  }).catch((err) => { if (cb) { cb({ message: err }); } });
});

export const updateCatalogUrl = () => ((dispatch: DI, getState: MSSI) => {
  const { catalogScene, categories } = getState();
  const filters: Array<{ key: string, options: Filter[] }> = [];

  const reducedCategories = (categories || []).filter((category) => category.checked, []);
  const reducedLenses = catalogScene.lenses ? catalogScene.lenses.filter((lense) => lense.checked, []) : [];
  const reducedShapes = catalogScene.shapes ? catalogScene.shapes.filter((shape) => shape.checked, []) : [];
  const reducedBrands = catalogScene.brands ? catalogScene.brands.filter((brand) => brand.checked, []) : [];

  if (reducedCategories.length) { filters.push({ key: "categories", options: reducedCategories }); }
  if (reducedShapes.length) { filters.push({ key: "shapes", options: reducedShapes }); }
  if (reducedLenses.length) { filters.push({ key: "lenses", options: reducedLenses }); }
  if (reducedBrands.length) { filters.push({ key: "brands", options: reducedBrands }); }

  if (catalogScene.sort !== "d-name") {
    filters.push({
      key: "sort",
      options: [
        { name: catalogScene.sort.substring(2) + ":" + (catalogScene.sort[0] === "d" ? "desc" : "asc") },
      ],
    });
  }

  if (catalogScene.page > 1) {
    filters.push({
      key: "page",
      options: [
        { name: String(catalogScene.page) },
      ],
    });
  }

  window.globals.history.push(mainConfig.app.frontendBaseURL + "/Glasses?" + filters
    .map((filter, i) => filter.key + "=" + filter.options.map((option) => option.name).join(","))
    .join("&"),
  );
});
