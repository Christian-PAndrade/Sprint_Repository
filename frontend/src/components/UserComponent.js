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
import AddCircle from "@material-ui/icons/AddCircle";

const useStyles = makeStyles({
  container: { 
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  textBox: {
    display: "grid",
    justifyContent: "center",
    width: 700,
    minHeight:550
  },
});

const UserComponent = () => {
  const classes = useStyles();
  const initialState = {
    name: "",
    isAdmin: false,
    isAdminString: "",
    users: []
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onAddClicked = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation{ adduser(username: "${state.name}", isAdmin: ${state.isAdmin}){username,isAdmin}}`
        }),
      });
      console.log(
        `mutation{ adduser(username: "${state.name}", isAdmin: ${state.isAdmin}){username,isAdmin}}`
      );
      let json = await response.json();
      setState({
        name: "",
        isAdminString: ""
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameInput = e => {
    setState({ name: e.target.value });
  };

  const handleAdminStringInput = e => {
    console.log(e.target.value);
    setState({isAdminString: e.target.value});
      if (e.target.value === "True" || e.target.value === "true") {
        setState({ isAdmin: true });
      } else {
        setState({ isAdmin: false });
      }
  };

  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.isAdminString === undefined ||
    state.isAdminString === "";

  return (
    <MuiThemeProvider theme={theme} className={classes.container}>
      {" "}
      <Card className={classes.textBox}>
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
            onChange={handleAdminStringInput}
            helperText="Is the user an admin?"
            value={state.isAdminString}
          />{" "}
          <br />
          <br /> <br />
          <br /> <br />
          <IconButton
            color="secondary"
            style={{ marginTop: 50, float: "right" }}
            onClick={onAddClicked}
            disabled={emptyorundefined}
          >
            {" "}
            <AddCircle fontSize="large" />{" "}
          </IconButton>
        </CardContent>{" "}
      </Card>{" "}
    </MuiThemeProvider>
  );
};

export default UserComponent;
