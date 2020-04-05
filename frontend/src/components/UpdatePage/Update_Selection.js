import React, { useReducer, useEffect, useState } from "react";
import { MuiThemeProvider, RadioGroup, Radio } from "@material-ui/core";
import theme from "../../styles/theme";
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import UpdateProject from "./UpdateProject";
import UpdateBoards from "./UpdateBoards";
import UpdateUsers from "./UpdateUsers";
import UpdateUserStory from "./UpdateUserStory";
import UpdateSubTask from "./UpdateSubTask";

const UpdateSelection = () => {
  const [radioSelected, setRadioSelected] = useState("projects");

  const handleRadioSelection = (e) => {
    setRadioSelected(e.target.value);
  };

  const RenderUpdate = () => {
    if (radioSelected === "projects") return <UpdateProject />;
    if (radioSelected === "boards") return <UpdateBoards />;
    if (radioSelected === "users") return <UpdateUsers />;
    if (radioSelected === "userStories") return <UpdateUserStory />;
    else return <UpdateSubTask />;
  };

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
            gridTemplateRows: "auto",
          }}
        >
          <div>
            <FormControl component="fieldset">
              <FormLabel>Choose What to Display:</FormLabel>
              <RadioGroup
                aria-label="Choose what to display"
                name="choose_display"
                value={radioSelected}
                onChange={handleRadioSelection}
              >
                <FormGroup>
                  <FormControlLabel
                    value="projects"
                    control={<Radio />}
                    label="Projects"
                  />
                  <FormControlLabel
                    value="users"
                    control={<Radio />}
                    label="Users"
                  />
                  <FormControlLabel
                    value="boards"
                    control={<Radio />}
                    label="Boards"
                  />
                  <FormControlLabel
                    value="userStories"
                    control={<Radio />}
                    label="User Stories"
                  />
                  <FormControlLabel
                    value="tasks"
                    control={<Radio />}
                    label="Tasks"
                  />
                </FormGroup>
              </RadioGroup>
            </FormControl>
          </div>
          <RenderUpdate />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

export default UpdateSelection;
