import React, { useReducer, useEffect } from "react";
import theme from "../../styles/theme";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MuiThemeProvider,
} from "@material-ui/core";

const ViewProject = () => {
  const initialState = {
    projects: [],
    tableKey: false,
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    getAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllProjects = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: "{projects{_id, name}}",
        }),
      });
      let json = await response.json();
      let allProjectData = [];

      for (let i = 0; i < json.data.projects.length; i++) {
        let element = json.data.projects[i];
        let userResponse = [];
        await getProjectUsers(null, element).then((value) => {
          userResponse = value;
        });
        let boardResponse = [];
        await getProjectBoards(element).then((value) => {
          boardResponse = value;
        });
        allProjectData.push({
          _id: element._id,
          name: element.name,
          users: userResponse,
          boards: boardResponse,
        });
      }

      setState({ projects: allProjectData });
    } catch (error) {
      console.log(error);
    }
  };

  const getProjectBoards = async (value) => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{boardbyproj(projid:"${value._id}"){_id,startDate,endDate,name, board_projectId}}`,
        }),
      });
      let json = await response.json();
      return json.data.boardbyproj;
    } catch (error) {
      console.log(error);
    }
  };

  const getProjectUsers = async (e, v) => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{usersbyproject(projectId:"${v._id}"){_id,lookupUserId,lookupProjectId}}`,
        }),
      });
      let json = await response.json();
      let usersForProject = [];

      for (let i = 0; i < json.data.usersbyproject.length; i++) {
        let userResponse = await fetch("http://localhost:5000/graphql", {
          origin: "*",
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            query: `{userbyid(id:"${json.data.usersbyproject[i].lookupUserId}"){_id,username,isAdmin}}`,
          }),
        });

        let userJson = await userResponse.json();
        usersForProject.push(userJson.data.userbyid);
      }

      return usersForProject;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUserFromProject = async (user, projId) => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation{deleteUserFromProject(
                userId:\"${user._id}\",
                projectId: \"${projId}\")
              }`,
        }),
      });
      let json = await response.json();
      let allProjectsData = [];
      let usersForProject = [];

      for (let i = 0; i < state.projects.length; i++) {
        for (let j = 0; j < state.projects[i].users.length; j++) {
          if (state.projects[i].users[j]._id === user._id) {
            continue;
          } else usersForProject.push(state.projects[i].users[j]);
        }
        allProjectsData.push({
          _id: state.projects[i]._id,
          name: state.projects[i].name,
          users: usersForProject,
          boards: state.projects[i].boards,
        });
        usersForProject = [];
      }
      setState({ projects: allProjectsData });

      if (state.tableKey === false) setState({ tableKey: true });
      else setState({ tableKey: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table key={state.tableKey}>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: "200%" }}>Projects</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.projects.map((proj) => (
              <TableRow key={proj.name}>
                <TableCell>
                  <Card>
                    <CardHeader title={proj.name} />
                    <CardContent>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>User Name</TableCell>
                              <TableCell>Option</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {proj.users.map((user) => (
                              <TableRow key={user.username}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell key={user.username}>
                                  <Button
                                    key={user.username}
                                    value={user}
                                    variant="contained"
                                    onClick={() => {
                                      deleteUserFromProject(user, proj._id);
                                    }}
                                    style={{
                                      backgroundColor: "#FF0000",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </TableCell>
                <TableCell>
                  <Card>
                    <CardHeader title={proj.name} />
                    <CardContent>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Board / Sprint</TableCell>
                              <TableCell>Option</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {proj.boards.map((board) => (
                              <TableRow key={board.name}>
                                <TableCell>{board.name}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    style={{
                                      backgroundColor: "#FF0000",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MuiThemeProvider>
  );
};

export default ViewProject;
