import NProgress from "nprogress";
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { LazySwitch } from "src/components/lazy-switch";
import { Loading } from "src/components/loading";
import { frontendConfig } from "src/config";
import { getUrlNodeByLevel } from "src/utils";
import { initWindowGlobals } from "src/utils/window-globals";
import { mainStore } from "t9redux/main";
import { fetchDataForCatalogScene, fetchFiltersForCatalogScene } from "t9redux/main/actions/catalog";
import { fetchCategories } from "t9redux/main/actions/categories";
import { fetchDataForGlassesScene } from "t9redux/main/actions/glasses";
import { fetchDataForLandingScene } from "t9redux/main/actions/landing";
import { Footer } from "../components/footer";
import { NavBar } from "../components/navbar";
import { mainConfig } from "../config";
import "./style";

// only called once across entry.
initWindowGlobals(mainConfig.app.frontendBaseURL, mainConfig.defaultLanguage.isDefaultLanguage, mainStore);

const lazyComponents = window.globals.addLazyComponents([
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "catalog" */ "../scenes/catalog"),
    operationName: "loading-catalog-scene",
    status: "not-loaded",
    url: { is: "/Glasses", exact: true },
  },
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "glasses" */ "../scenes/glasses"),
    operationName: "loading-glasses-scene",
    status: "not-loaded",
    transition: {
      key: () => "lawyer-scene" + getUrlNodeByLevel(3),
      level: 1,
    },
    url: { is: "/Glasses/:glassesId/:glassesBrand?/:glassesName?", exact: true },
  },
  {
    component: () => <Loading />,
    import: () => import(/* webpackChunkName: "landing" */ "../scenes/landing"),
    operationName: "loading-landing-scene",
    status: "not-loaded",
    url: { is: "", exact: true },
  },
]);

window.globals.addLazyOperations([
  {
    actions: [fetchCategories],
    operationName: "fetch-categories",
    repeatable: false, status: "not-called",
    url: { is: "", exact: false },
  },
  {
    actions: [fetchDataForLandingScene],
    operationName: "fetch-data-for-landing-scene",
    repeatable: false, status: "not-called",
    url: { is: "", exact: true },
  },
  {
    actions: [fetchDataForCatalogScene],
    operationName: "fetch-data-for-catalog-scene",
    repeatable: true, status: "not-called",
    url: { is: "/Glasses", exact: true },
  },
  {
    actions: [fetchFiltersForCatalogScene],
    operationName: "fetch-filters-for-catalog-scene",
    repeatable: false, status: "not-called",
    url: { is: "/Glasses", exact: true },
  },
  {
    actions: [fetchDataForGlassesScene],
    operationName: "fetch-data-for-glasses-scene",
    repeatable: true, status: "not-called",
    url: { is: "/Glasses/:glassesId/:glassesBrand?/:glassesName?", exact: true },
  },
]);

export const App: React.SFC<{}> = () => {
  return (
    <tbody>
      <tr><NavBar /></tr>
      <tr className="wh-100">
        <LazySwitch
          transitionKey={1}
          transitionClass="fade"
          timeout={frontendConfig.animation.animationDuration}

          childrenKey="app-level"
          lazyComponents={lazyComponents}
        />
      </tr>
      <tr><Footer /></tr>
    </tbody>
  );
};

render(
  (<Provider store={mainStore}><Router history={window.globals.history}><App /></Router></Provider>),
  document.getElementById("app-container"),
);

// Progress bar
NProgress.configure({ showSpinner: false, trickleSpeed: 200, minimum: .4, speed: 500 });
let _oldStatus: string;
mainStore.subscribe(() => {
  const status = mainStore.getState().status.status;
  if (_oldStatus === status) { return; }
  _oldStatus = status;
  if (status === "active") {
    NProgress.start();
  } else if (status === "idle") {
    NProgress.done();
  }
});

// navbar show/hide on scroll
let navbarMenuSticky: Element | null;
let showNavbarMenuSticky = false;
let navbarHeight = 0;
window.onscroll = () => {
  if (!navbarMenuSticky) {
    navbarMenuSticky = document.querySelector(".navbarMenu.sticky");
    if (!navbarMenuSticky) { return; }
    navbarHeight = (document.querySelector(".navbar") as Element).clientHeight;
  }
  const pos = document.documentElement.scrollTop;
  if (pos > navbarHeight && !showNavbarMenuSticky) {
    showNavbarMenuSticky = true;
    navbarMenuSticky.classList.add("show");
    document.body.classList.add("sticky");
  } else if (pos <= navbarHeight && showNavbarMenuSticky) {
    showNavbarMenuSticky = false;
    navbarMenuSticky.classList.remove("show");
    document.body.classList.remove("sticky");
  }
};
