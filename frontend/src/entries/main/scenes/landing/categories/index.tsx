import * as React from "react";
import { LinkV2 } from "src/components/link-v2";
import { Category } from "t9entries/main/types/main-types";
import "./style";

export const Categories: React.FC<{ categories: Category[] }> = ({ categories }) => {
  return (
    <div className="categories">
      {categories.map((item, i) => (
        <LinkV2 key={"category-" + i} to={`/Glasses?categories=${item.name}`}>{item.name.toLocaleUpperCase()}</LinkV2>
      ))}
    </div>
  );
};
