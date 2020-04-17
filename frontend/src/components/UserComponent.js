import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import theme from "../styles/theme";
import "../App.css";
import AddCircle from "@material-ui/icons/AddCircle";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  textBox: {
    display: "grid",
    justifyContent: "center",
    width: 700,
    minHeight: 550,
  },
});

const UserComponent = () => {
  const classes = useStyles();
  const initialState = {
    name: "",
    isAdminChecked: false,
    users: [],
    projects: [],
    selectedProject: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch all projects to assign the user to
  const fetchProjects = async () => {
    try {
      const projResp = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{ projects { _id, name } }`,
        }),
      });

      const projJson = await projResp.json();
      const projects = projJson.data.projects;
      setState({ projects, selectedProject: projects[0]._id || "" });
    } catch (error) {
      console.log(error);
    }
  };

  const onAddClicked = async () => {
    try {
      const addUserResp = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation{ adduser(username: "${state.name}", isAdmin: ${state.isAdminChecked}){ _id, username, isAdmin } }`,
        }),
      });

      const addUserJson = await addUserResp.json();

      // then add to the lookup table
      await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation{ addusertoproject(
            userId: "${addUserJson.data.adduser._id}", 
            projectId: "${state.selectedProject}" ) {
              _id
              lookupUserId
              lookupProjectId
            }
          }`,
        }),
      });

      setState({
        name: "",
        isAdminChecked: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };

  const handleAdminCheck = (e) => {
    setState({ isAdminChecked: e.target.checked });
  };

  // click to project
  const handleProjSelect = (e) => {
    setState({ selectedProject: e.target.value });
  };

  const emptyorundefined = state.name === undefined || state.name === "";

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.container}>
        <Card className={classes.textBox}>
          <CardHeader
            title="Add A User"
            color="inherit"
            style={{ textAlign: "center" }}
          />
          <CardContent style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              onChange={handleNameInput}
              helperText="Enter user's name here"
              value={state.name}
            />
            <FormControlLabel
              label="Is the user an admin?"
              control={
                <Checkbox
                  checked={state.isAdminChecked}
                  onChange={handleAdminCheck}
                  color="primary"
                />
              }
            />
            <br />
            <Select
              fullWidth
              value={state.selectedProject}
              onChange={(e) => handleProjSelect(e)}
            >
              {state.projects.map((us) => (
                <MenuItem key={us._id} value={us._id}>
                  {us.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Assign to a Project</FormHelperText>
            <br />
            <br /> <br />
            <br /> <br />
            <IconButton
              color="secondary"
              style={{ marginTop: 50, float: "right" }}
              onClick={onAddClicked}
              disabled={emptyorundefined}
            >
              <AddCircle fontSize="large" />
            </IconButton>
          </CardContent>
        </Card>
      </div>
    </MuiThemeProvider>
  );
};

export default UserComponent;
