import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../styles/theme";
import ProjectComponent from "../components/ProjectsComponent";
import UserComponent from "../components/UserComponent";
import BoardComponent from "../components/BoardComponent";
import TaskComponent from "../components/TaskComponent";
import UserStoryComponent from "../components/UserStoryComponent";
import { Card, CardContent } from "@material-ui/core";

function HomePage() {
  return (
    <MuiThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <ProjectComponent />
        <UserComponent />
        <BoardComponent />
        <UserStoryComponent />
        <TaskComponent />
      </div>
    </MuiThemeProvider>
  );
}

export default HomePage;
