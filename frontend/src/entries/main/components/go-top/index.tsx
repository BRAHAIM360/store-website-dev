import * as React from "react";
import { Icon } from "semantic-ui-react";
import "./style";

export const GoTop: React.SFC<{}> = () => {
  return (
    <div className="go-top" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}>
      <Icon name="arrow up" />
    </div>
  );
};
