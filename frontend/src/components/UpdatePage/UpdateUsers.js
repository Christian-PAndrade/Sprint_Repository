import React, { useReducer, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableRow,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import Autocomplete from "@material-ui/lab/Autocomplete";

const UpdateUsers = () => {
  const initialState = {
    users: [],
    selectedUser: {},
    projects: [],
    selectedProject: {},
    disabled: true,
    success: false,
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllUsers();
    getAllProjects();
  }, []);

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
      setState({ projects: json.data.projects });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (value) => {
    setState({ success: false, disabled: true });
    fetchAdditional(value);
  };

  const handleProjClick = async (e) => {
    fetchAdditionalProject(e.target.value);
  };

  // Set User
  const fetchAdditional = async (value) => {
    try {
      // Get the User with name == value
      const selectedUser = state.users.find((user) => user.username === value);
      setState({
        selectedUser,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  // Set Project
  const fetchAdditionalProject = async (value) => {
    try {
      const selectedProj = state.projects.find((proj) => proj._id === value);
      setState({
        selectedProject: selectedProj,
        disabled: false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const { _id, username, isAdmin } = state.selectedUser;

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation { updateuser (
            id: "${_id}",
            name: "${username}",
            isAdmin: ${isAdmin}
          ) {
              _id
              username
              isAdmin
          }}`,
        }),
      });
      let json = await response.json();
      setState({
        selectedUser: json.data.updateuser,
        success: false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    try {
      const user = {
        _id: state.selectedUser._id,
        name: state.selectedUser.name,
        isAdmin: state.selectedUser.isAdmin,
      };
      const project = {
        _id: state.selectedProject._id,
        name: state.selectedProject.name,
      };

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation { addusertoproject (
            userId: "${user._id}",
            projectId: "${project._id}",
          ) {
              _id
              lookupUserId
              lookupProjectId
          }}`,
        }),
      });
      let json = await response.json();
      setState({ success: true });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRadioSelection = (e) => {
    let value = false;
    if (e.target.value === "true") value = true;
    else if (e.target.value === "false") value = false;
    let user = {
      _id: state.selectedUser._id,
      username: state.selectedUser.username,
      isAdmin: value,
    };
    setState({
      selectedUser: user,
    });
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
      {state.selectedUser && Object.keys(state.selectedUser).length > 0 && (
        <div>
          <div>
            <Card>
              <CardHeader title="User" />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow key={Math.random()}>
                        <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
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
                            value={state.selectedUser.username}
                            onChange={(e) =>
                              setState({
                                selectedUser: {
                                  ...state.selectedUser,
                                  name: e.target.value,
                                },
                              })
                            }
                          />
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                            fontSize: 17,
                          }}
                        >
                          Is Admin:
                        </TableCell>
                        <TableCell>
                          <RadioGroup
                            value={state.selectedUser.isAdmin}
                            onClick={handleRadioSelection}
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="True"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="False"
                            />
                          </RadioGroup>
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
          </div>
          <div style={{ marginTop: "2%" }}>
            <Card>
              <CardHeader title="Add User to Project"></CardHeader>
              <CardContent>
                {state.success && (
                  <Alert severity="success" variant="filled">
                    <AlertTitle>Success</AlertTitle>
                    {state.selectedUser.username} has been added to
                    {state.selectedProject.name}!
                  </Alert>
                )}
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                          Name:
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                          {state.selectedUser.username}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                          Project:
                        </TableCell>
                        <TableCell>
                          <Select
                            fullWidth
                            id="projects"
                            value={state.selectedProject.name}
                            onChange={(e) => handleProjClick(e)}
                          >
                            {state.projects.map((proj, index) => (
                              <MenuItem key={index} value={proj._id}>
                                {proj.name}
                              </MenuItem>
                            ))}
                          </Select>
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
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    disabled={state.disabled}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUsers;
