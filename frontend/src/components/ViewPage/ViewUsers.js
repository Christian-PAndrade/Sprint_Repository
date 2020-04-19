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
  TableBody,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeQuery } from "../helper";

const ViewUsers = () => {
  const initialState = {
    users: [],
    projects: [],
    boards: [],
    user: {},
    userProjects: [],
    velocities: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllUsers();
    fetchAllProjects();
  }, []);

  const handleClick = (value) => {
    fetchUser(value);
  };

  const fetchAllUsers = async () => {
    const { users } = await makeQuery(`
    query {users {
      _id
      username
      isAdmin
    }}`);

    setState({ users });
  };

  const fetchAllProjects = async () => {
    const { projects } = await makeQuery(`{projects {_id, name}}`);

    setState({ projects });
  };

  const fetchUser = async (value) => {
    if (value) {
      // Get that user
      const user = state.users.find((user) => user.username === value);

      // Get the projects that user is working on
      const { projectsbyuser } = await makeQuery(`
      { projectsbyuser(userId: "${user._id}") {
          lookupProjectId
      }}`);

      // Get velocites for that user
      const { uvelbyuser } = await makeQuery(
        `{uvelbyuser(userid: "${user._id}") {
          velocity
          userVelocity_boardId
        }}`
      );

      // gets full board info for velocities
      let selectedBoards = [];
      const { boards } = await makeQuery(`{boards {_id, name}}`);
      uvelbyuser.forEach((vel) => {
        selectedBoards.push(
          boards.find((board) => board._id === vel.userVelocity_boardId)
        );
      });

      setState({
        user,
        userProjects: projectsbyuser,
        velocities: uvelbyuser,
        boards: selectedBoards,
      });
    } else {
      setState({
        user: {},
        userProjects: [],
        velocities: [],
        boards: [],
      });
    }
  };

  const UserInfo = () => {
    return (
      <Card style={{ width: "60%" }}>
        <CardHeader title="User" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Name:
                  </TableCell>
                  <TableCell>{state.user.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Is user Admin:
                  </TableCell>
                  <TableCell>{state.user.isAdmin ? "true" : "false"}</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  const Projects = () => {
    return (
      <div>
        Works in projects:
        {state.userProjects.map((project, index) => {
          const fullProjInfo = state.projects.find(
            (proj) => proj._id === project.lookupProjectId
          );
          return (
            <div key={index}>
              <p>{fullProjInfo.name}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const Velocites = () => {
    return (
      <Card style={{ width: "60%" }}>
        <CardHeader title="Velocties" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableBody>
                {state.velocities.map((velocity, index) => {
                  const sprintData = state.boards.find(
                    (board) => board._id === velocity.userVelocity_boardId
                  );
                  return (
                    <TableRow key={index}>
                      <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                        Board/Sprint:
                      </TableCell>
                      <TableCell>{sprintData.name}</TableCell>
                      <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                        Velocity:
                      </TableCell>
                      <TableCell>{velocity.velocity}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <Autocomplete
        id="users"
        options={[...state.users.map((user) => user.username)]}
        getOptionLabel={(option) => option}
        onChange={(event, value) => handleClick(value)}
        style={{ margin: "5% 0" }}
        renderInput={(param) => (
          <TextField {...param} label="Users" variant="outlined" />
        )}
      />
      {Object.keys(state.user).length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <UserInfo />
            <Projects />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5%",
            }}
          >
            <Velocites />
          </div>
        </>
      )}
    </div>
  );
};

export default ViewUsers;
