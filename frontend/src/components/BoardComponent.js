import React, { useReducer, useEffect } from "react";
import moment from "moment";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import theme from "../styles/theme";
import "../App.css";
import AddCircle from "@material-ui/icons/AddCircle";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

const BoardComponent = () => {
  const classes = useStyles();
  const initialState = {
    name: "",
    projects: [],
    projectID: "",
    clear: false,
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
        body: JSON.stringify({ query: `query{projects{_id,name}}` }),
      });
      let json = await response.json();
      setState({
        projects: json.data.projects,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onAddClicked = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const dateString = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation{ addboard(startDate: "${dateString}", name: "${state.name}", board_projectId: "${state.projectID}"){startDate, name, board_projectId}}`,
        }),
      });

      setState({
        name: "",
        projectID: "",
        clear: !state.clear,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getProjectID = async (e, v) => {
    try {
      setState({ projectID: v._id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };

  const emptyorundefined = state.name === undefined || state.name === "";

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.container}>
        <Card className={classes.textBox}>
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
              key={state.clear}
              id="projects"
              options={state.projects.map((projects) => projects)}
              onChange={(event, value) => {
                getProjectID(event, value);
              }}
              getOptionLabel={(projects) => projects.name}
              style={{ width: 300 }}
              renderInput={(params) => (
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
      </div>
    </MuiThemeProvider>
  );
};

export default BoardComponent;
