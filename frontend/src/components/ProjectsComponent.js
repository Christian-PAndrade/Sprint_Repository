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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  textBox: {
    display: "grid",
    justifyContent: "center",
    width: 700,
    minHeight: 550,
  },
});

const ProjectComponent = () => {
  const classes = useStyles();
  const initialState = {
    name: "",
    hasUserProjs: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onAddClicked = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      await fetch("http://localhost:5000/graphql", {
        origin: "*",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation{ addproject(name: "${state.name}"){name}}`,
        }),
      });

      setState({
        name: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };

  const emptyorundefined = state.name === undefined || state.name === "";

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.container}>
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
      </div>
    </MuiThemeProvider>
  );
};

export default ProjectComponent;
