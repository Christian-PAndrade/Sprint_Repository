import React, { useReducer } from "react";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
} from "@material-ui/core";
import theme from "../styles/theme";
import "../App.css";
import logo2 from "../pages/img/logo2.png";

const HomeComponent = () => {
    return (
      <MuiThemeProvider theme={theme}>
        <div style={{ textAlign: "center" }}>
          <div style={{ textAlign: "center", fontSize: 60 }}>
            Sprint Repository   
          </div>
          <br />
          <img src={logo2} />
        </div>
      </MuiThemeProvider>
    );

};

export default HomeComponent;