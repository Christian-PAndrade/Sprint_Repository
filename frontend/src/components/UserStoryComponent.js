import React, { useReducer, useEffect, Fragment } from "react";
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

const UserStoryComponent = () => {
  const classes = useStyles();
  const initialState = {
    name: "",
    userID: "",
    users: [],
    boards: [],
    projectIds: [],
    projects: [],
    boardID: "",
    clear: false,
    estimate: 0,
    userHasProjects: false,
    storyPoints: 0,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllUsers = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{users{_id, username, isAdmin}}`,
        }),
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
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const dateString = moment().format("YYYY-MM-DD HH:mm:ss");

    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation { adduserstory(
            name: "${
              state.name
            }", creationDate: "${dateString}", completionDate: "", 
            status: "Open", estimate: ${
              state.estimate
            }, hoursWorked: 0, reestimate: "", 
            storyPoints: ${state.storyPoints}, userStory_boardId: "${
            state.boardID ? state.boardID : null
          }", 
            userStory_userId: "${state.userID ? state.userID : null}")
            {name, creationDate, completionDate, status, estimate, hoursWorked, reestimate, storyPoints, userStory_boardId, userStory_userId}}`,
        }),
      });
      let json = await response.json();
      console.log(json);
      setState({
        name: "",
        boardID: "",
        estimate: 0,
        storyPoints: 0,
        userHasProjects: false,
        clear: !state.clear,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserProjects = async (e, v) => {
    setState({ userID: v._id });
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{projectsbyuser(userId: "${v._id}"){_id, lookupUserId, lookupProjectId}}`,
        }),
      });
      let json = await response.json();

      let projArray = [];
      let flag = false;
      for (let i = 0; i < json.data.projectsbyuser.length; i++) {
        let element = json.data.projectsbyuser[i];
        await getProjectNames(element).then((value) => {
          projArray.push(value);
          flag = true;
        });
      }

      // Fetch all boards
      let responseBoards = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{boards{_id, name,}}`,
        }),
      });
      let jsonBoards = await responseBoards.json();
      setState({
        projects: projArray,
        userHasProjects: flag,
        boards: jsonBoards.data.boards,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getProjectNames = async (project) => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{projectbyid(id: "${project.lookupProjectId}"){_id, name}}`,
        }),
      });
      let json = await response.json();
      return json.data.projectbyid;
    } catch (error) {
      console.log(error);
    }
  };

  const getBoardID = async (e, v) => {
    try {
      setState({ boardID: v._id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };

  const handleEstimateInput = (e) => {
    setState({ estimate: e.target.value });
  };

  const handleSPInput = (e) => {
    setState({ storyPoints: e.target.value });
  };

  const emptyorundefined = state.name === undefined || state.name === "";

  return (
    <MuiThemeProvider theme={theme} className={classes.container}>
      <Card className={classes.textBox}>
        <CardHeader
          title="Add A User Story"
          color="inherit"
          style={{ textAlign: "center" }}
        />
        <CardContent>
          <TextField
            onChange={handleNameInput}
            helperText="Enter a user story name here"
            value={state.name}
          />
          <br />
          <TextField
            type="number"
            inputProps={{ min: "0" }}
            onChange={handleEstimateInput}
            helperText="Enter estimated hours"
            value={state.estimate}
          />
          <br />
          <TextField
            type="number"
            inputProps={{ min: "0" }}
            onChange={handleSPInput}
            helperText="Enter story points"
            value={state.storyPoints}
          />
          <br /> <br />
          <Typography>Assign a user: </Typography>
          <br />
          <Autocomplete
            key={state.clear}
            id="users"
            options={state.users.map((user) => user)}
            onChange={(event, value) => {
              getUserProjects(event, value);
            }}
            getOptionLabel={(user) => user.username}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="current users"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <br />
          {state.userHasProjects && (
            <Fragment>
              <Typography>Assign to a Board: </Typography>
              <br />
              <Autocomplete
                key={state.clear}
                id="boards"
                options={state.boards.map((boards) => boards)}
                onChange={(event, value) => {
                  getBoardID(event, value);
                }}
                getOptionLabel={(boards) => boards.name}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="current boards"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <br />
            </Fragment>
          )}
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

export default UserStoryComponent;
