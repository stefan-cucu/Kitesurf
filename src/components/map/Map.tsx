/*
 * Custom map component
 */
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { getSpots, loadSpots, Spot } from "../../store/Spot";
import LocationPopup from "../locationPopup/LocationPopup";
import Filter from "../filter/Filter";
import { useWindowSize } from "../../Hooks";

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

const Map: React.FC = (props) => {
  const dispatch = useDispatch();
  const spots = useSelector(getSpots);
  const mapRef = React.useRef();
  const windowSize = useWindowSize();

  const [showPopup, setShowPopup] = React.useState(false);
  const [selectedSpot, setSelectedSpot] = React.useState(0);

  const [filterCountry, setFilterCountry] = React.useState("");
  const [filterProb, setFilterProb] = React.useState(0);

  // Map sizes
  const mapStyle = {
    width: windowSize.width < 1300 ? "100vw" : "1300px",
    height: windowSize.height < 900 ? "300px" : "600px", 
  };

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
        <>
          <GoogleMap
            id="map"
            mapContainerStyle={mapStyle}
            zoom={8}
            center={defaultCenter}
            options={options}
            onLoad={onMapLoad}
          >
            {spots // Filter the spots based on the filter settings
              .filter((spot: Spot) => {
                return spot.country.includes(filterCountry) && spot.probability >= filterProb;
              }) // Render the spots
              .map((spot: Spot, index: number) => (
                <Marker
                  key={spot.id}
                  position={{
                    lat: parseFloat(spot.lat),
                    lng: parseFloat(spot.long),
                  }}
                  icon={{
                    // Set marker color based on favorite status
                    url: spot.isFavorite
                      ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                      : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                  onClick={() => {
                    setShowPopup(true);
                    setSelectedSpot(spots.indexOf(spot));
                  }}
                />
              ))}
            <LocationPopup
              display={showPopup}
              setDisplay={setShowPopup}
              spot={spots[selectedSpot]}
            />
          </GoogleMap>
          <Filter
            country={filterCountry}
            setCountry={setFilterCountry}
            probability={filterProb}
            setProbability={setFilterProb}
          />
        </>
      )}
    </>
  );
};

export default Map;
