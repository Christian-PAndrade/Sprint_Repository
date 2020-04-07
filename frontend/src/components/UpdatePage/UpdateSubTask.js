import React, { useReducer, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DialogComp from "../Modal";

const UpdateSubTask = () => {
  // for modal
  const [open, setOpen] = useState(false);
  const [newWorkedHours, setNewWorkedHours] = useState(0);

  // Other state
  const initialState = {
    tasks: [],
    userStories: [],
    sprints: [],
    users: [],
    selectedTask: {},
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllTasks();
    fetchAllUserStories();
    fetchAllSprints();
    fetchAllUsers();
  }, []);

  // Fetch info
  const fetchAllTasks = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `query { tasks {
                      _id
                      name
                      creationDate
                      completionDate
                      status
                      estimate
                      timeWorked
                      task_userStoryId
                      task_assignedToId
                    }}`,
        }),
      });
      let json = await response.json();

      setState({
        tasks: json.data.tasks,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch all userStories
  const fetchAllUserStories = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `query { userstories {
                      _id
                      name
                    }}`,
        }),
      });
      let json = await response.json();

      setState({
        userStories: json.data.userstories,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch all sprints
  const fetchAllSprints = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `query { boards {
                      _id
                      name
                    }}`,
        }),
      });
      let json = await response.json();

      setState({
        sprints: json.data.boards,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `query { users {
                      _id
                      username
                    }}`,
        }),
      });
      let json = await response.json();

      setState({
        users: json.data.users,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (value) => {
    fetchAdditional(value);
  };

  // Set task, fetch user story, board and user name
  const fetchAdditional = async (value) => {
    try {
      // Get the task with name == value
      const selectedTask = state.tasks.find((task) => task.name === value);
      setState({
        selectedTask,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  // Handles selections on autocomplete
  // user story
  const handleUSClick = (e) => {
    setState({
      selectedTask: {
        ...state.selectedTask,
        userStoryId: e.target.value,
      },
    });
  };

  // user
  const handleUClick = (e) => {
    setState({
      selectedTask: {
        ...state.selectedTask,
        userId: e.target.value,
      },
    });
  };

  // Updates a user
  const handleUpdate = async () => {
    try {
      const {
        _id,
        name,
        creationDate,
        completionDate,
        status,
        estimate,
        timeWorked,
        task_userStoryId,
        task_assignedToId,
      } = state.selectedTask;

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation { updatetask (
            id: "${_id}",
            name: "${name}", 
            creationDate: "${creationDate}", 
            completionDate: "${completionDate}",
            status: "${status}",
            estimate: ${estimate},
            timeWorked: ${timeWorked}
            userstory: "${task_userStoryId}",
            userassigned: "${task_assignedToId}"
          ) {
              _id
              name
              creationDate
              completionDate
              status
              estimate
              timeWorked
              task_userStoryId
              task_assignedToId
          }}`,
        }),
      });
      let json = await response.json();

      setState({ selectedTask: json.data.updatetask });
    } catch (err) {
      console.log(err);
    }
  };

  // Sets the completion date of a task
  const handleComplete = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation { updateCompleteDateTask (
            id: "${state.selectedTask._id}"
          ) {
              _id
              name
              creationDate
              completionDate
              status
              estimate
              timeWorked
              task_userStoryId
              task_assignedToId
          }}`,
        }),
      });

      let json = await response.json();
      setState({ selectedTask: json.data.updateCompleteDateTask });
    } catch (ex) {
      console.log(ex);
    }
  };

  const LogTime = async () => {
    // Closes modal
    setOpen(false);

    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation { logTimeToTask (
            id: "${state.selectedTask._id}",
            time: ${newWorkedHours}
          ) {
              _id
              name
              creationDate
              completionDate
              status
              estimate
              timeWorked
              task_userStoryId
              task_assignedToId
          }}`,
        }),
      });

      let json = await response.json();
      setState({ selectedTask: json.data.logTimeToTask });
    } catch (ex) {
      console.log(ex);
    }
  };

  // Decides whether or not to show complete button
  const showComplete =
    state.selectedTask.completionDate === null ||
    state.selectedTask.completionDate === "";

  return (
    <div>
      <Autocomplete
        id="tasks"
        options={[...state.tasks.map((task) => task.name)]}
        getOptionLabel={(option) => option}
        onChange={(event, value) => handleClick(value)}
        style={{ margin: "5% 0" }}
        renderInput={(param) => (
          <TextField {...param} label="Tasks" variant="outlined" />
        )}
      />
      {Object.keys(state.selectedTask).length > 0 && (
        <Card>
          <CardHeader title="Tasks" />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      Name:
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        value={state.selectedTask.name}
                        onChange={(e) =>
                          setState({
                            selectedTask: {
                              ...state.selectedTask,
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      Status:
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        value={state.selectedTask.status}
                        onChange={(e) =>
                          setState({
                            selectedTask: {
                              ...state.selectedTask,
                              status: e.target.value,
                            },
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      Estimate:
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        type="number"
                        value={state.selectedTask.estimate}
                        onChange={(e) =>
                          setState({
                            selectedTask: {
                              ...state.selectedTask,
                              estimate: e.target.value,
                            },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      User Story:
                    </TableCell>
                    <TableCell>
                      <Select
                        fullWidth
                        id="tasks_userStory"
                        value={state.selectedTask.task_userStoryId}
                        onChange={(e) => handleUSClick(e)}
                      >
                        {state.userStories.map((us, index) => (
                          <MenuItem key={index} value={us._id}>
                            {us.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      User Assigned:
                    </TableCell>
                    <TableCell>
                      <Select
                        fullWidth
                        id="tasks_user"
                        value={state.selectedTask.task_assignedToId}
                        onChange={(e) => handleUClick(e)}
                      >
                        {state.users.map((us, index) => (
                          <MenuItem key={index} value={us._id}>
                            {us.username}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      Hours Worked:
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        disabled
                        value={state.selectedTask.timeWorked}
                        onChange={(e) =>
                          setState({
                            selectedTask: {
                              ...state.selectedTask,
                              timeWorked: e.target.value,
                            },
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "2%",
              }}
            >
              <Button
                onClick={handleUpdate}
                variant="contained"
                color="primary"
              >
                Update
              </Button>
              <Button
                onClick={() => setOpen(true)}
                variant="contained"
                color="primary"
              >
                Log Time
              </Button>

              {showComplete && (
                <Button
                  onClick={handleComplete}
                  variant="contained"
                  color="secondary"
                >
                  Completed!
                </Button>
              )}
            </div>
          </CardContent>
          <DialogComp
            open={open}
            handleCloseDialog={() => setOpen(false)}
            title="Log Hours"
            content={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  type="number"
                  inputProps={{ min: "0" }}
                  value={newWorkedHours}
                  onChange={(e) => setNewWorkedHours(e.target.value)}
                />
                <Button
                  onClick={LogTime}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "5%" }}
                >
                  Log Time
                </Button>
              </div>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default UpdateSubTask;
