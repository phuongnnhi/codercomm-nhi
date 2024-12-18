import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

export const ConfirmationDialog = ({open, onClose, onConfirm, title}) => {
return (
<Dialog
        open={open} 
        onClose={onClose}
      >
        <DialogTitle>{title || "Are you sure?"}</DialogTitle>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>)}