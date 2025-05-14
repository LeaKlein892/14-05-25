import * as React from "react";
import { DialogLayout } from "../dialogs/dialog-layout/DialogLayout";
import { DialogProps } from "../types/DialogProps";
import { DialogContent, CircularProgress, Typography } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { gantt } from "dhtmlx-gantt";
import { transformTasksForGantt } from "./progress-operations";
import { useMsProjectSnapshot } from "../../hooks/useMsProjectSnapshot";

export interface ProgressGanttFormProps extends DialogProps {
  project: string;
  mobileMode?: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    ganttContainer: {
      width: "100%",
      position: "relative",
      flex: 1,
      backgroundColor: "#fff",
      minHeight: 600,
      border: "1px solid #ddd",
      borderRadius: "4px",
      height: "calc(100vh - 150px)", // Fixed height with room for header
      "& .gantt_grid_scale, .gantt_task_scale": {
        position: "sticky",
        top: 0,
        zIndex: 10, // Increased z-index to ensure headers stay on top
        backgroundColor: "#fff",
      },
      "& .gantt_grid": {
        overflow: "hidden", // Changed from visible to hidden
      },
      "& .gantt_task_line": {
        borderRadius: "4px",
      },
      "& .gantt_task_line.has_lag": {
        borderColor: "#ff9800",
        backgroundColor: "#ffb74d",
      },
      "& .gantt_task_line.critical_task": {
        backgroundColor: "#ef5350",
        borderColor: "#d32f2f",
      },
      "& .gantt_layout_content": {
        overflow: "auto !important", // Force scrolling
      },
      "& .gantt_grid_data, & .gantt_task_bg": {
        overflow: "hidden", // Changed from visible to hidden
      },
      "& .gantt_data_area": {
        overflow: "hidden", // Added to ensure proper rendering during scroll
      },
      "& .gantt_task_bg": {
        position: "relative", // Added to ensure proper positioning
      },
    },
    dialogContent: {
      padding: 0,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f5f5f5",
      overflow: "auto", // Changed from hidden to auto to allow scrolling
      height: "100%", // Take full height
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: "16px",
    },
    errorContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      padding: "24px",
      textAlign: "center",
      color: "#d32f2f",
    },
  })
);

