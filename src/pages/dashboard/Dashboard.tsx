/*
 * Custom component for the dashboard page
 */
import React from "react";
import { User, logIn, selectUser, logOut } from "../../store/User";
import { getSpots } from "../../store/Spot";
import { useDispatch, useSelector } from "react-redux";
import Map from "../../components/map/Map";
import AddSpotModal from "../../components/addSpotModal/AddSpotModal";
import Profile from "../../components/profile/Profile";
import Table from "../../components/table/Table";
import SearchImg from "../../assets/search.svg";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const spots = useSelector(getSpots);

  const [showAddSpotModal, setShowAddSpotModal] = React.useState(false);
  const [locationFilter, setLocationFilter] = React.useState("");

  React.useEffect(() => {
    // If the user is not logged in, redirect to login
    if (currentUser.status !== "logged-in") {
      window.location.href = "/";
    }
  }, [currentUser]);

  return (
    <div className="page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="logo">Kite</h1>
          <div className="dashboard-header-right">
            <button
              className="button"
              onClick={() => {
                setShowAddSpotModal(true);
              }}
            >
              Add spot
            </button>
            <Profile />
          </div>
        </div>
        <div className="map-container">
          <Map />
        </div>
        <h2>Locations</h2>
        <div className="search-bar">
          <img src={SearchImg} alt="search" />
          <input
            type="text"
            placeholder="Search..."
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
            }}
          />
        </div>
        <Table filter={locationFilter} />
        {showAddSpotModal && <AddSpotModal setVisible={setShowAddSpotModal} />}
      </div>
    </div>
  );
};

export default Dashboard;
