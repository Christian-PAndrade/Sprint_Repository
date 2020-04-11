import React, { useReducer } from "react";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
} from "@material-ui/core";
import theme from "../styles/theme";
import "../App.css";
import AddCircle from "@material-ui/icons/AddCircle";

const useStyles = makeStyles({
  container: {
    minWidth: 300,
    maxWidth: 300,
    minHeight: 300,
    maxHeight: 300,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  textBox: {
    display: "grid",
    justifyContent: "center",
    width: 250,
    minHeight: 600
  }
});

const ProjectComponent = () => {
  const classes = useStyles();
  const initialState = {
    name: "",
    hasUserProjs: false
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onAddClicked = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let response = await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          query: `mutation{ addproject(name: "${state.name}"){name}}`
        })
      });
      let json = await response.json();
      setState({
        name: ""
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameInput = e => {
    setState({ name: e.target.value });
  };

  const emptyorundefined = state.name === undefined || state.name === "";

  return (
    <MuiThemeProvider theme={theme} className={classes.container}>
      <Card className={classes.textBox}>
        <CardHeader
          title="Add A Project"
          color="inherit"
          style={{ textAlign: "center" }}
        />
        <CardContent>
          <TextField
            onChange={handleNameInput}
            helperText="Enter a project name here"
            value={state.name}
          />
          <br /> <br />
          <br /> <br />
          <br /> <br />
          <br />
          <IconButton
            color="secondary"
            style={{ marginTop: 50, float: "right" }}
            onClick={onAddClicked}
            disabled={emptyorundefined}
          >
            <AddCircle fontSize="large" />
          </IconButton>
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

export default ProjectComponent;
