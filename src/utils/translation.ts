import { GREENBOOK, JM, RAMDOR } from "./clients";

export type TextKey =
  | "plan"
  | "tour"
  | "comment"
  | "submit"
  | "options"
  | "cancel"
  | "delete"
  | "comment_create_title"
  | "comment_create"
  | "comment_created"
  | "comment_creation_failed"
  | "comment_edit"
  | "comment_delete"
  | "comment_delete_explained"
  | "comment_reopen"
  | "comment_resolve"
  | "comment_view"
  | "comment_replies"
  | "comment_plan_location"
  | "comment_fill_description"
  | "account_profile"
  | "account_support"
  | "account_setting"
  | "account_scans"
  | "account_support_title"
  | "account_upload"
  | "account_upload_title"
  | "account_upload_content"
  | "account_logout"
  | "account_login"
  | "upload_image"
  | "upload_media"
  | "match_image"
  | "upload_videos"
  | "publish_tour"
  | "options"
  | "add_scan_before";

const mapTextKeyToLang = new Map<TextKey, string[]>([
  ["plan", ["Plan", "תכנית"]],
  ["tour", ["Tour", "סיור"]],
  ["comment", ["Comment", "הערה"]],
  ["options", ["Options", "אפשרויות"]],
  ["submit", ["Submit", "אישור"]],
  ["cancel", ["Cancel", "ביטול"]],
  ["delete", ["Delete", "מחיקה"]],
  [
    "comment_fill_description",
    ["Please fill description field", "אנא מלאו את תיאור המשימה"],
  ],
  ["comment_create", ["Create comment", "יצירת הערה"]],
  ["comment_created", ["Comment created successfully", "הערה נוצרה בהצלחה"]],
  [
    "comment_creation_failed",
    ["Failed to create comment. ", "שגיאה ביצירת הערה. "],
  ],
  [
    "comment_create_title",
    ["Please comment in the form below:", "צור הערה בטופס הבא:"],
  ],
  ["comment_edit", ["Edit comment", "עריכת הערה"]],
  ["comment_delete", ["Delete comment", "למחוק את ההערה"]],
  [
    "comment_delete_explained",
    [
      "This will permanently remove the comment you have placed",
      "פעולה זאת תמחק לצמיתות את ההערה שסומנה",
    ],
  ],

  ["comment_reopen", ["Re-open", "פתיחה מחדש"]],
  ["comment_resolve", ["Resolve", "בוצע"]],
  ["comment_replies", ["Replies", "תגובות"]],
  ["comment_plan_location", ["View plan location", "פתיחת מיקום בתכנית"]],
  ["comment_view", ["Comment from ", "הערה מאת "]],
  ["account_support", ["Support", "תמיכה"]],
  ["account_setting", ["Settings", "הגדרות"]],
  ["account_scans", ["Scans", "סריקות"]],
  ["account_support_title", ["Need some help?", "צריכים עזרה?"]],
  ["account_upload", ["Upload", "העלאה"]],
  [
    "account_upload_title",
    ["Upload your captured video files", "העלאת קבצי הוידאו שצולמו"],
  ],
  [
    "account_upload_content",
    [
      'Please connect to your camera\'s wifi network in order to upload the video files. WiFi name ends with ".OSC", password is usually 88888888 (8 times 8).',
      "אנא התחברו לרשת ה wifi של המצלמה על מנת להעלות את קבצי הוידאו.",
    ],
  ],
  ["account_profile", ["Profile", "פרופיל"]],
  ["account_login", ["Login", "התחברות"]],
  ["account_logout", ["Logout", "התנתקות"]],
  ["options", ["Options", "אפשרויות"]],
  ["upload_image", ["Upload Image", "העלאת תמונה"]],
  ["upload_media", ["Upload Media", "העלאת תמונה או וידאו"]],
  ["match_image", ["Match Point", "התאמת נקודה"]],
  ["upload_videos", ["Upload camera videos", "העלאת וידאו מהמצלמה"]],
  ["publish_tour", ["Publish photo documentation", "צור תיעוד מהתמונות"]],
  [
    "add_scan_before",
    [
      "By clicking OK, you will be taken to select a floor to add a scan before the current record",
      "בלחיצה על אישור תועבר לבחירת קומה להוספת סריקה לפני ההוספה הנוכחית",
    ],
  ],
]);

const hebrewClients = [RAMDOR, GREENBOOK, JM];

const clientToLangArrayIndex = (client: string | undefined) => {
  if (client === undefined) {
    return 0;
  }
  if (hebrewClients.includes(client)) {
    return 1;
  }
  return 0;
};

const text = (textKey: TextKey, client?: string) => {
  const langIndex = clientToLangArrayIndex(client);
  const langValues = mapTextKeyToLang.get(textKey);
  return langValues ? langValues[langIndex] : "";
};

export { text };
