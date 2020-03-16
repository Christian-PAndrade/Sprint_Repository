import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import theme from "../styles/theme";
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup
} from "@material-ui/core";

import ViewSubTask from "../components/ViewSubTask";
import ViewUserStory from "../components/ViewUserStory";

const ViewSelection = () => {
  const [radioSelected, setRadioSelected] = useState("projects");

  const handleRadioSelection = e => {
    setRadioSelected(e.target.value);
  };

  const RenderView = () => {
    if (radioSelected === "projects") return <div>View Project</div>;
    if (radioSelected === "boards") return <div>View Boards</div>;
    if (radioSelected === "users") return <div>View Users</div>;
    if (radioSelected === "userStories") return <ViewUserStory />;
    else return <ViewSubTask />;
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card
        style={{ marginTop: "5%", width: "90%" }}
        className={"CHANGE_ME_TOO"}
      >
        <CardHeader
          title="View Information"
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
          <RenderView />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

export default ViewSelection;
