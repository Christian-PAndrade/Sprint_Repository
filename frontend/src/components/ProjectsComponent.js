import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper
} from "@material-ui/core";
import theme from "../styles/theme";
import "../App.css";
import AddCircle from "@material-ui/icons/AddCircle";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles({
  container: {
    minWidth: 100,
    maxWidth: 300,
    minHeight: 500,
    maxHeight: 500,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  textBox: {
    display: "grid",
    justifyContent: "center"
  },
});

const ProjectComponent = () => {
  const classes = useStyles();
  const initialState = {
    name: "",
    projects: [],
    usersByProject: [],
    hasUserProjs: false
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
        body: JSON.stringify({ query: `query{projects{_id,name}}` })
      });
      let json = await response.json();
      setState({
        projects: json.data.projects
      });
      console.log(json.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  const onAddClicked = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          query: `mutation{ addproject(name: "${state.name}"){name}}`
        })
      });
      let json = await response.json();
      setState({
        name: ""
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameInput = e => {
    setState({ name: e.target.value });
  };

  const getProjectUsers = async (e, v) => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{usersbyproject(id:\"${v._id}\"){_id,username,isAdmin,projectId}}`
        })
      });
      let json = await response.json();
      setState({
        usersByProject: json.data.usersbyproject,
        hasUserProjs: true
      });
      console.log(json.data.usersbyproject);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = (event, value) => {};

  const emptyorundefined = state.name === undefined || state.name === "";

  return (
    <MuiThemeProvider theme={theme} className={classes.container}>
      {" "}
      <Card style={{ marginTop: "5%" }} className={classes.textBox}>
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
          <br /> <br />
          <Typography>Find a project in the system: </Typography>
          <br />
          <Autocomplete
            id="projects"
            options={state.projects.map(projects => projects)}
            onChange={(event, value) => {
              getProjectUsers(event, value);
            }}
            getOptionLabel={projects => projects.name}
            style={{ width: 300 }}
            renderInput={params => (
              <TextField
                {...params}
                label="current projects"
                variant="outlined"
                fullWidth
              />
            )}
          />
          {state.hasUserProjs && (
            <>
              <TableContainer style={{ marginTop: "3%" }} component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Username</TableCell>
                      <TableCell align="center">Option</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {state.usersByProject.map(elem => (
                      <TableRow key={++state.keyCount}>
                        <TableCell>{elem.username}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            style={{ backgroundColor: "#D50202" }}
                            onClick={(event, value) => {
                              deleteUser();
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                style={{
                  alignItems: "right",
                  justifyContent: "right",
                  backgroundColor: "#0005EA",
                  color: "#ffffff",
                  marginTop: "2%"
                }}
              >
                Add User
              </Button>
            </>
          )}
          <br />{" "}
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

export default ProjectComponent;
