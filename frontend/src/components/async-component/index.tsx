import * as React from "react";
import { LazyComponent } from "t9types/template-types";

export class AsyncComponent extends React.PureComponent<AsyncComponentProps, {}> {

  public componentWillMount() {
    if (this.props.lazyComponent.status === "not-loaded") {
      this.props.lazyComponent.import()
        .then((jsModule) => {
          this.props.lazyComponent.component = jsModule.default;
          this.props.lazyComponent.status = "loaded";
          this.forceUpdate();
        })
        .catch(() => {
          this.props.lazyComponent.status = "not-loaded";
        });
    }
  }

  public render() {
    return <this.props.lazyComponent.component />;
  }
}

export interface AsyncComponentProps {
  lazyComponent: LazyComponent;
  loadingStatus?: (status: string) => void;
}
