import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../styles/theme";

const UpdatePage = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {/* <UpdateSelection /> */}
        Update Component
      </div>
    </MuiThemeProvider>
  );
};

export default UpdatePage;
