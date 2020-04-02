import React, { useReducer, useEffect, useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import theme from "../../styles/theme";
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const UpdateSelection = () => {
 const initialState = {
   boards: [],
   projectName: null,
   projects: [],
   displayBoard: false
 };
 const reducer = (state, newState) => ({ ...state, ...newState });
 const [state, setState] = useReducer(reducer, initialState);

 useEffect(() => {
   fetchAllProjects();
 }, []);

 const handleClick = value => {
   fetchBoards(value);
 };

 const handleBoardClick = value => {

 }

 const fetchAllProjects = async () => {
   try {
     let response = await fetch("http://localhost:5000/graphql", {
       origin: "*",
       method: "POST",
       headers: { "Content-Type": "application/json; charset=utf-8" },
       body: JSON.stringify({
         query: "{projects{_id, name}}"
       })
     });
     let json = await response.json();
     setState({projects: json.data.projects})
   } catch (error) {
     console.log(error);
   }
 };

const fetchBoards = async proj =>{
     try {
       let response = await fetch("http://localhost:5000/graphql", {
         origin: "*",
         method: "POST",
         headers: { "Content-Type": "application/json; charset=utf-8" },
         body: JSON.stringify({
           query: `{boardbyproj(projid: "${proj._id}"){ 
                _id
                startDate
                endDate
                name
                board_projectId
            }}`
         })
       });
       let json = await response.json();
       setState({ boards: json.data.boardbyproj, displayBoard: !state.displayBoard });
     } catch (error) {
       console.log(error);
     }
}

const UserStory = () => {

}

 return (
   <MuiThemeProvider theme={theme}>
     <Card
       style={{ marginTop: "5%", width: "95%" }}
       className={"CHANGE_ME_TOO"}
     >
       <CardHeader
         title="Update A Project"
         color="inherit"
         style={{ textAlign: "center" }}
       />
       <CardContent
         style={{
           display: "grid",
           gridTemplateColumns: "25% 75%",
           gridTemplateRows: "auto"
         }}
       >
         <div>
           <FormControl component="fieldset">
             <FormLabel>Choose What Project to Update:</FormLabel>
             <Autocomplete
               id="projects"
               options={[...state.projects.map(proj => proj)]}
               getOptionLabel={option => option.name}
               onChange={(event, value) => handleClick(value)}
               style={{ margin: "5% 0" }}
               renderInput={param => (
                 <TextField {...param} label="projects" variant="outlined" />
               )}
             />
               <Autocomplete
                 id="boards"
                 options={[...state.boards.map(board => board)]}
                 getOptionLabel={option => option.name}
                 onChange={(event, value) => handleBoardClick(value)}
                 style={{ margin: "5% 0" }}
                 renderInput={param => (
                   <TextField {...param} label="boards" variant="outlined" />
                 )}
               />
           </FormControl>
         </div>
       </CardContent>
     </Card>
   </MuiThemeProvider>
 );
};

export default UpdateSelection;