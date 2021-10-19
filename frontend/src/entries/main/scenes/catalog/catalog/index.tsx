import * as React from "react";
import Sidebar from "react-sidebar";
import { Button, Checkbox, Dropdown, Pagination, Placeholder } from "semantic-ui-react";
import slugify from "slugify";
import { LinkV2 } from "src/components/link-v2";
import { Brand, Category, Glasses, Lense, Shape } from "t9entries/main/types/main-types";
import { updateCatalogUrl } from "t9redux/main/actions/catalog";
import { actionType } from "t9redux/main/constants";
import "./style";

const sortingOptions = [
  { content: "Name", icon: "sort alphabet down", text: "Name", value: "d-name" },
  { content: "Name  (Reversed)", icon: "sort alphabet up", text: "Name (Reversed)", value: "a-name" },
  { content: "Brand", icon: "sort alphabet down", text: "Brand", value: "d-brand" },
  { content: "Brand  (Reversed)", icon: "sort alphabet up", text: "Brand (Reversed)", value: "a-brand" },
  { content: "Code", icon: "sort alphabet down", text: "Code", value: "d-code" },
  { content: "Code  (Reversed)", icon: "sort alphabet up", text: "Code (Reversed)", value: "a-code" },
];

const FilterComponent: React.SFC<CatalogProps> = ({ categories, lenses, shapes, brands, onClick }) => {
  return (
    <div className="filters">
      <div>
        {[
          { key: "categories", title: "{|Category|}", options: categories },
          { key: "shapes", title: "{|Shape|}", options: shapes },
          { key: "lenses", title: "{|Lense|}", options: lenses },
          { key: "brands", title: "{|Brand|}", options: brands },
        ].map((filter, filterIndex) => (
          <React.Fragment key={`F-${filterIndex}`}>
            <a className="title">{filter.title}</a>
            <div className="content">
              {filter.options ?
                filter.options.map((option, optionIndex) => (
                  <Checkbox
                    key={`F-${filterIndex}-O-${optionIndex}`}
                    label={{ children: option.name }}
                    onChange={(e, { checked }) => onClick(filter.key, option.name, checked)}
                    checked={option.checked}
                  />
                )) :
                <Placeholder>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder>
              }
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export class Catalog extends React.Component<CatalogProps, CatalogState> {

  constructor(props: CatalogProps) {
    super(props);
    this.state = {
      sidebarOpen: false,
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  public onSetSidebarOpen(open: boolean) {
    this.setState({ sidebarOpen: open });
  }

  public render() {
    return (
      <table className="catalog" >
        <tbody>
          {/* Header */}
          <tr>
            {/* Search */}
            <td className="search" />
            {/* Sort by */}
            <td colSpan={2} className="sort-by">
              <div>
                <Button
                  className="filter"
                  content="Filter"
                  icon="filter"
                  basic={true}
                  onClick={() => this.setState({ sidebarOpen: true })}
                />
                <span>
                  Sort by{" "}
                  <Dropdown
                    pointing="top right"
                    inline={true}
                    options={sortingOptions}
                    onChange={(e, { value }) => {
                      window.globals.dispatch({
                        payload: { sort: value },
                        type: actionType.UPDATE_SCENE_CATALOG,
                      });
                      window.globals.dispatch(updateCatalogUrl());
                    }}
                    value={this.props.sort}
                  />
                </span>
              </div>
            </td>
          </tr>
          {/* Body */}
          <tr>
            {/* Filters */}
            <td className="inline-filter">
              <FilterComponent {...this.props} />
            </td>
            <td className="sidebar-filter">
              <Sidebar
                open={this.state.sidebarOpen}
                onSetOpen={this.onSetSidebarOpen}
                sidebar={<FilterComponent {...this.props} />}
                styles={{
                  overlay: { position: "fixed", height: "100vh" },
                  root: { position: "fixed", height: "100vh", zIndex: "100", maxWidth: "10px", overflow: "visible" },
                  sidebar: { background: "white" },
                }}
                touch={true}
              />
            </td>
            {/* Results */}
            <td colSpan={2} className="results" key={this.props.searchId}>
              <div>
                {this.props.glassesList ? (
                  this.props.glassesList.length ?
                    this.props.glassesList.map((glasses, glassesIndex) => (
                      <LinkV2
                        to={`/Glasses/${slugify((glasses.brand || {}).name)}/${slugify(glasses.name)}~${glasses.id}`}
                        key={"glasses-" + glassesIndex}
                        style={{
                          animationDelay: (60 * glassesIndex) + "ms",
                          backgroundImage: `url(${(glasses.thumbnail || {}).url})`,
                        }}
                      >
                        {/* <a>{glasses.price ? glasses.price.toFixed(2) + " DA" : ""}</a> */}
                      </LinkV2>
                    )) :
                    <div>No glasses found</div>
                ) :
                  <Placeholder>
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
              </div>
            </td>
          </tr>
          {/* Pagination */}
          <tr>
            <td colSpan={3}>
              <div className="pagination">
                <Pagination
                  activePage={this.props.page}
                  totalPages={10}
                  boundaryRange={0}
                  ellipsisItem={null}
                  onPageChange={(e, { activePage }) => {
                    window.globals.dispatch({
                      payload: { page: activePage },
                      type: actionType.UPDATE_SCENE_CATALOG,
                    });
                    window.globals.dispatch(updateCatalogUrl());
                  }}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

interface CatalogProps {
  categories?: Category[];
  lenses?: Lense[];
  shapes?: Shape[];
  brands?: Brand[];
  onClick: (key: string, name: string, checked?: boolean) => void;
  sort: string;
  page: number;
  glassesList?: Glasses[];
  searchId: string;
}

interface CatalogState {
  sidebarOpen: boolean;
}
