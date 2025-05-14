import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DialogProps } from "../../types/DialogProps";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { DialogLayout } from "../../dialogs/dialog-layout/DialogLayout";
import { API, graphqlOperation } from "aws-amplify";
import { updateUserProfile } from "../../../graphql/mutations";
import { RoleSelect } from "../../role-select/RoleSelect";
import { analyticsError, analyticsEvent } from "../../../utils/analytics";
import { showMessage } from "../../../utils/messages-manager";

export const ProfileDialog: React.FC<DialogProps> = ({
  open = false,
  handleClose,
}) => {
  const { loggedUser, setLoggedUser } = useContext(LoggedUserContext);

  const { username, role, phoneNumber, email, id } = loggedUser;

  const [formRole, setFormRole] = useState(role);

  useEffect(() => {
    setFormRole(role);
  }, [role]);

  const updateUserRole = useCallback(() => {
    return new Promise((res, rej) => {
      if (formRole !== "" && formRole !== role) {
        (
          API.graphql(
            graphqlOperation(updateUserProfile, {
              input: {
                id,
                role: formRole,
              },
            })
          ) as Promise<any>
        )
          .then(() => {
            setLoggedUser((prevState) => ({
              ...prevState,
              role: formRole,
            }));
            res("Role was updated successfully");
          })
          .catch((e) => {
            console.log("Error in  GQL: ", e);
            rej("Failed to set role: " + e.toString());
          });
      } else {
        res("Role should not be updated");
      }
    });
  }, [formRole, role, id, setLoggedUser]);

  useEffect(() => {
    if (formRole && formRole !== "") {
      updateUserRole()
        .then(() => {
          showMessage("Role changed successfully", "success");
        })
        .catch((err) => {
          showMessage("Failed to change role, try again later", "error");
          analyticsError("Failed to update role: " + JSON.stringify(err));
        });
    }
  }, [formRole, updateUserRole]);

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    analyticsEvent("Account", "User Role Changed", username);
    setFormRole(event.target.value as string);
  };

  return (
    <DialogLayout
      title="Profile Details"
      open={open}
      handleClose={handleClose}
      maxWidth="md"
      showCloseButton
    >
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              variant="standard"
              size="small"
              id="name"
              value={username}
              label="User name"
              type="input"
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="standard"
              size="small"
              id="name"
              value={email}
              label="Email"
              type="input"
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="standard"
              size="small"
              id="name"
              value={phoneNumber}
              label="Phone number"
              type="input"
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="age-native-simple">Role</InputLabel>
              <RoleSelect
                value={formRole}
                disabled={!id}
                onChange={handleRoleChange}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
    </DialogLayout>
  );
};
