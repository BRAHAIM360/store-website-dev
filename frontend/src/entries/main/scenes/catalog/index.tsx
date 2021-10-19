import * as React from "react";
import { connect } from "react-redux";
import { GoTop } from "t9entries/main/components/go-top";
import { Brand, Category, Glasses, Lense, Shape } from "t9entries/main/types/main-types";
import { updateCatalogUrl } from "t9redux/main/actions/catalog";
import { actionType } from "t9redux/main/constants";
import { Catalog } from "./catalog";
import "./style";

class CatalogScene extends React.Component<CatalogSceneProps> {

  public componentDidMount() {
    document.title = "{|page title|}";
  }

  public render() {
    return (
      <div className="catalog">
        <div className="features">
          <h1>{"{|Title|}"}</h1>
          <h2>{"{|Subtitle|}"}</h2>
          <p>{"{|Paragraph|}"}</p>
        </div>
        <Catalog
          categories={this.props.categories}
          lenses={this.props.lenses}
          shapes={this.props.shapes}
          brands={this.props.brands}
          sort={this.props.sort}
          glassesList={this.props.glassesList}
          page={this.props.page}
          searchId={this.props.searchId}
          onClick={(key, name, checked) => {
            window.globals.dispatch({ type: actionType.UPDATE_SCENE_CATALOG_FILTER, payload: { key, name, checked } });
            window.globals.dispatch(updateCatalogUrl());
          }}
        />
        <GoTop />
      </div>
    );
  }
}

export interface CatalogSceneProps {
  categories?: Category[];
  lenses?: Lense[];
  shapes?: Shape[];
  brands?: Brand[];
  sort: string;
  page: number;
  glassesList?: Glasses[];
  searchId: string;
}

export default connect
  (
    (state: {
      catalogScene: CatalogSceneProps,
      categories: Category[];
    }) => ({
      ...state.catalogScene,
      categories: state.categories,
    }),
  )
  (CatalogScene);
