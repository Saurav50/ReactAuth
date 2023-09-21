import { useRef, useContext } from "react";
import classes from "./ProfileForm.module.css";
import { AuthContext } from "../../store/auth-context";
import { useHistory } from "react-router-dom";
const ProfileForm = () => {
  const history = useHistory();
  const ctx = useContext(AuthContext);
  const pswdRef = useRef();
  const formSubmitHandler = (e) => {
    e.preventDefault();
    const newPswd = pswdRef.current.value;
    console.log(newPswd);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDvhFmALunH113B8QGQ6Q24BvbwfDb7mS4",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: ctx.token,
          password: newPswd,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      console.log("response:", res);
      history.replace("/");
    });
  };
  return (
    <form className={classes.form} onSubmit={formSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" minLength="7" ref={pswdRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
