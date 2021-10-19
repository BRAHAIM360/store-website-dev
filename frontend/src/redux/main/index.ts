import { createStore } from "redux";
import { applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { frontendConfig } from "src/config";
import { mainReducer } from "./reducers";

const middleware = (frontendConfig.environment.isDev ? applyMiddleware(createLogger(), thunk) : applyMiddleware(thunk));

export const mainStore = createStore(mainReducer, middleware);
