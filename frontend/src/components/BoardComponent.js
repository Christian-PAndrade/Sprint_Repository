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
    minHeight: 500,
    maxHeight: 500,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  textBox: {
    display: "grid",
    justifyContent: "center"
  }
});

const BoardComponent = () => {
  const classes = useStyles();
  const initialState = {
    name: "",
    hasUserProjs: false,
    projects: []
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

  const emptyorundefined = state.name === undefined || state.name === "";

  return (
    <MuiThemeProvider theme={theme} className={classes.container}>
      <Card style={{ marginTop: "5%" }} className={classes.textBox}>
        <CardHeader
          title="Add A Board"
          color="inherit"
          style={{ textAlign: "center" }}
        />
        <CardContent>
          <TextField
            onChange={handleNameInput}
            helperText="Enter a board name here"
            value={state.name}
          />
          <br /> <br />
          <Typography>Find a project in the system: </Typography>
          <br />
          <Autocomplete
            id="projects"
            options={state.projects.map(projects => projects)}
           /* onChange={(event, value) => {
              getProjectUsers(event, value);
            }}*/
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
          <br />{" "}
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
    </MuiThemeProvider>
  );
};

export default BoardComponent;
