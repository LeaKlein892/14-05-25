import * as React from "react";
import { useContext } from "react";
import { Menu, MenuItem } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { text } from "../../utils/translation";
import { webViewMode } from "../../utils/webview-messenger";
import PublishIcon from "@mui/icons-material/Publish";
import HelpIcon from "@mui/icons-material/Help";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { useHistory } from "react-router-dom";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { PopoverProps } from "@mui/material/Popover";
import { LogoutDialog } from "./dialogs/LogoutDialog";
import { SupportDialog } from "./dialogs/SupportDialog";
import { ProfileDialog } from "./dialogs/ProfileDialog";
import { UploadDialog } from "./dialogs/UploadDialog";

const useStyles = makeStyles(() =>
  createStyles({
    accountImg: {
      marginRight: "3px",
    },
  })
);

export interface AccountMenuContentProps {
  anchorEl?: PopoverProps["anchorEl"];
  handleClose: () => void;
}

const AccountMenuContent: React.FC<AccountMenuContentProps> = ({
  anchorEl,
  handleClose,
}) => {
  const classes = useStyles();
  const [logoutOpen, setLogoutOpen] = React.useState<boolean>(false);
  const [supportOpen, setSupportOpen] = React.useState<boolean>(false);
  const [profileOpen, setProfileOpen] = React.useState<boolean>(false);
  const [uploadOpen, setUploadOpen] = React.useState<boolean>(false);
  let history = useHistory();
  const open = Boolean(anchorEl);
  const { loggedUser } = useContext(LoggedUserContext);
  const { client } = useContext(ProjectInformationContext);

  const userIsLoggedIn = Boolean(loggedUser.id !== "");

  const handleCloseLogout = () => {
    setLogoutOpen(false);
    handleClose();
  };

  const handleCloseUpload = () => {
    setUploadOpen(false);
    handleClose();
  };

  const handleCloseSupport = () => {
    setSupportOpen(false);
    handleClose();
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    handleClose();
  };

  const handleProfile = async () => {
    if (!userIsLoggedIn) {
      history.push("/project");
      window.location.reload();
    } else {
      setProfileOpen(true);
    }
  };

  const handleSettings = () => {
    history.push("/settings");
    handleClose();
  };

  const handleScans = () => {
    history.push("/scans");
    handleClose();
  };

  const handleLogout = () => {
    setLogoutOpen(true);
  };

  const handleUpload = () => {
    setUploadOpen(true);
  };

  const handleSupport = () => {
    setSupportOpen(true);
  };

  return (
    <>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfile}>
          <AccountCircle className={classes.accountImg} />
          {userIsLoggedIn
            ? text("account_profile", client)
            : text("account_login", client)}
        </MenuItem>
        {webViewMode() && userIsLoggedIn && (
          <MenuItem onClick={handleUpload}>
            <PublishIcon className={classes.accountImg} />
            {text("account_upload", client)}
          </MenuItem>
        )}
        <MenuItem onClick={handleScans}>
          <VideoCallIcon className={classes.accountImg} />
          {text("account_scans", client)}
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <SettingsIcon className={classes.accountImg} />
          {text("account_setting", client)}
        </MenuItem>
        <MenuItem onClick={handleSupport}>
          <HelpIcon className={classes.accountImg} />
          {text("account_support", client)}
        </MenuItem>

        {userIsLoggedIn && (
          <MenuItem onClick={handleLogout}>
            <ExitToAppIcon className={classes.accountImg} />
            {text("account_logout", client)}
          </MenuItem>
        )}
      </Menu>
      <LogoutDialog open={logoutOpen} handleClose={handleCloseLogout} />
      <SupportDialog open={supportOpen} handleClose={handleCloseSupport} />
      <UploadDialog open={uploadOpen} handleClose={handleCloseUpload} />
      {profileOpen && (
        <ProfileDialog open={profileOpen} handleClose={handleCloseProfile} />
      )}
    </>
  );
};

export default AccountMenuContent;
