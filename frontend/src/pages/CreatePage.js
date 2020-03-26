import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../styles/theme";
import ProjectComponent from "../components/ProjectsComponent";
import UserComponent from "../components/UserComponent";
import BoardComponent from "../components/BoardComponent";

function HomePage() {
  return (
    <MuiThemeProvider theme={theme}>
      <div style={{display: "flex", justifyContent: "space-around"}}>
        <ProjectComponent />
        <UserComponent />
        <BoardComponent/>
      </div>
    </MuiThemeProvider>
  );
}

export default HomePage;
