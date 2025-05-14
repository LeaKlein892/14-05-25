import React, { useContext, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  useMediaQuery,
  CircularProgress,
  Typography,
} from "@mui/material";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { usePlanInitialPoints } from "../../../hooks/usePlanInitialPoints";
import { PlanInitialPoint } from "../../../models";
import { ScanInitialPointDialog } from "./ScanInitialPointDialog";
import Fab from "@mui/material/Fab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(13),
    marginRight: "auto",
    marginLeft: "auto",
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      width: "90%",
    },
  },
  backFab: {
    position: "fixed",
    top: theme.spacing(10),
    left: theme.spacing(2),
  },
  table: {
    color: theme.palette.primary.main,
  },
  clickableRow: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const Scans = () => {
  let history = useHistory();
  const classes = useStyles();
  const {
    loggedUser: { username },
  } = useContext(LoggedUserContext);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [scanInitialPoint, setScanInitialPoint] = useState<PlanInitialPoint>();

  const mobileMode = useMediaQuery("(max-width: 960px)", { noSsr: true });

  const { planInitialPoints, loading, error } = usePlanInitialPoints(username);

  const handleClickHome = () => {
    history.push("/project");
  };

  const handleRowClick = (ScanInitialPoint: PlanInitialPoint) => {
    setScanInitialPoint(ScanInitialPoint);
    setIsDialogOpen(true);
  };

  const handleCloseFunction = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className={classes.root}>
      <FormControl
        variant="standard"
        component="fieldset"
        className={classes.formControl}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Scan date</TableCell>
              <TableCell>Marked floors</TableCell>
            </TableRow>
          </TableHead>
          {loading && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {error && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="error">Error loading scans</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {!loading && !error && (
            <TableBody>
              {planInitialPoints.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className={classes.clickableRow}
                >
                  <TableCell>{item.id?.split("_")[0]}</TableCell>
                  <TableCell>{item.id?.split("_")[1]}</TableCell>
                  <TableCell>{item.scanRecords?.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>

        {isDialogOpen && (
          <ScanInitialPointDialog
            fileName="myFileName"
            open={true}
            mobileMode={mobileMode}
            handleClose={handleCloseFunction}
            ScanInitialPoint={scanInitialPoint}
          />
        )}
      </FormControl>

      <Tooltip
        disableInteractive
        title={"Back to projects list"}
        placement={"right"}
        enterDelay={400}
        enterNextDelay={400}
      >
        <Fab
          variant="extended"
          color="primary"
          className={classes.backFab}
          onClick={handleClickHome}
        >
          <ArrowBackIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default Scans;
