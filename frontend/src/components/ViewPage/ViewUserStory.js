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
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ViewUserStory = () => {
  const initialState = {
    userStories: [],
    userStory: {},
    sprintName: null,
    tasks: [],
    userStoryUser: "",
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
            userStory_boardId
            userStory_userId
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
                userStory_boardId
                userStory_userId
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
      // get sprint by id
      const querySprint = `{ boardbyid(id: "${us.userStory_boardId}") {name}}`;
      let responseSprint = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: querySprint,
        }),
      });

      let json = await responseSprint.json();
      setState({ sprintName: json.data.boardbyid.name });

      // Get tasks for that board -- taskbyboard(boardid: String): [Task],
      const queryTasks = `{ taskbyus(userst: "${us._id}") {name status}}`;
      let responseTasks = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: queryTasks,
        }),
      });

      let jsonTasks = await responseTasks.json();
      setState({ tasks: jsonTasks.data.taskbyus });

      // Fetch username
      let userFetch = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{ userbyid(id: "${us.userStory_userId}") {username}}`,
        }),
      });

      let userJson = await userFetch.json();

      setState({ userStoryUser: userJson.data.userbyid.username });
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
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Name:
                  </TableCell>
                  <TableCell>{state.userStory.name}</TableCell>
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
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    Sprint:
                  </TableCell>
                  <TableCell>{state.sprintName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                    user:
                  </TableCell>
                  <TableCell>{state.userStoryUser}</TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", fontSize: 17 }}
                  ></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  const Tasks = () => {
    return (
      <Card>
        <CardHeader title="Tasks" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                {state.tasks.map((task) => (
                  <TableRow key={Math.random()}>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      Task Name:
                    </TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                      Status:
                    </TableCell>
                    <TableCell>{task.status}</TableCell>
                  </TableRow>
                ))}
              </TableHead>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <Autocomplete
        id="userstories"
        options={[...state.userStories.map((us) => us.name)]}
        getOptionLabel={(option) => option}
        onChange={(event, value) => handleClick(value)}
        style={{ marginBottom: "5%" }}
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
