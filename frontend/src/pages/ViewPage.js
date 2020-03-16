import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../styles/theme";

import ViewSelection from "../components/View_Selection";

const ViewPage = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <ViewSelection />
      </div>
    </MuiThemeProvider>
  );
};

export default ViewPage;
