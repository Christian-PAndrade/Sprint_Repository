import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../styles/theme";
import ProjectComponent from "../components/ProjectsComponent";
import UserComponent from "../components/UserComponent";

function HomePage() {
  return (
    <MuiThemeProvider theme={theme}>
      <div style={{display: "flex", justifyContent: "space-around"}}>
        <ProjectComponent />
        <UserComponent />
      </div>
    </MuiThemeProvider>
  );
}

export default HomePage;
