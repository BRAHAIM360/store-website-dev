import { createBrowserHistory } from "history";
import pathToRegExp from "path-to-regexp";
import { RellaxInstance } from "rellax";
import { frontendConfig } from "src/config";
import { mainConfig } from "t9entries/main/config";
import { actionType } from "t9redux/main/constants";
import { LazyComponent, LazyOperation } from "t9types/template-types";

// @todo: componentWillUnmount will be deprecated in React 17
/**
 * Injecting this, will make the component forcefully re-render on every URL change
 *
 * @param aReactComponent the component to apply the changes to
 * @param componentWillUnmount this will be the new componentWillMount method
 */
export const listenForPushState = (aReactComponent: React.Component, componentWillUnmount?: () => void) => {
  const unListen = globals.history.listen(() => { aReactComponent.forceUpdate(); });
  aReactComponent.componentWillUnmount = () => { unListen(); if (componentWillUnmount) { componentWillUnmount(); } };
};

const lazyComponents: LazyComponent[] = [];
const lazyOperations: LazyOperation[] = [];
let store: any = {};

/**
 * The function that awaits for promises by url to finish, it checks for LazyComponent and LazyOperations promises
 *
 * @param nextUrl the URL we want to go to
 * @param callback is the pushState is passed or not
 * @param operationsOnly whether to ignore checking the lazyComponents, and only check for lazyOperations
 */
const runPromisesByURL = (nextUrl: string, callback: (result: boolean) => void, operationsOnly?: boolean) => {
  const promises: Array<Promise<any>> = [];
  const pathname = (nextUrl.indexOf("?") >= 0 ? nextUrl.substring(0, nextUrl.indexOf("?")) : nextUrl);

  // check lazy components:
  for (const lazyComponent of lazyComponents) {
    if (lazyComponent.url.type) { continue; } // skip 404 and 302 for now.

    const pathRegEx = pathToRegExp(
      mainConfig.app.frontendBaseURL + lazyComponent.url.is, undefined, { end: lazyComponent.url.exact });

    // stop everything and redirect if the url is protected and the access is denied:
    if (pathRegEx.test(pathname) && lazyComponent.protected && !lazyComponent.protected.isAccessible()) {
      window.globals.history.push(lazyComponent.protected.redirectTo);
      return; // shouldn't it return something? nvm
    }

    // the path matches the lazyComponent URL and it's not yet/being loaded:
    if (!operationsOnly && pathRegEx.test(pathname) && lazyComponent.status === "not-loaded") {

      lazyComponent.status = "loading";

      if (lazyComponent.operationName) {
        window.globals.dispatch({ payload: lazyComponent.operationName, type: actionType.STATUS_ADD_OP });
      }

      const importPromise = lazyComponent.import();
      promises.push(importPromise);

      // process the promise when it's resolved:
      importPromise.then((jsModule) => {
        lazyComponent.component = jsModule.default;
        lazyComponent.status = "loaded";
        if (lazyComponent.operationName) {
          window.globals.dispatch({ payload: lazyComponent.operationName, type: actionType.STATUS_REMOVE_OP });
        }
      }).catch(() => {
        lazyComponent.status = "not-loaded";
        if (lazyComponent.operationName) {
          window.globals.dispatch({ payload: lazyComponent.operationName, type: actionType.STATUS_REMOVE_OP });
        }
      });

    }
  }

  // check lazy operation:
  for (const lazyOperation of lazyOperations) {
    if (lazyOperation.url.type === "404") { continue; } // skip 404 for now.

    const pathRegEx = pathToRegExp(
      mainConfig.app.frontendBaseURL + lazyOperation.url.is, undefined, { end: lazyOperation.url.exact });

    // the path matches the lazyOperation URL
    if (pathRegEx.test(pathname)) {
      // The lazyOperation is not yet/being loaded, or it's repeatable:
      if (lazyOperation.status === "not-called" || (lazyOperation.status === "done" && lazyOperation.repeatable)) {

        lazyOperation.status = "pending";

        if (lazyOperation.operationName) {
          window.globals.dispatch({ payload: lazyOperation.operationName, type: actionType.STATUS_ADD_OP });
        }

        const lazyOperationPromises = [];
        for (const lazyAction of lazyOperation.actions) {
          lazyOperationPromises.push(new Promise((resolve, reject) => {
            window.globals.dispatch(lazyAction((err) => { if (err) { reject(err); } else { resolve(); } }));
          }));
        }

        const lazyOperationPromisesDotAll = Promise.all(lazyOperationPromises);
        promises.push(lazyOperationPromisesDotAll);

        lazyOperationPromisesDotAll.then(() => {
          lazyOperation.status = "done";
          if (lazyOperation.operationName) {
            window.globals.dispatch({ payload: lazyOperation.operationName, type: actionType.STATUS_REMOVE_OP });
          }
        }).catch(() => {
          lazyOperation.status = "not-called";
          if (lazyOperation.operationName) {
            window.globals.dispatch({ payload: lazyOperation.operationName, type: actionType.STATUS_REMOVE_OP });
          }
        });

      }
    }
  }
  // when done, pass to next URL, otherwise abort the pushState
  Promise.all(promises).then(() => { callback(true); }).catch(() => { callback(false); });
};

