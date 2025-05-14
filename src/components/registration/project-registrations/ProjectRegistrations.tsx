import * as React from "react";
import { useProjectRegistrations } from "../../../hooks/useProjectRegistrations";
import { useEffect, useMemo, useState } from "react";
import { PhotoTourPoints } from "../../../models";
import { compareDate, stringAsDMY } from "../../../utils/date-utils";
import ClosedIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { makeStyles } from "@mui/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { emptyArray } from "../../../utils/render-utils";

const extractSuffix = (id: string) => {
  const prefixPart = id.split("_")[0];
  return prefixPart ? prefixPart.slice(-2) ?? "0" : "0";
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
  },
  formControl: {
    margin: theme.spacing(13),
  },
  table: {
    margin: theme.spacing(5),
    display: "flex",
  },
  row: {
    cursor: "pointer",
  },
  closedIcon: {
    color: "red",
  },
  doneIcon: {
    color: "green",
  },
}));

const ProjectRegistrations: React.FC = () => {
  const [enterProjectId, setEnterProjectId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [showNoRegistrationsMessage, setShowNoRegistrationsMessage] =
    useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowNoRegistrationsMessage(true);
    }, 9000);

    return () => clearTimeout(timeoutId);
  }, []);

  const registrations = useProjectRegistrations(projectId);

  const sortedRegistrations = useMemo(() => {
    if (!registrations || registrations.length === 0) return emptyArray;

    const sorted = [...registrations].sort((a, b) => {
      const dateA = stringAsDMY(a.date!);
      const dateB = stringAsDMY(b.date!);
      return compareDate(dateA, dateB);
    });

    return sorted.slice(0, 200);
  }, [registrations]);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FormControl
        variant="standard"
        component="fieldset"
        className={classes.formControl}
      >
        <TextField
          id="custom-input"
          label="enter projectId"
          variant="outlined"
          fullWidth
          placeholder="enter projectId"
          onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
            setEnterProjectId(e?.target?.value)
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setProjectId(enterProjectId)}
        >
          Submit
        </Button>
        <div className={classes.table}>
          {projectId !== "" ? (
            registrations.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">ProjectId</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Area</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Building</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Suffix</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Registered</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Date</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedRegistrations.map((registration) => (
                    <TableRow
                      key={registration.id}
                      className={classes.row}
                      onClick={() =>
                        window.open(
                          `https://castory-app.com/registration?points=${registration.id}`,
                          "_blank"
                        )
                      }
                    >
                      <TableCell style={{ textAlign: "center" }}>
                        {registration.projectId}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {registration.area}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {registration.building}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {extractSuffix(registration.id)}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {registration.registered ? (
                            <DoneIcon className={classes.doneIcon} />
                          ) : (
                            <ClosedIcon className={classes.closedIcon} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {registration.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : showNoRegistrationsMessage ? (
              <p>No registrations found</p>
            ) : null
          ) : (
            <p>Enter project name to see the corresponding registrations</p>
          )}
        </div>
      </FormControl>
    </div>
  );
};

export default React.memo(ProjectRegistrations);
