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

const UserComponent = () => {
  const classes = useStyles();
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    name: "",
    isAdmin: false,
    users: []
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const onAddClicked = async () => {
    let user = { name: state.name, isAdmin: state.isAdmin };
    let userStr = JSON.stringify(user);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    try {
      let response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: myHeaders,
        body: userStr
      });
      let json = await response.json();
      setState({
        showMsg: true,
        snackbarMsg: json.msg,
        name: "",
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

  const handleAdminInput = e => {
    let isAdmin = parseInt(e.target.value);
    isAdmin == true ? setState({ isAdmin: isAdmin }) : setState({ isAdmin: false });
  };

  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.age === undefined ||
    state.isAdmin === false;


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
          title="Add A User"
          color="inherit"
          style={{ textAlign: "center" }}
        />{" "}
        <CardContent>
          {" "}
          <TextField
            onChange={handleNameInput}
            helperText="Enter user's name here"
            value={state.name}
          />{" "}
          <br />{" "}
          <TextField
            onChange={handleAdminInput}
            helperText="Is the user an admin?"
            value={state.isAdmin}
          />{" "}
          <br />
          <br />
          <Typography>Find a user in the system: </Typography>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} htmlFor="outlined-age-native-simple">
              User Name
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
          <br /> <br />{" "}
          <IconButton
            color="secondary"
            style={{ marginTop: 50, float: "right" }}
            onClick={onAddClicked}
            disabled={emptyorundefined}
          >
            {" "}
            <AddCircle fontSize="large" />{" "}
          </IconButton>
          <Snackbar
            open={state.showMsg}
            message={state.snackbarMsg}
            autoHideDuration={4000}
            onClose={snackbarClose}
          />{" "}
        </CardContent>{" "}
      </Card>{" "}
    </MuiThemeProvider>
  );
};

export default UserComponent;
