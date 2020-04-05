import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../styles/theme";

import UpdateSelection from "../components/UpdatePage/Update_Selection";

const UpdatePage = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <UpdateSelection />
      </div>
    </MuiThemeProvider>
  );
};

export default UpdatePage;
