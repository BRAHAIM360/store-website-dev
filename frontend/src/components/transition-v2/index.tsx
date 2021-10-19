import * as React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getUrlNodeByLevel } from "src/utils";

export const TransitionV2: React.SFC<TransitionV2Props> =
  ({ className, childClass, children, timeout, transitionClass, transitionKey }) => {
    return (
      <TransitionGroup className={className}>
        <CSSTransition
          key={typeof transitionKey === "number" ? getUrlNodeByLevel(transitionKey) : transitionKey}
          classNames={transitionClass}
          timeout={timeout}
        >
          <div className={childClass}>
            {children}
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  };

export interface TransitionV2Props {
  transitionKey: string | number;
  transitionClass: string;
  childClass?: string;
  className?: string;
  timeout: number;
}
