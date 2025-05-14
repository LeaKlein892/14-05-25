import ga from "react-ga4";
import { hotjar } from "react-hotjar";
import { init, withProfiler } from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { isDev } from "./current-env";

// Analytics events types

export type analyticsEventType =
  | "Project"
  | "Plan"
  | "Progress"
  | "Account"
  | "Navigation"
  | "Tour"
  | "Tasks";

// Analytics events actions

export type analyticsProjectActions =
  | "Project Area Selected"
  | "Project Selected"
  | "Project Invitation Created"
  | "Scan dates filtered"
  | "User Joined Project"; // should it be in account?

export type analyticsPlanActions =
  | "Plan Downloaded"
  | "Plan Upload Completed"
  | "Plan Upload Button Clicked"
  | "Show Plan Annotations"
  | "Hide Plan Annotations"
  | "Plan Zoom Changed"
  | "Focus To Current Scene"
  | "Plan Annotation Link Clicked"
  | "Plan Annotation Link Clicked Normal Image"
  | "Plan Map Annotation Link Clicked"
  | "Plan Map Annotation Link Clicked Normal Image"
  | "Plan Map Annotation Link Clicked Video"
  | "Plan Annotation Link Clicked Video"
  | "Plan TitleBar Switched"
  | "Scan Started"
  | "360 image uploaded"
  | "Normal image uploaded"
  | "Video uploaded"
  | "Multiple Media Uploaded"
  | "Multiple Images Uploaded From The Main Plan"
  | "360 image tour published"
  | "Floor Switched in plan"
  | "Building Switched in plan"
  | "Date Switched in plan"
  | "Failed to switch Floor/Building/Date in tour"
  | "Plan Map Closed"
  | "Plan Map Opened"
  | "Plan Map Dragged"
  | "Plan Map Resized"
  | "Bim Model Set Open From Plan - On"
  | "Bim Model Set Open From Plan - Off"
  | "Plan Zoomable Image Paginated";

export type analyticsProgressActions =
  | "Project View Mode Toggled"
  | "Clicking Cell"
  | "Show Incompleted Areas"
  | "Date Complete Tour"
  | "Edit Area Status"
  | "Clicking Map Anchor Point"
  | "Clicking Map Anchor Point To Edit"
  | "Navigate To Date From Progress"
  | "Filter Progress By Building"
  | "Filter Progress By Floor"
  | "Export Progress"
  | "Filter Progress Captures"
  | "Change Progress Date"
  | "Change Progress Past Date"
  | "Change Progress View Mode"
  | "Progress Full Screen Mode"
  | "Progress Activity Planned Dates Table"
  | "Switching Progress Activity"
  | "Progress Activity Menu Opened"
  | "Progress Activity Expected Delays"
  | "Progress Gantt Chart"
  | "Progress Component Form Opened";

export type analyticsAccountActions =
  | "User Profile Created"
  | "User Role Changed"
  | "User Upload Confirmed"
  | "User Updated Mail Settings"
  | "User Signed Out";

export type analyticsTourActions =
  | "Scene Changed from sidebar"
  | "Scene Renamed"
  | "Floor Switched in tour"
  | "Building Switched in tour"
  | "Date Switched in tour"
  | "Failed to switch Floor/Building/Date in tour"
  | "Pano Zoom In"
  | "Pano Zoom Out"
  | "Tasks List Opened"
  | "Tour shared by copy link"
  | "Tour shared by WhatsApp"
  | "Tour shared by mail"
  | "Tour exported as image"
  | "Tour image sketch undo"
  | "Tour image sketch redo"
  | "Tour report generated"
  | "Link Hotspot Clicked"
  | "Fast Mode Arrow Clicked With Ctrl"
  | "Fast Mode Arrow Clicked With Switch ON"
  | "Fast Mode Toggled - ON"
  | "Fast Mode Toggled - OFF"
  | "Fast Mode Side Rotation"
  | "Link Hotspot Created"
  | "Link Hotspot Updated"
  | "Link Hotspot Deleted"
  | "Past Tour Opened"
  | "Past Tour Closed"
  | "Past Tour was not found"
  | "Tour Compared to Bim Opened"
  | "Tour Compared to Bim Closed"
  | "Split Views Unlocked"
  | "Split Views Locked"
  | "Tour TitleBar Switched";

export type analyticsTasksActions =
  | "Comment Hotspot Clicked"
  | "Tasks Searched"
  | "Tasks Filtered by IssueType"
  | "Tasks Filtered by Name"
  | "Tasks Filtered by Resolved"
  | "Tasks Filtered by Floor"
  | "Tasks Filtered by Building"
  | "Tasks Filtered by Role"
  | "Tasks Filtered - Filter Not Implemented!"
  | "Tasks Exported As Xlsx"
  | "Task Deleted"
  | "Task Created"
  | "Task Created During Tour"
  | "Task Edited"
  | "Task Resolved"
  | "Task UnResolved"
  | "Task Reply Added"
  | "Task Reply Removed"
  | "Task Image Viewed"
  | "Task Image Uploaded"
  | "Task Viewed"
  | "Task Plan Location Viewed"
  | "Tasks TitleBar Switched"
  | "Tasks Shared From Comment Dialog"
  | "Tasks Shared From Tasks List"
  | "Tasks Tour Report Form Opened"
  | "Tasks Show Image From List";

export type analyticsNavigationActions = "Logo Icon Clicked";

export type analyticsEventAction =
  | analyticsProjectActions
  | analyticsPlanActions
  | analyticsProgressActions
  | analyticsNavigationActions
  | analyticsTourActions
  | analyticsAccountActions
  | analyticsTasksActions;

const initAnalytics = () => {
  if (!isDev()) {
    ga.initialize("G-7C4CN8556E");
    hotjar.initialize(2218913, 6);
    init({
      dsn: "https://b8d13866fcb14425b805507699da5147@o1369433.ingest.sentry.io/6672481",
      integrations: [new BrowserTracing()],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.2,
    });
  }
};

const analyticsPage = (pageRoute: string) => {
  if (!isDev()) {
    ga.send(pageRoute);
  }
};

const analyticsEvent = (
  category: analyticsEventType,
  action: analyticsEventAction,
  label: string,
  value?: number
) => {
  if (!isDev()) {
    ga.event({ category, action, label, value });
  }
};

const analyticsError = (description: string, fatal: boolean = false) => {
  if (!isDev()) {
    ga.event("exception", { description, fatal });
  }
};

const withSentryProfiler = !isDev() ? withProfiler : (x: any) => x;

export {
  initAnalytics,
  analyticsPage,
  analyticsEvent,
  analyticsError,
  withSentryProfiler,
};
