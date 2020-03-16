import React, { useReducer, useEffect } from "react";

import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ViewUsers = () => {
  const initialState = {
    users: [],
    user: {},
    projectName: null,
    projects: []
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleClick = value => {
    fetchUser(value);
  };

  const fetchAllUsers = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `query {users {
                _id
                username
                isAdmin
                projectId
              }}`
        })
      });
      let json = await response.json();

      setState({
        users: json.data.users
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUser = async value => {
    try {
      if (value) {
        const query = `{ userbyname(name: "${value}") {
            _id
            username
            isAdmin
            projectId
          } }`;

        let response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            query: query
          })
        });
        let json = await response.json();

        setState({ user: json.data.userbyname });

        //await fetchAdditional(json.data.userbyname);
      } else {
        setState({ userStory: {} });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAdditional = async user => {};

  const UserInfo = () => {
    return (
      <div>
        <p>Name: {state.user.username}</p>
        <p>IsAdmin: {state.user.isAdmin ? "true" : "false"}</p>
        <br />
      </div>
    );
  };

  const Projects = () => {
    return (
      <div>
        {state.projects.map(project => (
          <div key={Math.random()}>
            <p>Project Name: {project.name}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Autocomplete
        id="users"
        options={[...state.users.map(user => user.username)]}
        getOptionLabel={option => option}
        onChange={(event, value) => handleClick(value)}
        style={{ margin: "5% 0" }}
        renderInput={param => (
          <TextField {...param} label="Users" variant="outlined" />
        )}
      />
      {Object.keys(state.user).length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <UserInfo />
          <Projects />
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
