import { fullstackConfig } from "config";
import { frontendConfig } from "src/config";

import { isDefaultLanguage, languageCode } from "../default-language";

const host = (typeof window !== "undefined") ?
  window.location.host : (frontendConfig.environment.isDev ? "127.0.0.1" : "www.visionstorebiskra.com");
const protocol = (typeof window !== "undefined") ?
  window.location.protocol : (frontendConfig.environment.isDev ? "http" : "https");
const origin = protocol + "//" + host;

const frontendBaseURL = isDefaultLanguage ? "" : "/" + languageCode;
const backendBaseURL = fullstackConfig.app.apiSlug;

export const app = {
  host,
  origin,
  protocol,

  backendBaseURL,
  backendURL: origin + backendBaseURL,
  frontendBaseURL,
  frontendURL: origin + frontendBaseURL,
};
