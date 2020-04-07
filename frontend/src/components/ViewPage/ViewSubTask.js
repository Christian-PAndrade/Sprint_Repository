import React, { useReducer, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ViewSubTask = () => {
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

  const handleClick = (value) => {
    fetchTask(value);
  };

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

  const fetchTask = async (value) => {
    try {
      if (value) {
        const selectedTask = state.tasks.find((task) => task.name === value);

        setState({
          task: selectedTask,
        });

        await fetchAdditional(selectedTask);
      } else {
        setState({ task: {} });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAdditional = async (task) => {
    try {
      // Get sprint name from id
      const querySprint = `{boardbyid(id: "${task.task_sprint}") {
        name
      }}`;

      let responseSprint = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: querySprint,
        }),
      });

      let json = await responseSprint.json();
      setState({ sprintName: json.data.boardbyid.name });

      // Get UserStory name from id
      const queryUserStory = `{usbyid(id: "${task.task_userStoryId}") {
      name
    }}`;

      let responseUserStory = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: queryUserStory,
        }),
      });

      let jsonUserStory = await responseUserStory.json();
      setState({ userStoryName: jsonUserStory.data.usbyid.name });

      // Get User from id
      const queryUser = `{userbyid(id: "${task.task_assignedToId}") {
      username
    }}`;

      let responseUser = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: queryUser,
        }),
      });

      let jsonUser = await responseUser.json();
      setState({ User: jsonUser.data.userbyid.username });
    } catch (err) {
      console.log(err);
    }
  };

  // makes a card for each task
  const TaskCard = () => {
    // Get User from id
    return (
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
                  <TableCell>{state.task.name}</TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Status:
                  </TableCell>
                  <TableCell>{state.task.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Created On:
                  </TableCell>
                  <TableCell>{state.task.creationDate}</TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Completed On:
                  </TableCell>
                  <TableCell>{state.task.completionDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Estimate:
                  </TableCell>
                  <TableCell>{state.task.estimate}</TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    User Story:
                  </TableCell>
                  <TableCell>{state.userStoryName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    User Assigned:
                  </TableCell>
                  <TableCell>{state.User}</TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Time Worked:
                  </TableCell>
                  <TableCell>{state.task.timeWorked}</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <Autocomplete
        id="tasks"
        options={[...state.tasks.map((task) => task.name)]}
        getOptionLabel={(option) => option}
        onChange={(event, value) => handleClick(value)}
        style={{ marginBottom: "5%" }}
        renderInput={(param) => (
          <TextField {...param} label="Tasks" variant="outlined" />
        )}
      />
      {Object.keys(state.task).length > 0 && <TaskCard />}
    </div>
  );
};

export default ViewSubTask;
