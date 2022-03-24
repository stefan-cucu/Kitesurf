/*
 * Custom location popup component
 */
import React from "react";
import {
  Spot,
  getSpots,
  addFavoriteSpot,
  removeFavoriteSpot,
} from "../../store/Spot";
import { useDispatch } from "react-redux";
import { OverlayView } from "@react-google-maps/api";
import starImg from "../../assets/star-on.png";
import "./LocationPopup.css";

// Props type for the location popup component
export interface ILocationPopup {
  display: boolean;
  setDisplay: (display: boolean) => void;
  spot: Spot;
}

const LocationPopup: React.FC<ILocationPopup> = (props) => {
  const dispatch = useDispatch();

  // Get position of the marker
  const getPixelPositionOffset = (width: number, height: number) => {
    return {
      x: -(width / 2),
      y: -(height / 2),
    };
  };

  // Function to add the spot to the user's favorites
  const handleAddFavorite = () => {
    dispatch(addFavoriteSpot(props.spot.id));
  };

  // Function to remove the spot from the user's favorites
  const handleRemoveFavorite = () => {
    dispatch(removeFavoriteSpot(parseInt(props.spot.favoriteId)));
  };

  return (
    <>
      {props.display && (
        <OverlayView
          position={{
            lat: parseFloat(props.spot.lat),
            lng: parseFloat(props.spot.long),
          }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={getPixelPositionOffset}
        >
          <div className="location-popup">
            <div className="location-popup-header">
              <div className="location-popup-title">
                <div className="location-popup-title-left">
                  <h1>{props.spot.name}</h1>
                  {props.spot.isFavorite && <img src={starImg} alt="star" />}
                </div>
                <button
                  className="exit-popup-btn"
                  onClick={() => props.setDisplay(false)}
                >
                  x
                </button>
              </div>
              <p className="location-popup-country">{props.spot.country}</p>
            </div>

            <div className="location-popup-body">
              <div className="location-popup-row">
                <h2>Wind Probability</h2>
                <span>{props.spot.probability}%</span>
              </div>
              <div className="location-popup-row">
                <h2>Latitude</h2>
                <span>{props.spot.lat}° N</span>
              </div>
              <div className="location-popup-row">
                <h2>Longitude</h2>
                <span>{props.spot.long}° W</span>
              </div>
              <div className="location-popup-row">
                <h2>When to go</h2>
                <span>{props.spot.month}</span>
              </div>
            </div>
            <button
              className={`location-popup-button ${
                props.spot.isFavorite ? "favorite" : ""
              }`}
              onClick={
                props.spot.isFavorite ? handleRemoveFavorite : handleAddFavorite
              }
            >
              <p>{props.spot.isFavorite ? "-" : "+"}</p>
              <span>
                {props.spot.isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </span>
            </button>
          </div>
        </OverlayView>
      )}
    </>
  );
};

export default LocationPopup;
