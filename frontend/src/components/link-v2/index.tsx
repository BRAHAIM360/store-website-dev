import * as React from "react";
import { Link, LinkProps } from "react-router-dom";

export class LinkV2 extends React.PureComponent<LinkProps, {}> {
  public render() {
    return (
      <Link {...this.props} to={window.globals.frontendBaseURL + this.props.to} />
    );
  }
}
