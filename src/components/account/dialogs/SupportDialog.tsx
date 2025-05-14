import * as React from "react";
import { useContext } from "react";
import { DialogLayout } from "../../dialogs/dialog-layout/DialogLayout";
import { Avatar, List, ListItem, ListItemAvatar, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import MailIcon from "@mui/icons-material/Mail";
import { DialogProps } from "../../types/DialogProps";
import ListItemText from "@mui/material/ListItemText";
import CallIcon from "@mui/icons-material/Call";
import { supportInfo } from "../../../utils/clients";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { text } from "../../../utils/translation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      color: theme.palette.secondary.light,
    },
  })
);

export const SupportDialog: React.FC<DialogProps> = ({ open, handleClose }) => {
  const classes = useStyles();
  const { client } = useContext(ProjectInformationContext);

  const { mail, phone } = supportInfo(client || "");

  return (
    <DialogLayout
      title={text("account_support_title", client)}
      open={open}
      handleClose={handleClose}
      maxWidth="sm"
      showCloseButton
    >
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <MailIcon className={classes.avatar} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={mail} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CallIcon className={classes.avatar} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={phone} />
        </ListItem>
      </List>
    </DialogLayout>
  );
};
