import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";

const DialogComp = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleCloseDialog}
      style={{ margin: 20 }}
    >
      <DialogTitle style={{ textAlign: "center" }}>{props.title}</DialogTitle>
      <DialogContent>{props.content}</DialogContent>
    </Dialog>
  );
};

export default DialogComp;
