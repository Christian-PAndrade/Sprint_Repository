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
    minWidth: 100,
    maxWidth: 300,
    minHeight: 500,
    maxHeight: 500,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  textBox: {
    display: "grid",
    justifyContent: "center",
    minHeight: 600
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
    projectHasBoards: false,
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
  }

  const onAddClicked = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // var now = new Date();
    // var dateString =
    //     now.getFullYear().toString() +
    //     "-" +
    //     ("0" + (now.getMonth() + 1)).slice(-2) +
    //     "-" +
    //     ("0" + now.getDate()).slice(-2) +
    //     " " +
    //     ("0" + now.getHours()).slice(-2) +
    //     ":" +
    //     ("0" + now.getMinutes()).slice(-2) +
    //     ":" +
    //     ("0" + now.getSeconds()).slice(-2);
    //     console.log(dateString);
    const dateString = moment().format("YYYY-MM-DD");

    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation{ adduserstory(name: "${state.name}", creationDate: "${dateString}", completionDate: "", status: "Open", estimate: ${state.estimate}, hoursWorked: 0, reestimate: "", userStory_boardId: "${state.boardID}", userStory_userId: "${state.userID}"){name,creationDate,completionDate,status,estimate,hoursWorked,reestimate,userStory_boardId,userStory_userId}}`,
        }),
      });
      let json = await response.json();
      console.log(json);
      setState({
        name: "",
        boardID: "",
        estimate: 0,
        clear: !state.clear,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserProjects = async (e, v) => {
    setState({userID: v._id});
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
      setState({ projects: projArray, userHasProjects: flag});
    } catch (error) {
      console.log(error);
    }
  }

  const getProjectNames = async project => {
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

  const getProjectBoards = async (e, v) => {
    console.log(v);
     try {
       let response = await fetch("http://localhost:5000/graphql", {
         origin: "*",
         method: "POST",
         headers: { "Content-Type": "application/json; charset=utf-8" },
         body: JSON.stringify({
           query: `{boardbyproj(projid: "${v._id}"){_id, startDate, endDate, name, board_projectId}}`,
         }),
       });
       let json = await response.json();
       setState({ boards: json.data.boardbyproj, projectHasBoards: true });
     } catch (error) {
       console.log(error);
     }
  }

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
    setState({estimate: e.target.value});
  }

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
          <br/>
          <TextField
            onChange={handleEstimateInput}
            helperText="Enter estimated hours"
            value={state.estimate}
          />
          <br /> <br />
          <Typography>Find a user in the system: </Typography>
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
          {state.userHasProjects && (
            <Fragment>
              <br />
              <Typography>Select a project: </Typography>
              <br />
              <Autocomplete
                key={state.clear}
                id="projects"
                options={state.projects.map((project) => project)}
                onChange={(event, value) => {
                  getProjectBoards(event, value);
                }}
                getOptionLabel={(project) => project.name}
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
            </Fragment>
          )}
          <br />
          {state.projectHasBoards && (
            <Fragment>
              <Typography>Find a board in the system: </Typography>
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