/**
 * The Globals object (window.global)
 */
const globals = {
  /**
   * Add LazyComponents to load them later by URL
   *
   * @param _lazyComponents the lazyComponents to be added
   */
  addLazyComponents: (_lazyComponents: LazyComponent[]) => {
    lazyComponents.push(..._lazyComponents);
    return _lazyComponents;
  },
  /**
   * Add lazyOperations to proceed them later by URL
   *
   * @param _lazyOperations the lazyOperations to be added
   */
  addLazyOperations: (_lazyOperations: LazyOperation[]) => {
    lazyOperations.push(..._lazyOperations);
    // wait until the scope is cleared:
    setTimeout(() => { runPromisesByURL(window.globals.history.location.pathname, () => null, true); }, 0);
    return _lazyOperations;
  },
  /**
   * The Redux dispatch function
   *
   * @param action the Redux action
   */
  dispatch: (action: any) => { store.dispatch(action); },
  frontendBaseURL: mainConfig.app.frontendBaseURL,
  history: createBrowserHistory({
    getUserConfirmation(nextURL: string, callback: (result: boolean) => void) {
      const pushStateAction = nextURL[0];
      nextURL = nextURL.substr(1);
      // @bug: should ignore when there's a new pushState.
      window.globals.nextURL = nextURL;
      runPromisesByURL(nextURL, (pass: boolean) => {
        if (pass) {
          window.ga("set", "page", nextURL); window.ga("send", "pageview");

          // TODO: respect the #
          // scroll to top when push action is Forward and the url pathname changed
          const searchIndex = nextURL.indexOf("?");
          const nextURLNoSearch = nextURL.substring(0, searchIndex >= 0 ? searchIndex : undefined);
          if (pushStateAction === "F" && (nextURLNoSearch !== location.pathname)) {
            setTimeout(() => { window.scrollTo(0, 0); }, 0.8 * frontendConfig.animation.animationDuration / 2);
          }
        } else {
          window.globals.nextURL = window.globals.history.location.pathname;
        }
        callback(pass);
      });
    },
  }),
  isDefaultLanguage: true,
  lazyActions: lazyOperations,
  lazyComponents,
  nextURL: location.pathname + location.search,
};

globals.history.block((location, action) => {
  switch (action) {
    case "PUSH": return "F" + location.pathname + location.search;
    case "POP": return "B" + location.pathname + location.search;
    default: return "R" + location.pathname + location.search;
  }
});

// initiate it only once across the entire app, and expose it as window.pushState
export const initWindowGlobals = (frontendBaseURL: string, isDefaultLanguage: boolean, _store: any) => {
  globals.frontendBaseURL = frontendBaseURL;
  globals.isDefaultLanguage = isDefaultLanguage;
  store = _store;
  window.globals = globals;
};

declare global {
  interface Window {
    globals: typeof globals;
    rellax: RellaxInstance;
    // tslint:disable-next-line: max-line-length
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#adding-commands-to-the-queue
    ga: (command: string, ...fields: any[]) => void;
  }
}
