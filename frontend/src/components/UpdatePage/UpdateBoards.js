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
  Button,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
const moment = require("moment");

const UpdateBoards = () => {
  const initialState = {
    boards: [],
    selectedBoard: {},
    success: false,
  };
  const reducer = (state, newState) => ({
    ...state,
    ...newState,
  });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    getAllBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      let allBoardData = [];

      for (let i = 0; i < json.data.boards.length; i++) {
        let element = json.data.boards[i];
        let projectResponse = [];
        await getAllProjects().then((value) => {
          projectResponse = value;
        });
        let project = projectResponse.find(
          (p) => p._id === element.board_projectId
        );
        allBoardData.push({
          _id: element._id,
          name: element.name,
          startDate: element.startDate,
          endDate: element.endDate,
          board_projectId: element.board_projectId,
          projectName: project.name,
        });
      }

      setState({ boards: allBoardData });
    } catch (error) {
      console.log(error);
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
          query: "{ projects { _id, name } }",
        }),
      });
      let json = await response.json();
      return json.data.projects;
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
      const selectedBoard = state.boards.find((board) => board.name === value);
      setState({
        selectedBoard,
        success: false,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleUpdate = async () => {
    try {
      const {
        _id,
        startDate,
        endDate,
        name,
        board_projectId,
      } = state.selectedBoard;

      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation { updateboard (
            id: "${_id}",
            startDate: "${startDate}",
            endDate: "${endDate}",
            name: "${name}",
            projectId: "${board_projectId}",
          ) {
              _id
              startDate
              endDate
              name
              board_projectId
          }}`,
        }),
      });
      let json = await response.json();
      console.log(json);

      setState({
        selectedBoard: {
          ...state.selectedBoard,
          name: json.data.updateboard.name,
          endDate: json.data.updateboard.endDate,
        },
        success: true,
      });

      getAllBoards();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseBoard = async () => {
    const endDate = moment().format("YYYY-MM-DD HH:mm:ss");
    setState({
      selectedBoard: {
        ...state.selectedBoard,
        endDate,
      },
    });

    // update db
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation { closeBoard(
            id: "${state.selectedBoard._id}",
            endDate: "${endDate}"
          ) {
            _id
            startDate
            endDate
            name
            board_projectId
          }
        }`,
        }),
      });

      const json = await response.json();

      // find project name
      const allProj = await getAllProjects();

      const proj = allProj.find(
        (proj) => proj._id === json.data.closeBoard.board_projectId
      );

      setState({
        selectedBoard: { ...json.data.closeBoard, projectName: proj.name },
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <Autocomplete
        id="boards"
        options={[...state.boards.map((board) => board.name)]}
        getOptionLabel={(option) => option}
        onChange={(event, value) => handleClick(value)}
        style={{ margin: "5% 0" }}
        renderInput={(param) => (
          <TextField {...param} label="Boards" variant="outlined" />
        )}
      />
      {state.selectedBoard && Object.keys(state.selectedBoard).length > 0 && (
        <Card>
          <CardHeader title="Board" />
          <CardContent>
            {state.success && (
              <Alert severity="success" variant="filled">
                <AlertTitle>Success</AlertTitle>
                {state.selectedBoard.name} has been updated!
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
                        value={state.selectedBoard.name}
                        onChange={(e) =>
                          setState({
                            selectedBoard: {
                              ...state.selectedBoard,
                              name: e.target.value,
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
                      Project:
                    </TableCell>
                    <TableCell>{state.selectedBoard.projectName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      Start Date:
                    </TableCell>
                    <TableCell>{state.selectedBoard.startDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      End Date:
                    </TableCell>
                    <TableCell>{state.selectedBoard.endDate}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          marginTop: "2%",
                        }}
                      >
                        <Button
                          onClick={handleCloseBoard}
                          variant="contained"
                          color="secondary"
                          disabled={state.selectedBoard.endDate !== null}
                        >
                          Close Board
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

export default UpdateBoards;
