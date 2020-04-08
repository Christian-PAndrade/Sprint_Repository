import React, { useReducer, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";

const UpdateProject = () => {
  const initialState = {
    projects: [],
    selectedProject: {},
    tableKey: false,
  };
  const reducer = (state, newState) => ({
    ...state,
    ...newState,
  });
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
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
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
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `{boardbyproj(projid:\"${value._id}\"){_id,startDate,endDate,name, board_projectId}}`,
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
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `{usersbyproject(projectId:\"${v._id}\"){_id,lookupUserId,lookupProjectId}}`,
        }),
      });
      let json = await response.json();
      let usersForProject = [];

      for (let i = 0; i < json.data.usersbyproject.length; i++) {
        let userResponse = await fetch("http://localhost:5000/graphql", {
          origin: "*",
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            query: `{userbyid(id:\"${json.data.usersbyproject[i].lookupUserId}\"){_id,username,isAdmin}}`,
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

  const handleClick = async (value) => {
    fetchAdditional(value);
  };

  // Set project
  const fetchAdditional = async (value) => {
    try {
      // Get the project with name == value
      const selectedProject = state.projects.find(
        (project) => project.name === value
      );
      setState({
        selectedProject,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleUpdate = async () => {
    try {
      const { _id, name } = state.selectedProject;

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation { updateproject (
            id: "${_id}",
            name: "${name}"
          ) {
              _id
              name
          }}`,
        }),
      });
      let json = await response.json();

      setState({
        selectedProject: json.data.updateproject,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Autocomplete
        id="projects"
        options={[...state.projects.map((proj) => proj.name)]}
        getOptionLabel={(option) => option}
        onChange={(event, value) => handleClick(value)}
        style={{ margin: "5% 0" }}
        renderInput={(param) => (
          <TextField {...param} label="Projects" variant="outlined" />
        )}
      />
      {Object.keys(state.selectedProject).length > 0 && (
        <Card>
          <CardHeader titile="Projects" />
          <CardContent>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow key={Math.random()}>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Name:
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      <TextField
                        fullWidth
                        value={state.selectedProject.name}
                        onChange={(e) =>
                          setState({
                            selectedProject: {
                              ...state.selectedProject,
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpdateProject;
