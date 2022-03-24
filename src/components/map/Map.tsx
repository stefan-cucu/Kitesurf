/*
 * Custom map component
 */
import React from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import {
  getSpots,
  loadSpots,
  Spot,
} from "../../store/Spot";

const { REACT_APP_MAPS_KEY } = process.env;

// Default map center
const defaultCenter = {
  lat: 43.6532,
  lng: -79.3832,
};

// Map options
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

// Map styles
const mapStyle = {
  width: "600px",  // props.width
  height: "300px", // props.height,
};

const Map: React.FC = (props) => {
  const dispatch = useDispatch();
  const spots = useSelector(getSpots);
  const mapRef = React.useRef();

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: String(REACT_APP_MAPS_KEY),
  });

  // After the map has loaded, load the spots and center the map
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
    dispatch(loadSpots());
    // Try to center the map on the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        map.panTo({ lat: latitude, lng: longitude });
      });
    } // Default to the default center
    else {
      map.panTo(defaultCenter);
    }
  }, []);

  return (
    <>
      {isLoaded && (
        <GoogleMap
          id="map"
          mapContainerStyle={mapStyle}
          zoom={8}
          center={defaultCenter}
          options={options}
          onLoad={onMapLoad}
        >
          {
            // Add the markers
            spots.map((spot: Spot) => (
              <Marker
                key={spot.id}
                position={{
                  lat: parseFloat(spot.lat),
                  lng: parseFloat(spot.long),
                }}
              />
            ))
          }
        </GoogleMap>
      )}
    </>
  );
};

export default Map;
