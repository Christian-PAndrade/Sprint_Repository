import React, { useReducer, useEffect } from "react";
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
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const UpdateSubTask = () => {
  const initialState = {
    tasks: [],
    task: {},
    sprintName: null,
    userStoryName: null,
    User: null,
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllTasks();
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
                      task_sprint
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

  const handleClick = async (value) => {
    fetchAdditional(value);
  };

  // Set task, fetch user story, board and user name
  const fetchAdditional = async (value) => {
    try {
      // Get the task with name == value
      const selectedTask = state.tasks.find((task) => task.name === value);
      setState({
        task: selectedTask,
      });

      // Get sprint name
      let responseSprint = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{boardbyid(id: "${selectedTask.task_sprint}") {
      name
    }}`,
        }),
      });
      let sprint = await responseSprint.json();

      // Set the sprint name with data gathered
      setState({ sprintName: sprint.data.boardbyid.name });

      // Get user story name
      let responseUserStory = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{usbyid(id: "${selectedTask.task_userStoryId}") {
        name
      }}`,
        }),
      });
      let userStory = await responseUserStory.json();

      // Set user story name with data gathered
      setState({ userStoryName: userStory.data.usbyid.name });

      // Finally get user info
      let responseUser = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{userbyid(id: "${selectedTask.task_assignedToId}") {
        username
      }}`,
        }),
      });
      let user = await responseUser.json();

      // Set user name
      setState({ User: user.data.userbyid.username });
    } catch (ex) {
      console.log(ex);
    }
  };

  console.log({ est: state.task.estimate });

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
      {Object.keys(state.task).length > 0 && (
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
                        value={state.task.name}
                        onChange={(e) =>
                          setState({
                            task: { ...state.task, name: e.target.value },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      Status:
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={state.task.status}
                        onChange={(e) =>
                          setState({
                            task: { ...state.task, status: e.target.value },
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
                        type="number"
                        value={state.task.estimate}
                        onChange={(e) =>
                          setState({
                            task: { ...state.task, estimate: e.target.value },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      User Story:
                    </TableCell>
                    <TableCell>{state.userStoryName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      Sprint:
                    </TableCell>
                    <TableCell>{state.sprintName}</TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      User Assigned:
                    </TableCell>
                    <TableCell>{state.User}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpdateSubTask;
