import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, selectUser, logOut } from "../../store/User";
import { useOutsideAlerter } from "../../Hooks";

import BlankImg from "../../assets/BlankProfile.svg";
import LogoutImg from "../../assets/Logout.svg";
import "./Profile.css";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const ref = React.useRef<HTMLDivElement>(null); // Component reference
  const isInside = useOutsideAlerter(ref); // Check if the user clicked outside the component
  const [showLogout, setShowLogout] = React.useState(false);

  // When the user clicks outside the profile, close the logout menu
  React.useEffect(() => {
    if (!isInside) {
      setShowLogout(false);
    }
  }, [isInside]);

  return (
    <div ref={ref} className="profile">
      <img
        src={BlankImg}
        alt="profile"
        onClick={() => {
          setShowLogout(true);
        }}
      />
      {showLogout && (
        <button
          className="logout-button"
          onClick={() => {
            dispatch(logOut());
          }}
        >
          <img src={LogoutImg} alt="logout" />
          <p>Logout</p>
        </button>
      )}
    </div>
  );
};

export default Profile;
