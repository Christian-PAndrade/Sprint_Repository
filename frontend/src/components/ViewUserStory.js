import React, { useReducer, useEffect } from "react";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ViewUserStory = () => {
  const initialState = {
    userStories: [],
    userStory: {},
    sprintName: null,
    tasks: []
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllUserStories();
  }, []);

  const handleClick = value => {
    fetchUserStory(value);
  };

  const fetchAllUserStories = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `query {userstories {
            _id
            name
            creationDate
            completionDate
            status
            estimate
            hoursWorked
            reestimate
            }}`
        })
      });
      let json = await response.json();

      setState({
        userStories: json.data.userstories
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserStory = async value => {
    try {
      if (value) {
        const query = `{ usbyname(name: "${value}") {
                _id
                name
                creationDate
                completionDate
                status
                estimate
                hoursWorked
                reestimate
                userStory_boardId
          }}`;

        let response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            query: query
          })
        });
        let json = await response.json();

        setState({ userStory: json.data.usbyname });

        await fetchAdditional(json.data.usbyname);
      } else {
        setState({ userStory: {} });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAdditional = async us => {
    try {
      // get sprint by id
      const querySprint = `{ boardbyid(id: "${us.userStory_boardId}") {name}}`;
      let responseSprint = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: querySprint
        })
      });

      let json = await responseSprint.json();
      setState({ sprintName: json.data.boardbyid.name });

      // Get tasks for that board -- taskbyboard(boardid: String): [Task],
      const queryTasks = `{ taskbyboard(boardid: "${us.userStory_boardId}") {name status}}`;
      let responseTasks = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: queryTasks
        })
      });

      let jsonTasks = await responseTasks.json();
      console.log(jsonTasks.data.taskbyboard);
      setState({ tasks: jsonTasks.data.taskbyboard });
    } catch (err) {
      console.log(err);
    }
  };

  const UserStory = () => {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <p>Name: {state.userStory.name}</p>
          <p>Status: {state.userStory.status}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <p>Created On: {state.userStory.creationDate}</p>
          <p>Completed On: {state.userStory.completionDate}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p>Estimate: {state.userStory.estimate}</p>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <p>Sprint: {state.sprintName}</p>
        </div>
      </div>
    );
  };

  const Tasks = () => {
    return (
      <div>
        {state.tasks.map(task => (
          <div key={Math.random()}>
            <p>Task Name: {task.name}</p>
            <p>Status: {task.status}</p>
            <br />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Autocomplete
        id="userstories"
        options={[...state.userStories.map(us => us.name)]}
        getOptionLabel={option => option}
        onChange={(event, value) => handleClick(value)}
        style={{ margin: "5% 0" }}
        renderInput={param => (
          <TextField {...param} label="User Stories" variant="outlined" />
        )}
      />
      {Object.keys(state.userStory).length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <UserStory />
          <Tasks />
        </div>
      )}
    </div>
  );
};

export default ViewUserStory;
