import React, { useState } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import Reorder from "@material-ui/icons/Reorder";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography
} from "@material-ui/core";
import theme from "../styles/theme";
import ProjectComponent from "../pages/ProjectsComponent";
import UserComponent from "./UserComponent";
import UserProjectsComponent from "./UserProjectsComponent";

function HomePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            MemoryLeak
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <Reorder />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/home" onClick={handleClose}>
              Home
            </MenuItem>
            <MenuItem component={Link} to="/projects" onClick={handleClose}>
              Add a Project
            </MenuItem>
            <MenuItem component={Link} to="/users" onClick={handleClose}>
              Add a User
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/users" render={() => <UserComponent />} />
        <Route path="/projects" render={() => <ProjectComponent />} />
        <Route path="/home" component={() => <div>HomeComponent</div>} />
      </div>
    </MuiThemeProvider>
  );
}

export default HomePage;