const ProgressGanttForm: React.FC<ProgressGanttFormProps> = ({
  project,
  open = false,
  handleClose,
  mobileMode = false,
}) => {
  const classes = useStyles();
  const ganttContainer = React.useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const { msProjectSnapshot, loading, error } = useMsProjectSnapshot(project);

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const initializeGantt = React.useCallback(() => {
    if (!ganttContainer.current || !open || !msProjectSnapshot?.tasks) return;

    try {
      // Basic configuration
      gantt.config.date_format = "%Y-%m-%d";
      gantt.config.min_column_width = 80;
      gantt.config.row_height = 35;
      gantt.config.fit_tasks = false; // Disable auto-fit to allow scrolling
      gantt.config.show_progress = true;
      gantt.config.scale_height = 50;
      gantt.config.font_family = "Arial, sans-serif";
      gantt.config.autosize = "n"; // Disable autosize to enable scrolling

      // Use proper typing now instead of type assertions
      gantt.config.smart_rendering = true; // Enable smart rendering for better scrolling performance
      gantt.config.smart_scales = true; // Enable smart scales for better header rendering
      gantt.config.show_task_cells = true; // Show task cells for better visibility
      gantt.config.static_background = true; // Use static background for better performance

      // Configure time scale
      gantt.config.scales = [
        { unit: "month", step: 1, format: "%F, %Y" },
        { unit: "week", step: 1, format: "Week #%W" },
      ];

      // Configure columns with proper typing
      gantt.config.columns = [
        { name: "text", label: "Task name", tree: true, width: 300 },
        { name: "start_date", label: "Start", align: "center", width: 120 },
        { name: "duration", label: "Duration", align: "center", width: 120 },
        {
          name: "totalSlack",
          label: "Total Slack",
          align: "center",
          width: 100,
          template: (task) => (task.totalSlack ? task.totalSlack + "d" : ""),
        },
      ];

      // Add task and link templates using proper typing
      gantt.templates.task_class = (start: Date, end: Date, task: any) => {
        let classes = [];
        if (task.totalSlack === 0) {
          classes.push("critical_task");
        }
        return classes.join(" ");
      };

      gantt.templates.link_class = (link: any) => {
        return link.lag ? "has_lag" : "";
      };

      // Initialize Gantt
      gantt.init(ganttContainer.current);

      const { data, links } = transformTasksForGantt(msProjectSnapshot.tasks);
      gantt.parse({ data, links });

      gantt.showDate(new Date());

      // Add event listener for lightbox display to fix z-index issues
      gantt.attachEvent("onLightbox", () => {
        const lightbox = document.querySelector(
          ".gantt_cal_light"
        ) as HTMLElement;
        if (lightbox) {
          const rect = lightbox.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft;

          lightbox.style.zIndex = "999999";
          lightbox.style.position = "fixed";
          lightbox.style.top = `${rect.top}px`;
          lightbox.style.left = `${rect.left}px`;

          // Move to body
          document.body.appendChild(lightbox);
        }
      });

      // Add event listener for lightbox close to clean up
      const afterLightboxId = gantt.attachEvent("onAfterLightbox", () => {
        // Find any lightbox elements that might be left in the body
        const lightboxes = document.querySelectorAll(".gantt_cal_light");
        lightboxes.forEach((lightbox) => {
          // If the lightbox is a direct child of the body, remove it
          if (lightbox.parentElement === document.body) {
            document.body.removeChild(lightbox);
          }
        });
      });

      // Add a render event handler to ensure proper rendering
      gantt.attachEvent("onGanttRender", () => {
        // Force a redraw of the grid data to ensure all rows are visible
        const gridData =
          ganttContainer.current?.querySelector(".gantt_grid_data");
        if (gridData) {
          (gridData as HTMLElement).style.display = "none";
          setTimeout(() => {
            if (gridData) {
              (gridData as HTMLElement).style.display = "";
            }
          }, 0);
        }
      });

      // Force an initial render after a short delay to ensure all elements are properly displayed
      setTimeout(() => {
        gantt.render();
      }, 200);

      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing Gantt chart:", error);
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, 500 * Math.pow(2, retryCount)); // Exponential backoff
      }
    }
  }, [open, retryCount, msProjectSnapshot]);

  React.useEffect(() => {
    if (!isInitialized && open && msProjectSnapshot) {
      // Add a small delay before initialization
      const initTimeout = setTimeout(() => {
        initializeGantt();
      }, 100);

      return () => {
        clearTimeout(initTimeout);
      };
    }
  }, [isInitialized, open, initializeGantt, msProjectSnapshot]);

  // Cleanup when component unmounts or dialog closes
  React.useEffect(() => {
    return () => {
      if (isInitialized) {
        try {
          // Detach event listeners to prevent memory leaks
          try {
            gantt.detachEvent("onGanttRender");
            gantt.detachEvent("onLightbox");
            gantt.detachEvent("onAfterLightbox");
          } catch (e) {
            console.error("Error detaching Gantt event:", e);
          }

          gantt.clearAll();
          setIsInitialized(false);
          setRetryCount(0);
        } catch (error) {
          console.error("Error cleaning up Gantt chart:", error);
        }
      }
    };
  }, [isInitialized]);

  React.useEffect(() => {
    if (!isInitialized) return;

    const handleResize = () => {
      gantt.render();
    };

    // Create a debounced version of the scroll handler to prevent too many re-renders
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        // Force re-render of the gantt chart when scrolling to prevent rows from disappearing
        if (ganttContainer.current) {
          gantt.render();
        }
      }, 100); // 100ms debounce time
    };

    // Add event listeners
    window.addEventListener("resize", handleResize);

    // Find the gantt scrollable elements and add scroll event listeners
    if (ganttContainer.current) {
      const scrollableElements = ganttContainer.current.querySelectorAll(
        ".gantt_layout_content"
      );
      scrollableElements.forEach((element) => {
        element.addEventListener("scroll", handleScroll);
      });
    }

    return () => {
      // Remove event listeners
      window.removeEventListener("resize", handleResize);

      if (ganttContainer.current) {
        const scrollableElements = ganttContainer.current.querySelectorAll(
          ".gantt_layout_content"
        );
        scrollableElements.forEach((element) => {
          element.removeEventListener("scroll", handleScroll);
        });
      }

      // Clear any pending timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isInitialized]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress />
          <Typography variant="body1">Loading project data...</Typography>
        </div>
      );
    }

    if (error) {
      return (
        <div className={classes.errorContainer}>
          <Typography variant="h6">Error loading project data</Typography>
          <Typography variant="body1">{error.message}</Typography>
        </div>
      );
    }

    if (!msProjectSnapshot) {
      return (
        <div className={classes.errorContainer}>
          <Typography variant="body1">No project data available</Typography>
        </div>
      );
    }

    return <div ref={ganttContainer} className={classes.ganttContainer} />;
  };

  return (
    <DialogLayout
      title="Project Gantt Chart"
      handleClose={handleClose}
      open={open}
      maxWidth="xl"
      fullScreen={mobileMode}
      showCloseButton
      scroll="paper"
    >
      <DialogContent
        className={classes.dialogContent}
        dividers
        tabIndex={-1}
        ref={descriptionElementRef}
      >
        {renderContent()}
      </DialogContent>
    </DialogLayout>
  );
};

export default ProgressGanttForm;
