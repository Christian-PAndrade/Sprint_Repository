import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
  Typography
} from "@material-ui/core";
import theme from "../styles/theme";
import "../App.css";
import AddCircle from "@material-ui/icons/AddCircle";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles({
  container: {
    minWidth: 100,
    maxWidth: 300,
    minHeight: 1000,
    maxHeight: 1000,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  textBox: {
    display: "grid",
    justifyContent: "center"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 160
  }
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

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchProjects = async () => {
    try {
       let response = await fetch("http://localhost:5000/graphql", {
         origin: "*",
         method: "POST",
         headers: { "Content-Type": "application/json; charset=utf-8" },
         body: JSON.stringify({ query: `query{ users{username}}` })
       });
      let json = await response.json();
      setState({
        users: json.data.users,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
        `mutation{ adduser(username: "${state.name}", isAdmin: "${state.isAdmin}"){username,isAdmin}}`
      );
      let json = await response.json();
      setState({
        name: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameInput = e => {
    setState({ name: e.target.value });
  };

  const handleAdminStringInput = e => {
    setState({isAdminString: e.target.value});
    handleAdminInput(e);
  };

  const handleAdminInput = e => {
    if (e === "True") {
      setState({ isAdmin: true });
    }
    setState({ isAdmin: false });
  }

  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.isAdminString === undefined ||
    state.isAdminString === "";

  return (
    <MuiThemeProvider theme={theme} className={classes.container}>
      {" "}
      <Card style={{ marginTop: "5%" }} className={classes.textBox}>
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
          <br />
          <Typography>Find a project in the system: </Typography>
          <Autocomplete
            id="users"
            options={state.users.map(users => users)}
            getOptionLabel={users => users.username}
            style={{ width: 300 }}
            renderInput={params => (
              <TextField
                {...params}
                label="users in the system"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <br /> <br />{" "}
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
