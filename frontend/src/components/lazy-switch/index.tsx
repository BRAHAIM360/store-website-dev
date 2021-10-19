import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { listenForPushState } from "src/utils/window-globals";
import { LazyComponent } from "t9types/template-types";
import { AsyncComponent } from "../async-component";
import { TransitionV2, TransitionV2Props } from "../transition-v2";

export class LazySwitch extends React.Component<LazySwitchProps, {}> {

  // Listen to URL changes
  constructor(props: LazySwitchProps) { super(props); listenForPushState(this); }

  public render() {
    return (
      <TransitionV2
        transitionKey={this.props.transitionKey}
        transitionClass={this.props.transitionClass}
        timeout={this.props.timeout}
      >
        <Switch location={window.globals.history.location} >
          {this.props.lazyComponents.map((lazyComponent, index) => (
            <Route
              key={this.props.childrenKey + index}
              exact={lazyComponent.url.exact}
              path={window.globals.frontendBaseURL + lazyComponent.url.is}
              render={() => (lazyComponent.protected && !lazyComponent.protected.isAccessible())
                ? <lazyComponent.component /> // show the loading component instead, while waiting for redirect
                : <AsyncComponent lazyComponent={lazyComponent} />}
            />
          ))}
        </Switch>
      </TransitionV2>
    );
  }
}

interface LazySwitchProps extends TransitionV2Props {
  childrenKey: string;
  lazyComponents: LazyComponent[];
}
