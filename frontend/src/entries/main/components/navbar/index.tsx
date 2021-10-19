import * as React from "react";
import { connect } from "react-redux";
import { Icon, Placeholder } from "semantic-ui-react";
import { LinkV2 } from "src/components/link-v2";
import { Category } from "t9entries/main/types/main-types";
import "./style";

const navButtons = [
  { icon: "phone", title: "{|Call us|}", subTitle: "+213 541 554 175", href: "Tel:+213541554175" },
];

const NavBarNoRedux: React.SFC<{ categories?: Category[] }> = ({ categories }) => {
  return (
    <table className="navbar">
      <tbody>
        <tr>
          <td className="logo">
            <LinkV2 to="/" />
          </td>
          {navButtons.map((navButton, i) => (
            <React.Fragment key={`navBtn-${i}`}>
              <td className="navButtonIcon">
                <a href={navButton.href}><Icon size="big" name={navButton.icon as any} /></a>
              </td>
              <td className="navButton">
                <a href={navButton.href}>
                  <div>{navButton.title}</div>
                  <div>{navButton.subTitle}</div>
                </a>
              </td>
            </React.Fragment>
          ))}
        </tr>
        {["regular", "sticky"].map((cn) => (
          <tr key={`nbMenu${cn}`} className={`navbarMenu ${cn}`}>
            <td colSpan={8}>
              {categories ?
                categories.map((category, i) => (
                  <LinkV2 key={`menuBtn-${i}`} to={`/Glasses?categories=${category.name}`}>
                    {category.name.toUpperCase()}
                  </LinkV2>
                )) :
                <Placeholder style={{ margin: "auto" }}>
                  <Placeholder.Line length="short" />
                  <Placeholder.Line length="very short" />
                </Placeholder>
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table >
  );
};

export const NavBar = connect
  (
    (state: {
      categories: Category[],
    }) => ({
      ...state,
    }),
  )
  (NavBarNoRedux);
