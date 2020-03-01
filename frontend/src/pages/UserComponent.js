import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Snackbar,
  TextField
} from "@material-ui/core";
import theme from "./theme";
import "../App.css";
import AddCircle from "@material-ui/icons/AddCircle";

const UserComponent = () => {
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    name: "",
    age: 0,
    email: ""
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onAddClicked = async () => {
    let user = { name: state.name, age: state.age, email: state.email };
    let userStr = JSON.stringify(user);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: myHeaders,
        body: userStr
      });
      let json = await response.json();
      setState({
        showMsg: true,
        snackbarMsg: json.msg,
        name: "",
        age: 0,
        email: ""
      });
    } catch (error) {
      setState({ snackbarMsg: error.message, showMsg: true });
    }
  };

  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  const handleNameInput = e => {
    setState({ name: e.target.value });
  };

  const handleAgeInput = e => {
    let age = parseInt(e.target.value);
    age > 0 ? setState({ age: age }) : setState({ age: 0 });
  };

  const handleEmailInput = e => {
    setState({ email: e.target.value });
  };

  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.age === undefined ||
    state.age === 0 ||
    state.email === undefined ||
    state.email === "";

  return (
    <MuiThemeProvider theme={theme}>
      {" "}
      <Card style={{ marginTop: "10%" }}>
        {" "}
        <CardHeader
          title="Add A User"
          color="inherit"
          style={{ textAlign: "center" }}
        />{" "}
        <CardContent>
          {" "}
          <TextField
            onChange={handleNameInput}
            helperText="Enter user's name here"
            value={state.name}
          />{" "}
          <br />{" "}
          <TextField
            onChange={handleAgeInput}
            helperText="Enter user's age here"
            value={state.age}
          />{" "}
          <br />{" "}
          <TextField
            onChange={handleEmailInput}
            value={state.email}
            helperText="Enter user's email here"
          />{" "}
          <br />{" "}
          <IconButton
            color="secondary"
            style={{ marginTop: 50, float: "right" }}
            onClick={onAddClicked}
            disabled={emptyorundefined}
          >
            {" "}
            <AddCircle fontSize="large" />{" "}
          </IconButton>{" "}
          <Snackbar
            open={state.showMsg}
            message={state.snackbarMsg}
            autoHideDuration={4000}
            onClose={snackbarClose}
          />{" "}
        </CardContent>{" "}
      </Card>{" "}
    </MuiThemeProvider>
  );
};

export default UserComponent;
