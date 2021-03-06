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
  Typography,
  Avatar,
} from "@material-ui/core";
import theme from "../styles/theme";

import CreatePage from "./CreatePage";
import ViewPage from "./ViewPage";
import UpdatePage from "./UpdatePage";
import HomeComponent from "../components/HomeComponent";

function HomePage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Avatar src={require("./img/icons8-system-task-64.png")}></Avatar>
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
            <MenuItem component={Link} to="/create" onClick={handleClose}>
              Create
            </MenuItem>
            <MenuItem component={Link} to="/view" onClick={handleClose}>
              View
            </MenuItem>
            <MenuItem component={Link} to="/update" onClick={handleClose}>
              Update
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/create" render={() => <CreatePage />} />
        <Route path="/view" render={() => <ViewPage />} />
        <Route path="/update" render={() => <UpdatePage />} />
        <Route path="/home" component={() => <HomeComponent />} />
      </div>
    </MuiThemeProvider>
  );
}

export default HomePage;
