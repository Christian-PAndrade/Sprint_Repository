import React, { useReducer } from "react";
import { MuiThemeProvider, makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Snackbar,
  TextField,
  Typography
} from "@material-ui/core";
import theme from "../styles/theme";
import "../App.css";
import AddCircle from "@material-ui/icons/AddCircle";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";



const useStyles = makeStyles({
  container: {
    minWidth: 100,
    maxWidth: 300,
    minHeight: 1000,
    maxHeight: 1000,
    display: "grid",
    justifyContent: "center"
  },
  textBox: {
    display: "grid",
    justifyContent: "center"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 160
  }
});

const ProjectComponent = () => {
  const classes = useStyles();
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    name: "",
    projects: []
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onAddClicked = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {        
          const mutation = `mutation{ addproject(name: ${state.name})}`;
          const url = "http://localhost:5000/graphql";
          const opts = {
            method: "POST",
            myHeaders,
            body: JSON.stringify(`mutation{ addproject (name: ${state.name})}`)
          };
          console.log(opts.body);
          let response = await fetch(url, opts);
          let json = await response.json();
          setState({
            showMsg: true,
            snackbarMsg: json.msg,
            name: ""
          });
        } catch (error) {
      setState({ snackbarMsg: error.message, showMsg: true });
    }
  };

  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  const handleNameInput = e => {
    setState({ name: e.target.value });
  };

  const emptyorundefined =
    state.name === undefined ||
    state.name === "";

     const inputLabel = React.useRef(null);
     const [labelWidth, setLabelWidth] = React.useState(0);
     React.useEffect(() => {
       setLabelWidth(inputLabel.current.offsetWidth);
     }, []);

     const handleChange = name => event => {
       setState({
         ...state,
         [name]: event.target.value
       });
     };

  return (
    <MuiThemeProvider theme={theme} className={classes.container}>
      {" "}
      <Card style={{ marginTop: "10%" }} className={classes.textBox}>
        {" "}
        <CardHeader
          title="Add A Project"
          color="inherit"
          style={{ textAlign: "center" }}
        />{" "}
        <CardContent>
          {" "}
          <TextField
            onChange={handleNameInput}
            helperText="Enter a project name here"
            value={state.name}
          />{" "}
          <br /> <br />
          <Typography>Find a project in the system: </Typography>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
              Project Name
            </InputLabel>
            <Select
              native
              value={state.age}
              onChange={handleChange("age")}
              labelWidth={labelWidth}
              inputProps={{
                name: "age",
                id: "outlined-age-native-simple"
              }}
            >
              <option value="" />
              <option value={10}>Ten</option>
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </Select>
          </FormControl>
          <br />{" "}
          <IconButton
            color="secondary"
            style={{ marginTop: 50, float: "right" }}
            onClick={onAddClicked}
            disabled={emptyorundefined}
          >
            {" "}
            <AddCircle fontSize="large" />{" "}
          </IconButton>
        </CardContent>{" "}
      </Card>{" "}
      <Snackbar
        open={state.showMsg}
        message={state.snackbarMsg}
        autoHideDuration={4000}
        onClose={snackbarClose}
      />{" "}
    </MuiThemeProvider>
  );
};

export default ProjectComponent;
