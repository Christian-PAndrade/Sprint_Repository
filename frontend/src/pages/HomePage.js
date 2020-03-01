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
            INFO3139 - MaterialUI
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
            <MenuItem component={Link} to="/users" onClick={handleClose}>
              Users
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/users" render={() => <div>UsersComponent</div>} />
        <Route path="/home" component={() => <div>HomeComponent</div>} />
      </div>
    </MuiThemeProvider>
  );
}

export default HomePage;