import * as React from "react";
import { Route, RouteProps } from "react-router-dom";
import { frontendConfig } from "src/config";

export class RouteV2 extends React.PureComponent<RouteProps, {}> {
  public render() {
    return (
      <Route {...this.props} path={frontendConfig.app.baseUrl + this.props.path} />
    );
  }
}
