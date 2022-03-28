/*
 * Custom component for the dashboard page
 */
import React from "react";
import { User, logIn, selectUser, logOut } from "../../store/User";
import { useDispatch, useSelector } from "react-redux";
import Map from "../../components/map/Map";
import AddSpotModal from "../../components/addSpotModal/AddSpotModal";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  const [showAddSpotModal, setShowAddSpotModal] = React.useState(false);

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
            <button className="button" onClick={() => {setShowAddSpotModal(true)}}>
              Add spot
            </button>
            <button className="button" onClick={() => dispatch(logOut())}>
              Logout
            </button>
          </div>
        </div>
        <div className="map-container">
          <Map />
        </div>
        {showAddSpotModal && <AddSpotModal setVisible={setShowAddSpotModal} />}
      </div>
    </div>
  );
};

export default Dashboard;
