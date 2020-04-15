import React, { useReducer } from "react";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  Button
} from "@material-ui/core";
import { Route, Link, Redirect } from "react-router-dom";
import theme from "../styles/theme";
import "../App.css";
import planning from "../pages/img/planning.png";
import CreatePage from "../pages/CreatePage";

const HomeComponent = () => {
    return (
      <MuiThemeProvider theme={theme}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            backgroundColor: "rgba(45, 48, 71, 1)",
            position: "fixed",
            height: "95%",
            padding: 0,
            margin: 0,
          }}
        >
          <div style={{ flex: 50 }}>
            <br />
            <img style={{ height: "70%" }} src={planning} />
          </div>
          <div
            style={{
              fontFamily: "Arial, Roboto",
              color: "rgba(255,255,255, 0.8)",
              marginTop: "2%",
              flex: 50,
            }}
          >
            <div style={{ fontSize: 60 }}>Sprint Repository</div>
            <h2 style={{ width: "60%" }}>
              With the help of Sprint Repository, success has never been so easy
              to achieve. Our comprehensive app breaks down your projects in to
              four simple steps:
            </h2>
            <h2>1. Plan</h2>
            <h2>2. Develop</h2>
            <h2>3. Report</h2>
            <h2>4. Succeed</h2>
            <h2>Start your journey to success now!</h2>
          </div>
          <div style={{ position: "absolute", right: "5%", bottom: "20%" }}>
            <Button
              style={{
                backgroundColor: "rgba(247, 202, 24, 1)",
                color: "rgb(255,255,255)",
                fontWeight: "bold",
                fontSize: 20,
              }}
              component={Link}
              to="/create"
            >
              Begin today!
            </Button>
          </div>
        </div>
        <div>
          <Route path="/create" render={() => <CreatePage />} />
        </div>
      </MuiThemeProvider>
    );

};

export default HomeComponent;