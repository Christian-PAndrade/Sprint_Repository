import React, { useReducer, useEffect } from "react";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ViewSubTask = () => {
  const initialState = {
    tasks: [],
    task: {},
    sprintName: null,
    userStoryName: null,
    User: null
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleClick = value => {
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
                      task_sprint
                      task_userStoryId
                      task_assignedToId
                    }}`
        })
      });
      let json = await response.json();

      setState({
        tasks: json.data.tasks
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTask = async value => {
    try {
      if (value) {
        const query = `{ taskbyname(name: "${value}") {
          _id
          name
          creationDate
          completionDate
          status
          estimate
          task_sprint
          task_userStoryId
          task_assignedToId
        }}`;

        let response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            query: query
          })
        });
        let json = await response.json();

        setState({
          task: json.data.taskbyname
        });

        await fetchAdditional(json.data.taskbyname);
      } else {
        setState({ task: {} });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAdditional = async task => {
    try {
      // Get sprint name from id
      const querySprint = `{boardbyid(id: "${task.task_sprint}") {
        name
      }}`;

      let responseSprint = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: querySprint
        })
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
          query: queryUserStory
        })
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
          query: queryUser
        })
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
      <div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <p>Name: {state.task.name}</p>
          <p>Status: {state.task.status}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <p>Created On: {state.task.creationDate}</p>
          <p>Completed On: {state.task.completionDate}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p>Estimate: {state.task.estimate}</p>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <p>User Story: {state.userStoryName}</p>
          <p>Sprint: {state.sprintName}</p>
          <p>User Assigned: {state.User}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Autocomplete
        id="tasks"
        options={[...state.tasks.map(task => task.name)]}
        getOptionLabel={option => option}
        onChange={(event, value) => handleClick(value)}
        style={{ margin: "5% 0" }}
        renderInput={param => (
          <TextField {...param} label="Tasks" variant="outlined" />
        )}
      />
      {Object.keys(state.task).length > 0 && <TaskCard />}
    </div>
  );
};

export default ViewSubTask;
