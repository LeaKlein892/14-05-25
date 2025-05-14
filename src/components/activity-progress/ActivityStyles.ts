import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

const leftRecordButton = window.innerWidth - 350;
const userActivity = {
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    cursor: "pointer",
    color: "lightgray",
    boxShadow: "-5px -3px 5px rgba(0, 0, 0, 0.4)",
  },
};
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    completed: {
      backgroundColor: "green",
      ...userActivity,
    },
    notStarted: {
      backgroundColor: "red",
      ...userActivity,
    },
    inProgress: {
      backgroundColor: "orange",
      ...userActivity,
    },
    irrelevant: {
      backgroundColor: "grey",
      ...userActivity,
    },
    manuallyChangedPoint: {
      borderWidth: "6px",
      borderColor: "grey",
      borderStyle: "double",
    },
    invisiblePoint: {
      borderWidth: "6px",
      borderColor: "darkgrey",
      borderStyle: "dashed",
    },
    lastClickedPoint: {
      borderWidth: "7px",
      borderColor: "purple",
      borderStyle: "double",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
    },
    markedPoint: {
      borderWidth: "4px",
      borderColor: "black",
      borderStyle: "double",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.7)",
    },
    inlineContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(-4.5),
    },
    inlineContainerMobileMode: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(0),
      paddingBottom: 0,
    },
    selectCategory: {
      padding: "1px 2px",
      fontSize: "12px",
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
    },
    dialogBody: {
      marginLeft: "0px",
    },
    dialogText: {
      textAlign: "center",
      fontSize: "20px",
    },
    popper: {
      zIndex: 300,
    },
    menuList: {
      maxHeight: "500px",
      overflow: "auto",
    },
    splitButton: {
      marginLeft: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
      borderRadius: "15px",
      fontSize: "13px",
      color: "white",
      padding: "0px 0px",
      zIndex: 110,
      height: "30px",
    },
    OutersplitButton: {
      marginLeft: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
      borderRadius: "15px",
      fontSize: "13px",
      color: "white",
      padding: "0px 0px",
      zIndex: 1100,
      height: "32px",
      justifyContent: "center",
      alignItems: "center",
    },
    activitySelector: {
      backgroundColor: theme.palette.primary.main,
      marginLeft: theme.spacing(1),
      borderRadius: "15px",
      fontSize: "13px",
      color: "white",
      padding: "0px 0px",
      zIndex: 110,
      height: "30px",
    },
    clearButton: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      borderRadius: "15px !important",
      border: "none !important",
    },
    arrowButton: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      width: "5px",
      minWidth: "3px;",
    },
    blueIcon: {
      "& svg": {
        fill: "white",
      },
    },
    date: {
      width: "100%",
      whiteSpace: "nowrap",
      color: "black",
      backgroundColor: "transparent",
      textWidth: "bold",
      zIndex: 5,
    },
    averageHeader: {
      backgroundColor: "white",
      width: "100%",
      zIndex: 5,
      textDecoration: "underline",
    },
    averageRow: {
      fontWeight: "bold",
      borderBottom: "3px solid black !important",
    },
    link: {
      color: "black",
      backgroundColor: "transparent",
      textWidth: "bold",
      whiteSpace: "nowrap",
      textDecoration: "underline",
      cursor: "pointer",
      width: "100%",
      zIndex: 5,
    },
    tableHeader: {
      zIndex: 1,
      backgroundColor: "white",
    },
    dateAreaHeader: {
      zIndex: "11 !important",
    },
    button: {
      marginTop: theme.spacing(2),
    },
    tableContainer: {
      boxShadow: "none",
      overflowX: "initial",
      width: "100%",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
    },
    stickyHead: {
      position: "sticky",
      top: 0,
      zIndex: 11,
      backgroundColor: "white",
      fontWeight: "bold",
      width: "auto",
    },
    paneTable: {
      overflowY: "auto",
      overflowX: "auto",
      width: "100%",
      height: "90%",
      maxHeight: "90vh",
    },
    stickyArea: {
      position: "sticky",
      left: 0,
      zIndex: 10,
      color: "black",
      whiteSpace: "nowrap",
      backgroundColor: "white",
      textWidth: "bold",
      width: "0px",
    },
    root: {
      color: theme.palette.primary.main,
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    container: {
      height: "100%",
      position: "relative",
      marginBottom: "5px",
      width: "100%",
    },
    mapContainer: {
      height: "100%",
      position: "relative",
      width: "100%",
    },
    mobileContainer: {
      height: "100%",
      position: "relative",
      width: "100%",
      overflow: "hidden",
      marginTop: "80px",
      marginBottom: "0px",
    },
    dateOnMobileMode: {
      display: "none",
    },
    tableBeforeSplit: {
      overflowY: "auto",
      overflowX: "auto",
      width: "100%",
      maxHeight: "78vh",
    },
    splitPaneWrapper: {
      height: "87vh",
    },
    splitPaneStyle: {
      marginTop: "-50px",
    },
    spanDate: {
      display: "block",
    },
    spanDelayIcon: {
      display: "block",
      alignSelf: "start",
    },
    spanText: {
      display: "block",
      alignSelf: "center",
      width: "100%",
    },
    spanFix: {
      marginLeft: "17%",
    },
    cellContent: {
      display: "flex",
      height: "100%",
    },
    highSeverityIcon: {
      color: "#000000",
      height: "20px",
    },
    mediumSeverityIcon: {
      color: "#847e7e",
      height: "20px",
    },

    buttonTopRight: {
      position: "absolute",
      right: "260px",
      backgroundColor: theme.palette.primary.main,
      borderRadius: "15px",
      fontSize: "19px",
      color: "white",
      padding: "4px 4px",
      zIndex: 1100,
      height: "30px",
      width: "auto",
      marginTop: "-40px",
    },
    done: {
      color: "green",
    },
    inprogress: {
      color: "orange",
    },
    notstarted: {
      color: "red",
    },
    Irrelevant: {
      color: "grey",
    },
    statusContainer: {
      display: "flex",
      alignItems: "center",
      paddingBottom: "5px",
    },
    statusItem: {
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    divider: {
      width: "0.5px",
      height: "15px",
      borderColor: "black",
      orientation: "vertical",
    },
    number: {
      padding: theme.spacing(2),
    },
    title: {
      color: theme.palette.primary.main,
    },
    addBoxIcon: {
      paddingRight: theme.spacing(2),
      width: theme.spacing(6),
      color: theme.palette.primary.main,
    },
    paper: {
      display: "flex",
      flexWrap: "wrap",
      listStyle: "none",
      padding: 0.5,
      margin: 0,
    },
    checkIcon: {
      color: theme.palette.primary.main,
      padding: 0,
    },
    rightButtons: {
      marginLeft: "10px",
      marginTop: "-5px",
    },
    rightButtonContainer: {
      position: "absolute",
      marginTop: "-45px",
      right: "160px",
    },
    infoButton: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: "15px",
      fontSize: "19px",
      color: "white",
      padding: "4px 4px",
      zIndex: 1100,
      height: "33px",
      width: "auto",
      position: "absolute",
      marginTop: "-43px",
      whiteSpace: "nowrap",
      right: "60%",
    },
    anchorMapButton: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: "15px",
      fontSize: "19px",
      color: "white",
      padding: "4px 4px",
      zIndex: 1100,
      height: "33px",
      width: "auto",
      position: "absolute",
      marginTop: "-43px",
      whiteSpace: "nowrap",
      right: "55%",
    },
    MapButtons: {
      color: "white",
      backgroundColor: "blue",
      borderRadius: 30,
      fontSize: "33px",
    },
    aggregatedButton: {
      backgroundColor: "transparent",
      border: "none",
      "&:hover": {
        cursor: "pointer",
        color: "lightgray",
      },
    },
    aggregatedContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    aggregatedText: {
      fontWeight: "normal",
      fontSize: "19px",
      fontFamily: "Mukta, sans-serif",
    },
    aggregatedParent: {
      fontSize: "19px",
      fontFamily: "Mukta, sans-serif",
      lineHeight: "1",
    },
    editButton: {
      color: "white",
      backgroundColor: "blue",
      borderRadius: 10,
      marginRight: theme.spacing(75),
      display: "inline",
      fontFamily: "Arial, sans-serif",
      fontWeight: "lighter",
    },
    mapButtonsWarrper: {
      position: "absolute",
      zIndex: 999,
      top: 135,
      right: 27,
      borderRadius: 30,
      marginTop: "-3px",
    },
    mapButtonsMobileMode: {
      marginTop: "17px",
      right: 8,
    },
    nextClickedCell: {
      color: "lightgray",
      boxShadow: "-5px -3px 5px rgba(0, 0, 0, 0.8)",
    },
    box: {
      justifySelf: "end",
      width: "80%",
    },
    delayBox: {
      justifySelf: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingRight: "12px",
    },
    linearProgress: {
      height: "5px",
      width: "90%",
      justifySelf: "center",
    },
    linearProgressBox: {
      paddingBottom: "5px",
    },
    grid: { height: "100%" },
    progressTrend: {
      display: "flex",
      justifyContent: "space-between",
    },
    progressSelectorMapContainer: {
      paddingBottom: "10px",
    },
    progressSelectorContainer: {
      marginLeft: "80px",
      marginTop: "20px",
    },
    progressSelectorContainerMobileMode: {
      marginLeft: "10px",
      marginTop: "40px",
      marginBottom: "-10px",
    },
    activitySelectorContainer: {
      position: "absolute",
      marginTop: "27px",
      right: "160px",
    },
    activityProgressLoader: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    },
    activityProgressLoaderText: {
      color: "white",
      marginTop: 16,
    },
  })
);
