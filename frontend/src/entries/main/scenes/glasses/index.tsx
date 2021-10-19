import React from "react";
import { connect } from "react-redux";
import { Breadcrumb, Grid, Placeholder } from "semantic-ui-react";
import { LinkV2 } from "src/components/link-v2";
import { GoTop } from "t9entries/main/components/go-top";
import { Glasses } from "t9entries/main/types/main-types";
import { Address } from "../../components/address";
import { Detail } from "./detail";
import { Images } from "./images";
import "./style";

class GlassesScene extends React.Component<GlassesSceneProps, {}> {

  public componentDidMount() {
    document.title = "{|page title|}";
  }

  public render() {
    return (
      <div className="glasses">
        <div className="breadcrumb" >
          {this.props.glasses ?
            <Breadcrumb
              icon="right angle"
              sections={[
                { link: true, content: <LinkV2 to="/">{"{|Home|}"}</LinkV2> },
                { link: true, content: <LinkV2 to="/Glasses">{"{|Catalog|}"}</LinkV2> },
                {
                  // tslint:disable-next-line: max-line-length
                  content: <LinkV2 to={`/Glasses?brands=${this.props.glasses.brand.name}`}>{this.props.glasses.brand.name}</LinkV2>,
                  link: true,
                },
                { content: this.props.glasses.name, active: true },
              ]}
            /> :
            <Placeholder>
              <Placeholder.Line />
            </Placeholder>
          }
        </div>
        <Grid columns="equal" stackable={true} verticalAlign="middle">
          <Grid.Column>
            {this.props.glasses ?
              <Images images={this.props.glasses.images || []} /> :
              <Placeholder style={{ height: 400, width: 300, margin: "auto" }}>
                <Placeholder.Image />
              </Placeholder>
            }
          </Grid.Column>
          <Grid.Column>
            {this.props.glasses ?
              <Detail {...this.props.glasses} /> :
              <Placeholder style={{ margin: "auto" }}>
                <Placeholder.Header image={true}>
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            }
          </Grid.Column>
        </Grid>
        <Address />
        <GoTop />
      </div>
    );
  }
}

export interface GlassesSceneProps {
  glasses?: Glasses;
}

export default connect
  (
    (state: {
      glassesScene: GlassesSceneProps,
    }) => ({
      ...state.glassesScene,
    }),
  )
  (GlassesScene);
