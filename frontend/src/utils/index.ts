import { mergeDeep } from "immutable";
import pathToRegExp from "path-to-regexp";

export const getUrlNodeByLevel =
  (givenLevel: number, _url?: string) => {
    let level = givenLevel;
    if (!window.globals.isDefaultLanguage) { level++; }

    let url = _url || window.globals.history.location.pathname;
    const urlSearch = url.indexOf("?");
    if (urlSearch >= 0) { url = url.substring(0, urlSearch); }
    // first check for lazyComponents transition key:
    for (const lazyComponent of window.globals.lazyComponents) {
      if (lazyComponent.url.type) { continue; } // skip 404 and 302.

      const pathRegEx =
        pathToRegExp(
          window.globals.frontendBaseURL + lazyComponent.url.is, undefined, { end: lazyComponent.url.exact });
      // the path matches the lazyComponent URL, and i has a transition key with same requested level:
      if (pathRegEx.test(url) && lazyComponent.transition && lazyComponent.transition.level === givenLevel) {
        return lazyComponent.transition.key();
      }
    }

    // else continue the process:
    const regEx = /\/[^\/]*/g;
    let i = 0;
    while (1) {
      const match = regEx.exec(url);
      if (match === null) { break; }
      i++;
      if (i === level) {
        return match[0];
      }
    }
    return "/"; // @bug: it appears this code, never get reached :/
  };

/**
 * make changes to a collection by property.
 * bug: TODO: write bug info
 * notice: TODO: write notice info about original collection props are gonna be deleted
 * @param originalCollection that we want to update
 * @param updatesCollection changes we want to make
 * @param identifierField what field to use as identifier
 */
export const updateCollection = <T>(originalCollection: T[], updatesCollection: T[], identifierField: string) => {
  const arrayToReturn: T[] = [];
  for (const original of originalCollection) {
    let updated: T | null = null;
    for (const updateIndex in updatesCollection) {
      // check if it's there and it's not undefined as well
      if (updatesCollection.hasOwnProperty(updateIndex) && updatesCollection[updateIndex]) {
        const update = updatesCollection[updateIndex] as any;
        // found similar update:
        if (update[identifierField] === ((original as any)[identifierField])) {
          // deep merge original with update to updated
          updated = mergeDeep(original, update);
          // delete update from updatesCollection
          delete updatesCollection[updateIndex];
          break;
        }
      }
    }
    // no similar update found:
    if (!updated) {
      // deep merge original with {} to updated; basically converting to JS object without mutation
      updated = mergeDeep(original, {});
    }
    // add updated to arrayToReturn
    arrayToReturn.push(updated);
  }
  // add the new updates to arrayToReturn
  for (const updateIndex in updatesCollection) {
    // check if it's there and it's not undefined as well
    if (updatesCollection.hasOwnProperty(updateIndex) && updatesCollection[updateIndex]) {
      const updated = mergeDeep(updatesCollection[updateIndex], {});
      // add update to arrayToReturn
      arrayToReturn.push(updated);
    }
  }
  return arrayToReturn;
};
