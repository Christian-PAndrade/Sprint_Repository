import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../styles/theme";
import ProjectComponent from "../components/ProjectsComponent";
import UserComponent from "../components/UserComponent";
import BoardComponent from "../components/BoardComponent";
import TaskComponent from "../components/TaskComponent";
import UserStoryComponent from "../components/UserStoryComponent";
import {
  Card,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

function CreatePage() {
  const [radioSelected, setRadioSelected] = useState("projects");

  const handleRadioSelection = (e) => {
    setRadioSelected(e.target.value);
  };

  const RenderUpdate = () => {
    if (radioSelected === "projects") return <ProjectComponent />;
    if (radioSelected === "boards") return <BoardComponent />;
    if (radioSelected === "users") return <UserComponent />;
    if (radioSelected === "userStories") return <UserStoryComponent />;
    else return <TaskComponent />;
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Card
          style={{ marginTop: "5%", width: "95%" }}
          className={"CHANGE_ME_TOO"}
        >
          <CardContent
            style={{
              display: "grid",
              gridTemplateColumns: "25% 75%",
              gridTemplateRows: "auto",
            }}
          >
            <div>
              <FormControl component="fieldset">
                <FormLabel>Choose What to Create:</FormLabel>
                <RadioGroup
                  aria-label="Choose what to create"
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <RenderUpdate />
            </div>
          </CardContent>
        </Card>
      </div>
    </MuiThemeProvider>
  );
}

export default CreatePage;
