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
import theme from "../styles/theme";
import "../App.css";
import AddCircle from "@material-ui/icons/AddCircle";

const ProjectComponent = () => {
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    name: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onAddClicked = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {        
          const mutation = `mutation{ addproject(name: ${state.name})}`;
          const url = "http://localhost:5000/graphql";
          const opts = {
            method: "POST",
            myHeaders,
            body: JSON.stringify(`mutation{ addproject (name: ${state.name})}`)
          };
          console.log(opts.body);
          let response = await fetch(url, opts);
          let json = await response.json();
          setState({
            showMsg: true,
            snackbarMsg: json.msg,
            name: ""
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

  const emptyorundefined =
    state.name === undefined ||
    state.name === "";

  return (
    <MuiThemeProvider theme={theme}>
      {" "}
      <Card style={{ marginTop: "10%" }}>
        {" "}
        <CardHeader
          title="Add A Project"
          color="inherit"
          style={{ textAlign: "center" }}
        />{" "}
        <CardContent>
          {" "}
          <TextField
            onChange={handleNameInput}
            helperText="Enter a project name here"
            value={state.name}
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
        </CardContent>{" "}
      </Card>{" "}
      <Snackbar
        open={state.showMsg}
        message={state.snackbarMsg}
        autoHideDuration={4000}
        onClose={snackbarClose}
      />{" "}
    </MuiThemeProvider>
  );
};

export default ProjectComponent;
