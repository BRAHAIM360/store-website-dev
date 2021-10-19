import React from "react";
import { connect } from "react-redux";
import Rellax from "rellax";
import { GoTop } from "t9entries/main/components/go-top";
import { Category, Collection, Slide, Topic } from "t9types/main-types";
import { Address } from "../../components/address";
import { AboutUs } from "./about-us";
import { Categories } from "./categories";
import { Collections } from "./collections";
import { SectionBreak } from "./section-break";
import { Slider } from "./slider";
import "./style";
import { Topics } from "./topics";

class LandingScene extends React.Component<LandingSceneProps, {}> {

  public componentDidMount() {
    document.title = "{|page title|}";
    window.rellax = new Rellax(".rellax", {
      center: false,
      horizontal: false,
      round: true,
      speed: -2,
      vertical: true,
    });
  }

  public render() {
    return (
      <div className="landing">
        <Slider slides={this.props.slides} />
        <Categories categories={this.props.categories || []} />
        <Topics topics={this.props.topics} />
        <Collections collections={this.props.collections} />
        <SectionBreak />
        <AboutUs />
        <Address />
        <GoTop />
      </div>
    );
  }
}

export interface LandingSceneProps {
  slides?: Slide[];
  categories?: Category[];
  topics?: Topic[];
  collections?: Collection[];
}

export default connect
  (
    (state: {
      landingScene: LandingSceneProps,
      categories: Category[];
    }) => ({
      ...state.landingScene,
      categories: state.categories,
    }),
  )
  (LandingScene);
