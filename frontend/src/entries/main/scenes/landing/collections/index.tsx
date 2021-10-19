import * as React from "react";
import { Icon, Placeholder } from "semantic-ui-react";
import slugify from "slugify";
import { LinkV2 } from "src/components/link-v2";
import { Collection } from "t9entries/main/types/main-types";
import "./style";

export class Collections extends React.Component<CollectionsProps, { collectionIndex: number }> {

  constructor(props: CollectionsProps) {
    super(props);
    this.state = { collectionIndex: 0 };
  }

  public render() {
    return (
      <div className="collections">
        {this.props.collections ?
          <>
            <div className="tabs">
              {this.props.collections.map((collection, _collectionIndex) => (
                <a
                  key={"collection-tab-" + _collectionIndex}
                  className={_collectionIndex === this.state.collectionIndex ? "selected" : undefined}
                  onClick={() => {
                    this.setState({ collectionIndex: _collectionIndex });
                  }}
                >
                  {collection.title}
                </a>
              ))}
            </div>
            <div className="collection" key={"collection-" + this.state.collectionIndex}>
              {this.state.collectionIndex < this.props.collections.length ?
                this.props.collections[this.state.collectionIndex].glasses.map((glasses, glassesIndex) => (
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
                null
              }
            </div>
            <LinkV2 to="/Glasses" className="see-more">
              {"{|SEE MORE|}"}
              <Icon name="arrow alternate circle right outline" />
            </LinkV2>
          </> :
          <Placeholder style={{ margin: "auto" }}>
            <Placeholder.Line length="very short" />
            <Placeholder.Line length="full" />
            <Placeholder.Line length="very long" />
            <Placeholder.Line length="long" />
            <Placeholder.Line length="medium" />
            <Placeholder.Line length="short" />
          </Placeholder>
        }
      </div>
    );
  }
}

interface CollectionsProps {
  collections?: Collection[];
}
