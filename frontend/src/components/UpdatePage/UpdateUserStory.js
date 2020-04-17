import React, { useReducer, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

const UpdateUserStory = () => {
  const initialState = {
    userStories: [],
    selectedStory: {},
    success: false,
    status: ["Open", "Development", "Testing", "Completed"],
    boards: [],
    users: [],
  };
  const reducer = (state, newState) => ({
    ...state,
    ...newState,
  });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    getAllBoards();
    getAllUsers();
    getAllUserStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllUserStory = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query:
            "{userstories{_id, name, creationDate, completionDate, " +
            "status, estimate, hoursWorked, reestimate, storyPoints, " +
            "userStory_boardId, userStory_userId}}",
        }),
      });
      let json = await response.json();

      setState({ userStories: json.data.userstories });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllBoards = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: "{boards{_id, startDate, endDate, name, board_projectId}}",
        }),
      });
      let json = await response.json();
      setState({ boards: json.data.boards });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
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
      setState({ users: json.data.users });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (value) => {
    fetchAdditional(value);
  };

  const fetchAdditional = async (value) => {
    try {
      // Get the project with name == value
      const selectedStory = state.userStories.find(
        (story) => story.name === value
      );

      setState({
        selectedStory,
        success: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseStory = async () => {
    const resp = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        query: `mutation { closeUserStory(
            id: "${state.selectedStory._id}"
          ) {
            _id, 
            name, 
            creationDate, 
            completionDate,
            status, 
            estimate, 
            hoursWorked, 
            reestimate, 
            storyPoints,
            userStory_boardId, 
            userStory_userId
          }
        }`,
      }),
    });
    let json = await resp.json();
    setState({
      selectedStory: json.data.closeUserStory,
    });

    window.location.reload();
  };

  const handleStatusClick = (e) => {
    setState({
      selectedStory: {
        ...state.selectedStory,
        status: e.target.value,
      },
    });
  };

  const handleUpdate = async () => {
    try {
      let {
        _id,
        name,
        creationDate,
        completionDate,
        status,
        estimate,
        hoursWorked,
        reestimate,
        storyPoints,
        userStory_boardId,
        userStory_userId,
      } = state.selectedStory;

      completionDate = completionDate !== null ? completionDate : "";

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation { updateuserstory (
            id: "${_id}",
            name: "${name}", 
            creationDate: "${creationDate}", 
            completionDate: ${
              completionDate ? '"' + completionDate + '"' : null
            },
            status: "${status}",
            estimate: ${estimate},
            hoursWorked: ${hoursWorked},
            reestimate: "${reestimate}",
            storyPoints: ${storyPoints},
            boardId: "${userStory_boardId}",
            userId: "${userStory_userId}"
          ) {
              _id
              name
              creationDate
              completionDate
              status
              estimate
              hoursWorked
              reestimate
              storyPoints
              userStory_boardId
              userStory_userId
          }}`,
        }),
      });
      let json = await response.json();
      setState({
        selectedStory: {
          ...state.selectedStory,
          name: json.data.updateuserstory.name,
          hoursWorked: json.data.updateuserstory.hoursWorked,
          status: json.data.updateuserstory.status,
          completionDate: json.data.updateuserstory.completionDate,
        },
        success: true,
      });

      getAllUserStory();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBoardClick = (e) => {
    setState({
      selectedStory: {
        ...state.selectedStory,
        userStory_boardId: e.target.value,
      },
    });
  };

  return (
    <div>
      <Autocomplete
        id="userStories"
        options={[...state.userStories.map((ustory) => ustory.name)]}
        getOptionLabel={(option) => option}
        onChange={(event, value) => handleClick(value)}
        style={{ margin: "5% 0" }}
        renderInput={(param) => (
          <TextField {...param} label="User Stories" variant="outlined" />
        )}
      />
      {state.selectedStory && Object.keys(state.selectedStory).length > 0 && (
        <Card>
          <CardHeader title={state.selectedStory.name} />
          <CardContent>
            {state.success && (
              <Alert severity="success" variant="filled">
                <AlertTitle>Success</AlertTitle>
                {state.selectedStory.name} has been updated!
              </Alert>
            )}
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
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
                        value={state.selectedStory.name}
                        onChange={(e) =>
                          setState({
                            selectedStory: {
                              ...state.selectedStory,
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
                      Board:
                    </TableCell>
                    <TableCell>
                      <Select
                        fullWidth
                        value={state.selectedStory.userStory_boardId}
                        onChange={(e) => handleBoardClick(e)}
                      >
                        {state.boards.map((board) => (
                          <MenuItem key={board._id} value={board._id}>
                            {board.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Estimate:
                    </TableCell>
                    <TableCell>
                      <TextField
                        disabled
                        value={state.selectedStory.estimate}
                      />
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Hours Worked:
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        value={state.selectedStory.hoursWorked}
                        onChange={(e) =>
                          setState({
                            selectedStory: {
                              ...state.selectedStory,
                              hoursWorked: e.target.value,
                            },
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Creation Date:
                    </TableCell>
                    <TableCell>
                      <TextField
                        disabled
                        value={state.selectedStory.creationDate}
                      />
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Status:
                    </TableCell>
                    <TableCell>
                      <Select
                        fullWidth
                        id="status"
                        value={state.selectedStory.status}
                        onChange={(e) => handleStatusClick(e)}
                      >
                        {state.status.map((stat, index) => (
                          <MenuItem key={index} value={stat}>
                            {stat}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Story Points:
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        type="number"
                        inputProps={{ min: "0" }}
                        value={state.selectedStory.storyPoints}
                        onChange={(e) =>
                          setState({
                            selectedStory: {
                              ...state.selectedStory,
                              storyPoints: e.target.value,
                            },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          marginTop: "2%",
                        }}
                      >
                        <Button
                          onClick={handleCloseStory}
                          variant="contained"
                          color="secondary"
                          disabled={state.selectedStory.completionDate !== null}
                        >
                          Close Story
                        </Button>
                      </div>
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

export default UpdateUserStory;
