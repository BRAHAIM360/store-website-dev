import * as React from "react";
import { Grid, Header } from "semantic-ui-react";
import { LinkV2 } from "src/components/link-v2";
import { mainConfig } from "t9entries/main/config";
import "./style";

const changeLanguage = (languageCode: string) => {
  const baseURL = mainConfig.defaultLanguage.defaultLanguageCode === languageCode ? "" : "/" + languageCode;
  let href = location.href;
  if (mainConfig.defaultLanguage.isDefaultLanguage) {
    href = href.replace(location.origin, location.origin + baseURL);
  } else {
    href = href.replace(location.origin + "/" + mainConfig.defaultLanguage.languageCode, location.origin + baseURL);
  }
  if (href.indexOf("/Glasses?") >= 0) {
    href = href.substring(0, href.indexOf("?"));
  }

  location.href = href;
};

const footerSections = [
  {
    items: [
      { href: "tel:+213541554175", content: "+213 541 554 175" },
      { href: "https://www.instagram.com/vision_store_biskra", content: "{|Instagram account|}" },
      { href: "https://www.facebook.com/visionstorebiskra", content: "{|Facebook page|}" },
      {
        content: <>{"{|Developed by|}"} <strong style={{ color: "#5c9220" }}>ScriptDZ</strong></>,
        href: "https://www.scriptdz.com/?utm_source=visionstorebiskra&utm_medium=website",
      },
    ],
    title: "{|Contact Us|}",
  },
  {
    items: [
      {
        content: "{|language english|}",
        onClick: (e: any) => { e.preventDefault(); changeLanguage("en"); },
      },
      {
        content: "{|language french|}",
        onClick: (e: any) => { e.preventDefault(); changeLanguage("fr"); },
      },
    ],
    title: "Languages",
  },
];

export const Footer: React.SFC<{}> = () => {
  return (
    <div className="footer" onClick={(e) => { }}>
      <Grid stackable={true} centered={true}>
        <Grid.Row>
          <Grid.Column>
            <Header size="medium">{"{|Our Goal|}"}</Header>
            <div className="divider" />
            <p>
              {"{|Paragraph|}"}
            </p>
          </Grid.Column>
          {footerSections.map((footerSection, i) => (
            <Grid.Column key={`fSection-${i}`}>
              <Header size="medium">{footerSection.title.toUpperCase()}</Header>
              <div className="divider" />
              <ul>
                {/* FIXME: DX issue */}
                {footerSection.items.map((item, j) => (
                  <li key={`fLink-${i}-${j}`}>
                    {item.to
                      ? <LinkV2 to={item.to}>{item.content}</LinkV2>
                      : <a href={item.href} onClick={item.onClick}>{item.content}</a>
                    }
                  </li>
                ))}
              </ul>
            </Grid.Column>
          ))}
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <p>&copy; 2019 Copyright <a>Vision Store Biskra</a></p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};
