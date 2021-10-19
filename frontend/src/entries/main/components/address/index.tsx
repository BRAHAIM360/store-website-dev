import HEREMap, { Marker } from "here-maps-react";
import * as React from "react";
import { Grid, Icon } from "semantic-ui-react";
import "./style";

const officeLocation = { lat: 34.852588, lng: 5.723764 };

export const Address: React.SFC<{}> = () => {
  return (
    <Grid className="address" stackable={true} columns="2">
      <Grid.Column className="text" textAlign="center" verticalAlign="middle">
        <div />
        <div>
          <h1>Vision Store Biskra</h1>
          <h5>ZGEG BEN RAMDANE - Biskra</h5>
          <h5>Mobile : <a href="tel:+213541554175">+213 541 554 175</a></h5>
          <h5>{"{|Working hours|}"}</h5>
          <div>
            <a href="https://www.facebook.com/visionstorebiskra"><Icon size="large" name="facebook f" /></a>
            <a href="https://www.instagram.com/vision_store_biskra"><Icon size="large" name="instagram" /></a>
          </div>
        </div>
      </Grid.Column>
      <Grid.Column className="detail" verticalAlign="middle" textAlign="left">
        <HEREMap
          appId="6VI8by09t2jPKdvgtdrB"
          appCode="NKN-NAYRH6mNiojSZzjb2g"
          interactive={false}
          center={officeLocation}
          zoom={18}
          secure={true}
        >
          <Marker {...officeLocation} />
        </HEREMap>
      </Grid.Column>
    </Grid>
  );
};
