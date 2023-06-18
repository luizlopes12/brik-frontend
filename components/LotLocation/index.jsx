import React, { useEffect } from "react";
import style from "./style.module.scss";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  maxWidth: "1180px",
  margin: "0 auto",
  height: "400px",
};

const defaultMapOptions = {
  fullscreenControl: false,
};

function LotLocation({ address }) {
  const { isLoaded } = useJsApiLoader({
    id: "944023347599-ehigehbmf1pv12d9f0e93f45dicuaj2o.apps.googleusercontent.com",
    googleMapsApiKey: "AIzaSyAYsTak0MpHSgfdhSPpMSaV0QYNFw--5Fw",
  });

  const [map, setMap] = React.useState(null);
  const [center, setCenter] = React.useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (address) {
      const url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            setCenter({
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
            });
          } else {
            // console.log("Could not find the location");
          }
        })
        .catch((error) => {
          // console.log("Error fetching location:", error);
        });
    }
  }, [address]);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div className={style.mapContainer}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        defaultOptions={defaultMapOptions}
      ></GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(LotLocation);
