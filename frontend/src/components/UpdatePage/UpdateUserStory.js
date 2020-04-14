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
const moment = require("moment");

const UpdateUserStory = () => {
  const initialState = {
    userStories: [],
    selectedStory: {},
    success: false,
    status: ["Open", "Development", "Testing", "Completed"],
  };
  const reducer = (state, newState) => ({
    ...state,
    ...newState,
  });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
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
            "status, estimate, hoursWorked, reestimate, userStory_boardId " +
            " userStory_userId}}",
        }),
      });
      let json = await response.json();
      console.log(json);
      let allStoryData = [];

      for (let i = 0; i < json.data.userstories.length; i++) {
        let element = json.data.userstories[i];
        let boardsResponse = [];
        let userResponse = [];
        await getAllBoards().then((value) => {
          boardsResponse = value;
        });

        let board = boardsResponse.find(
          (b) => b._id === element.userStory_boardId
        );
        await getAllUsers().then((value) => {
          userResponse = value;
        });
        let user = userResponse.find((u) => u._id === element.userStory_userId);
        allStoryData.push({
          _id: element._id,
          name: element.name,
          estimate: element.estimate,
          hoursWorked: element.hoursWorked,
          reestimate: element.reestimate,
          creationDate: element.creationDate,
          completionDate: element.completionDate,
          status: element.status,
          userStory_boardId: element.userStory_boardId,
          userStory_userId: element.userStory_userId,
          boardName: board.name,
          userName: user.username,
        });
      }

      console.log(allStoryData);

      setState({ userStories: allStoryData });
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
      return json.data.boards;
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
      return json.data.users;
    } catch (err) {
      console.log(err);
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
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleCloseStory = () => {
    setState({
      selectedStory: {
        ...state.selectedStory,
        completionDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      },
    });
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
            completionDate: "${completionDate}",
            status: "${status}",
            estimate: ${estimate},
            hoursWorked: ${hoursWorked},
            reestimate: "${reestimate}",
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
    } catch (err) {
      console.log(err);
    }
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
                      Project:
                    </TableCell>
                    <TableCell>{state.selectedStory.boardName}</TableCell>
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
                    <TableCell>{state.selectedStory.estimate}</TableCell>
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
                    <TableCell>{state.selectedStory.creationDate}</TableCell>
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
                      Completion Date:
                    </TableCell>
                    <TableCell>{state.selectedStory.completionDate}</TableCell>
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
                          disabled={state.selectedStory.completionDate !== ""}
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
