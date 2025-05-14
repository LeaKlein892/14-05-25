import dayjs from "dayjs";
import { getDateFromNow } from "../utils/date-utils";

type TimedSessionKey =
  | "INSTALL_PWA"
  | "VIDEO_UPLOADED"
  | "SHOWED_SCAN_INSTRUCTIONS"
  | "ADD_SCAN_TIME"
  | "INDEX_TO_ADD_BEFORE"
  | "CURRENT_PROJECT"
  | "LAST_SELECTED_ROW"
  | "SCAN_SAVED_OFFLINE"
  | "PROJECT_NAME_OF_SCANS_SAVED_OFFLINE";

type GenericSessionKey = "SELECTED_PROJECT";
type SessionKey = GenericSessionKey | TimedSessionKey;
const isLocalStorageSupported = "localStorage" in window;

function setStorageKeyValue(key: SessionKey, value: string) {
  if (!isLocalStorageSupported) return;
  localStorage.setItem(key, value);
}

function setStorageKeyTime(key: TimedSessionKey) {
  const today = dayjs().toDate().toString();
  setStorageKeyValue(key, today);
}

function getStorageKeyValue(key: SessionKey) {
  if (!isLocalStorageSupported) return undefined;
  return localStorage.getItem(key);
}

function deleteStorageKeyValue(key: SessionKey) {
  if (!isLocalStorageSupported) return;
  localStorage.removeItem(key);
}

function timeDiffFromToday(key: TimedSessionKey) {
  if (!isLocalStorageSupported) return NaN;
  const today = dayjs().toDate();
  const lastStoredValue = dayjs(localStorage.getItem(key));
  return dayjs(today).diff(lastStoredValue, "days");
}

function isTimeExceedingDays(key: TimedSessionKey, days: number) {
  const daysPassed = timeDiffFromToday(key);
  return isNaN(daysPassed) || daysPassed > days;
}
function setStorageWithExpiration(key: TimedSessionKey) {
  const expirationTime = getDateFromNow(1);
  localStorage.setItem(key, expirationTime.toString());
}

export {
  setStorageKeyTime,
  setStorageKeyValue,
  getStorageKeyValue,
  deleteStorageKeyValue,
  timeDiffFromToday,
  isTimeExceedingDays,
  setStorageWithExpiration,
};
