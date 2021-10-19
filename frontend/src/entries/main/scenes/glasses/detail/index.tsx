import * as React from "react";
import { Icon, Label } from "semantic-ui-react";
import slugify from "slugify";
import { LinkV2 } from "src/components/link-v2";
import { Glasses } from "t9entries/main/types/main-types";
import "./style";

export const Detail: React.SFC<Glasses> = ({ brand, code, shapes = [], lenses = [], categories = [], name }) => {
  return (
    <div className="glasses-detail">
      <h1 className="name">{name}</h1>
      <small className="code">{code}</small>
      <div className="call-to-action">
        <a href="tel:+213559790024">
          {"{|Call Now|}"}
          <Icon name="phone" />
        </a>
      </div>
      <div className="props">
        <div className="brand">
          <strong>{"{|Brand|}"}:</strong> {brand.name}.
        </div>
        <div className="shapes">
          <strong>{"{|Shapes|}"}:</strong>
          <Label.Group as="a" color="blue">
            {shapes.map((shape, i) => (
              <Label
                key={`shape-${i}`}
                as={LinkV2}
                to={"/Glasses?shapes=" + slugify(shape.name)}
              >
                {shape.name.toUpperCase()}
              </Label>
            ))}
          </Label.Group>
        </div>
        <div className="lenses">
          <strong>{"{|Lenses|}"}:</strong>
          <Label.Group as="a" color="purple">
            {lenses.map((lense, i) => (
              <Label
                key={`lense-${i}`}
                as={LinkV2}
                to={"/Glasses?lenses=" + slugify(lense.name)}
              >
                {lense.name.toUpperCase()}
              </Label>
            ))}
          </Label.Group>
        </div>
        <div className="categories">
          <strong>{"{|For|}"} :</strong>
          <Label.Group as="a" color="violet">
            {categories.map((category, i) => (
              <Label
                key={`category-${i}`}
                as={LinkV2}
                to={"/Glasses?categories=" + slugify(category.name)}
              >
                {category.name.toUpperCase()}
              </Label>
            ))}
          </Label.Group>
        </div>
      </div>
    </div>
  );
};
