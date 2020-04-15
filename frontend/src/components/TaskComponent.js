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
    minHeight: 550
  },
});

const TaskComponent = () => {
  const classes = useStyles();
  const initialState = {
    name: "",
    stories: [],
    clear: false,
    estimate: 0,
    storySelected: false,
    selectedUser: "",
    story: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchUserStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchUserStories = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `query{ userstories{ _id,name,userStory_boardId,userStory_userId } }`,
        }),
      });
      let json = await response.json();
      setState({
        stories: json.data.userstories,
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
          query: `mutation{ addtask(name: "${state.name}", creationDate: "${dateString}", completionDate: "", status: "Open", estimate: ${state.estimate}, sprint: "${state.story.userStory_boardId}", userstory: "${state.story._id}", userassigned: "${state.selectedUser._id}"){_id,name,creationDate,completionDate,status,estimate,task_sprint,task_userStoryId,task_assignedToId}}`,
        }),
      });
      let json = await response.json();
      console.log(json);
      setState({
        name: "",
        storySelected: false,
        selectedUser: "",
        estimate: 0,
        clear: !state.clear,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserId = async (e, v) => {
    setState({ story: v });
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `{ userbyid(id: "${v.userStory_userId}"){_id, username, isAdmin}}`,
        }),
      });
      let json = await response.json();
      console.log(json);

      setState({ selectedUser: json.data.userbyid, storySelected: true });
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

  const emptyorundefined = state.name === undefined || state.name === "";

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.container}>
        <Card className={classes.textBox}>
          <CardHeader
            title="Add A Task"
            color="inherit"
            style={{ textAlign: "center" }}
          />
          <CardContent>
            <TextField
              onChange={handleNameInput}
              helperText="Enter a task name here"
              value={state.name}
            />
            <br />
            <TextField
              onChange={handleEstimateInput}
              helperText="Enter estimated hours"
              value={state.estimate}
            />
            <br /> <br />
            <Typography>Find a user story in the system: </Typography>
            <br />
            <Autocomplete
              key={state.clear}
              id="stories"
              options={state.stories.map((story) => story)}
              onChange={(event, value) => {
                getUserId(event, value);
              }}
              getOptionLabel={(story) => story.name}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="current stories"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <br />
            {state.storySelected && (
              <Typography>
                User assigned to this User Story: {state.selectedUser.username}{" "}
              </Typography>
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
      </div>
    </MuiThemeProvider>
  );
};

export default TaskComponent;
