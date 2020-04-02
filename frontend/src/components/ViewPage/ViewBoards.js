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
  TextField
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const ViewBoards = () => {
  const initialState = {
    boards: [],
    selectedBoard: {},
    projectName: ""
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

   useEffect(() => {
     fetchAllBoards();
   }, []);

     const handleClick = value => {
       fetchSelectedBoard(value);
     };

     const fetchAllBoards = async () => {
       try {
         let response = await fetch("http://localhost:5000/graphql", {
           method: "POST",
           headers: { "Content-Type": "application/json; charset=utf-8" },
           body: JSON.stringify({
             query: `query {boards{
            _id
            startDate
            endDate
            name
            board_projectId
            }}`
           })
         });
         let json = await response.json();

         setState({
           boards: json.data.boards
         });
       } catch (err) {
         console.log(err);
       }
     };


  const fetchSelectedBoard = async value => {
    try {
      if (value) {
        const query = `{ boardbyname(name: "${value}") {
                 _id
                startDate
                endDate
                name
                board_projectId
          }}`;

        let response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            query: query
          })
        });
        let json = await response.json();

        setState({ selectedBoard: json.data.boardbyname });

        await fetchProject(json.data.boardbyname);
      } else {
        setState({ selectedBoard: {} });
      }
    } catch (err) {
      console.log(err);
    }
  };     


const fetchProject = async project => {
      try {
        // get sprint by id
        const projectQuery = `{ projectbyid(id: "${project.board_projectId}") {name}}`;
        let responseSprint = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            query: projectQuery
          })
        });

        let json = await responseSprint.json();
        setState({ projectName: json.data.projectbyid.name });
      } catch (err) {
        console.log(err);
      }
};

const Boards = () => {
  return (
    <Card style={{ width: "60%" }}>
      <CardHeader title="Boards" />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                  Name:
                </TableCell>
                <TableCell>{state.selectedBoard.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                  Created On:
                </TableCell>
                <TableCell>{state.selectedBoard.startDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                  Completed On:
                </TableCell>
                <TableCell>{state.selectedBoard.endDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", fontSize: 17 }}>
                  Project:
                </TableCell>
                <TableCell>{state.projectName}</TableCell>
              </TableRow>
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
           id="boards"
           options={[...state.boards.map(board => board.name)]}
           getOptionLabel={option => option}
           onChange={(event, value) => handleClick(value)}
           style={{ margin: "5% 0" }}
           renderInput={param => (
             <TextField {...param} label="Boards" variant="outlined" />
           )}
         />
         {Object.keys(state.selectedBoard).length > 0 && (
           <div style={{ display: "flex", justifyContent: "space-around" }}>
             <Boards />
           </div>
         )}
       </div>
     );
};

export default ViewBoards;