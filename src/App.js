import { Redirect, Switch, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login.js";
import { Signup } from "./components/Signup.js";
import { ForgotPassword } from "./components/Forgotpassword.js";
import { ResetPassword } from "./components/Resetpassword.js";
import { Dashboard } from "./components/Dashboard.js";
import { Userdata } from "./components/Userdata.js";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { Update } from "./components/Update.js";
import { Navbar } from "./Navbar.js";
import { API_URL } from "./globalconstant.js";

export default function App() {
  const [mode, setMode] = useState("light");
  const [Name, setName] = useState(null);
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/activation/:id">
          <Activation />
        </Route>
        <Route exact path="/forgotpassword">
          <ForgotPassword />
        </Route>
        <Route exact path="/forgotpassword/verify/:id">
          <Changepass />
        </Route>
        <Route exact path="/resetpassword/:id">
          <ResetPassword />
        </Route>
        <>
          <ThemeProvider theme={theme}>
            <Paper
              elevation={0}
              style={{ borderStyle: "none", minHeight: "100vh" }}
            >
              {/* works on condition */}
              <Navbar mode={mode} setMode={setMode} Name={Name} />
              <Route exact path="/Dashboard">
                <Dashboard setName={setName} />
              </Route>
              <Route path="/userdata">
                <Userdata />:
              </Route>
              <Route path="/updatedata/:id">
                <Update />
              </Route>
            </Paper>
          </ThemeProvider>
        </>
      </Switch>
    </div>
  );
}

function Activation() {
  const { id } = useParams();
  return fetch(`${API_URL}/users/twostepverification`, {
    method: "GET",
    headers: { "x-auth-token": id },
  })
    .then((response) => {
      const Status = response.status;
      return Status;
    })
    .then((Status) =>
      Status === 200
        ? window.location.replace(`/login`)
        : alert("Please enter the registered email")
    );
}
function Changepass() {
  const { id } = useParams();
  // console.log(id);
  return id ? <Updatepassword id={id} /> : null;
}
// updatpassword
function Updatepassword({ id }) {
  // const { history } = useHistory();
  // console.log(id);
  const Result = (id) => {
    fetch(`${API_URL}/users/forgotpassword/verify`, {
      method: "GET",
      headers: { "x-auth-token": id },
    })
      .then((response) => {
        const Status = response.status;
        return Status;
      })
      .then((Status) =>
        Status === 200
          ? window.location.replace(`/resetpassword/${id}`)
          : alert("Please enter the registered email")
      );
  };

  Result(id);

  // Loading Page
  return (
    <div className="loader-container">
      <div className="box-loader">
        <img
          src="https://c.tenor.com/28DFFVtvNqYAAAAC/loading.gif"
          alt="loading"
          className="Loading"
        />
      </div>
    </div>
  );
}
