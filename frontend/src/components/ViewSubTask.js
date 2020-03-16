import React, { useReducer, useEffect } from "react";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ViewSubTask = () => {
  const initialState = {
    contactServer: false,
    tasks: [],
    choice: {},
    value: "Traveller",
    task: {},
    populate: false
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleClick = value => {
    setState({ choice: value });
    fetchTasks(value);
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
        contactServer: true,
        populate: true,
        tasks: json.data.tasks
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTasks = async value => {
    try {
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
        contactServer: true,
        populate: true,
        task: json.data.taskbyname
      });
    } catch (err) {
      console.log(err);
    }
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
      {state.task && <div>{state.task.name}</div>}
    </div>
  );
};

export default ViewSubTask;
