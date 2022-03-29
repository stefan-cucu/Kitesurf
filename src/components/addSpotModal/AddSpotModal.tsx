/*
 * Custom component for the add spot modal
 */
import React from "react";
import { useDispatch } from "react-redux";
import { addSpot, Spot } from "../../store/Spot";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import * as DateToMonthMap from "./DateToMonthMap.json";
import "./AddSpotModal.css";

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
  width: "90%", // props.width
  height: "30%", // props.height,
};

// Props type for the AddSpotModal component
interface AddSpotModalProps {
  setVisible: (visible: boolean) => void;
}

const AddSpotModal: React.FC<AddSpotModalProps> = (props) => {
  const dispatch = useDispatch();

  // Input fields
  const [location, setLocation] = React.useState({
    lat: 0,
    lng: 0,
  });
  const [name, setName] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [prob, setProb] = React.useState(0);
  const [firstMonth, setFirstMonth] = React.useState("");
  const [lastMonth, setLastMonth] = React.useState("");

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: String(REACT_APP_MAPS_KEY),
  });

  // Get clicked location and set it as the new location
  const handleMapClick = (event: any) => {
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  // Add a new spot to the database
  const handleConfirm = () => {
    props.setVisible(false);
    const newSpot: Spot = {
      id: "",
      createdAt: new Date(),
      name: name,
      country: country,
      lat: String(location.lat),
      long: String(location.lng),
      probability: prob,
      month: firstMonth + "-" + lastMonth,
      isFavorite: false,
      favoriteId: "",
    };
    dispatch(addSpot(newSpot));
    props.setVisible(false);
  };

  // Turn date input into month string
  const getMonthFromInput = (input: any) => {
    const map = JSON.parse(JSON.stringify(DateToMonthMap));
    return map[input.slice(-2)];
  };

  return (
    <div className="add-spot-modal">
      <div className="add-spot-modal-container">
        <h1>Add Spot</h1>
        <div className="add-spot-modal-content">
          <h2>Name</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="add-spot-modal-content">
          <h2>Country</h2>
          <input
            type="text"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          />
        </div>
        <div className="add-spot-modal-content">
          <h2>High Season</h2>
          <div className="month-row">
            <input
              type="month"
              onChange={(e) => {
                setFirstMonth(getMonthFromInput(e.target.value));
              }}
            />
            <input
              type="month"
              onChange={(e) => {
                setLastMonth(getMonthFromInput(e.target.value));
              }}
            />
          </div>
        </div>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={mapStyle}
            zoom={8}
            center={defaultCenter}
            options={options}
            onClick={handleMapClick}
          >
            <Marker position={location} />
          </GoogleMap>
        )}
        <div className="add-spot-modal-buttons">
          <button
            className="cancel modal-button"
            onClick={() => {
              props.setVisible(false);
            }}
          >
            Cancel
          </button>
          <button
            className="confirm modal-button"
            onClick={() => {
              handleConfirm();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSpotModal;
