import * as React from "react";
import { Grid } from "semantic-ui-react";
import "./style";

export const AboutUs: React.SFC<{}> = () => {
  return (
    <Grid className="about-us" stackable={true} columns="2">
      <Grid.Column textAlign="center" verticalAlign="middle">
        <h1>{"{|Welcome|}"}</h1>
      </Grid.Column>
      <Grid.Column className="detail" verticalAlign="middle" textAlign="left">
        <p>{"{|Paragraph 1|}"}</p>
      </Grid.Column>
    </Grid>
  );
};
