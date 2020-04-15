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
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ViewUserStory = () => {
  const initialState = {
    userStories: [],
    userStory: {},
    sprintName: null,
    tasks: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAllUserStories();
  }, []);

  const handleClick = (value) => {
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
            storyPoints
            }}`,
        }),
      });
      let json = await response.json();

      setState({
        userStories: json.data.userstories,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserStory = async (value) => {
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
                storyPoints
                userStory_boardId
          }}`;

        let response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            query: query,
          }),
        });
        let json = await response.json();

        setState({ userStory: json.data.usbyname });
        console.log(json.data.usbyname);
        await fetchAdditional(json.data.usbyname);
      } else {
        setState({ userStory: {} });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAdditional = async (us) => {
    try {
      // Get tasks for that board -- taskbyboard(boardid: String): [Task],
      const queryTasks = `{ taskbyuserstory(userStoryId: "${us._id}") {name, creationDate, completionDate, status, estimate}}`;
      let responseTasks = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: queryTasks,
        }),
      });

      let jsonTasks = await responseTasks.json();
      console.log(jsonTasks.data.taskbyuserstory);
      setState({ tasks: jsonTasks.data.taskbyuserstory });
    } catch (err) {
      console.log(err);
    }
  };

  const UserStory = () => {
    return (
      <Card>
        <CardHeader title="User Story" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead></TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Name:
                  </TableCell>
                  <TableCell>{state.userStory.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Status:
                  </TableCell>
                  <TableCell>{state.userStory.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Created On:
                  </TableCell>
                  <TableCell>{state.userStory.creationDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Completed On:
                  </TableCell>
                  <TableCell>{state.userStory.completionDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Estimate:
                  </TableCell>
                  <TableCell>{state.userStory.estimate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Story Points:
                  </TableCell>
                  <TableCell>{state.userStory.storyPoints}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Sprint:
                  </TableCell>
                  <TableCell>{state.sprintName}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  const Tasks = () => {
    return (
      <MuiThemeProvider theme={theme}>
        <Card>
          <CardHeader title="Tasks" />
          <CardContent>
            {state.tasks.map((task) => (
              <Card style={{ marginBottom: "2%" }}>
                <CardHeader title={task.name} />
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead></TableHead>
                      <TableBody>
                        <TableRow key={Math.random()}>
                          <TableCell
                            style={{ fontWeight: "bold", fontSize: 17 }}
                          >
                            Status:
                          </TableCell>
                          <TableCell>{task.status}</TableCell>
                        </TableRow>
                        <TableRow key={Math.random()}>
                          <TableCell
                            style={{ fontWeight: "bold", fontSize: 17 }}
                          >
                            Creation Date:
                          </TableCell>
                          <TableCell>{task.creationDate}</TableCell>
                        </TableRow>
                        <TableRow key={Math.random()}>
                          <TableCell
                            style={{ fontWeight: "bold", fontSize: 17 }}
                          >
                            Completion Date:
                          </TableCell>
                          <TableCell>{task.completionDate}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </MuiThemeProvider>
    );
  };

  return (
    <div>
      <Autocomplete
        id="userstories"
        options={[...state.userStories.map((us) => us.name)]}
        getOptionLabel={(option) => option}
        onChange={(event, value) => handleClick(value)}
        style={{ margin: "5% 0" }}
        renderInput={(param) => (
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
