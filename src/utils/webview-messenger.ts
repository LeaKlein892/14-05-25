import { emptyFn } from "./render-utils";
import { Dispatch, SetStateAction } from "react";

type WebViewMessage = "START_RECORDING" | "STOP_RECORDING" | WifiState;

type WifiState = "DISABLE_WIFI" | "ENABLE_WIFI" | "CONNECT_WIFI";
const LOADER_STARTS = "LOADER_STARTS";
const LOADER_ENDS = "LOADER_ENDS";
const CURRENT = "CURRENT";
const TOTAL = "TOTAL";
const PROJECT_PREF = "PROJECT";
const COPY_PREF = "COPY";
const WA_PREF = "WHATSAPP";
const MAIL_PREF = "MAIL";
const SEPARATOR = "-";

interface NativeCallbacks {
  startLoader: () => void;
  stopLoader: () => void;
  setCurrentTask: Dispatch<SetStateAction<number | undefined>>;
  setTotalTasks: Dispatch<SetStateAction<number | undefined>>;
}

let nativeCallbacks: NativeCallbacks = {
  startLoader: emptyFn,
  stopLoader: emptyFn,
  setCurrentTask: emptyFn,
  setTotalTasks: emptyFn,
};

const getMessageIntValue = (message: string) =>
  parseInt(message.split(SEPARATOR)[1]);

function subscribeToNativeMessages(callbacks: NativeCallbacks) {
  if (!webViewMode()) return;
  nativeCallbacks = callbacks;
  const w = window as any;
  w.messageFromNative = onNativeMessage;
}

function onNativeMessage(message: string) {
  const {
    startLoader,
    stopLoader,
    setCurrentTask,
    setTotalTasks,
  } = nativeCallbacks;
  if (message === LOADER_STARTS) {
    startLoader();
  } else if (message === LOADER_ENDS) {
    stopLoader();
  } else if (message.startsWith(CURRENT)) {
    setCurrentTask(getMessageIntValue(message));
  } else if (message.startsWith(TOTAL)) {
    setTotalTasks(getMessageIntValue(message));
  }
}

function sendToJSBridge(message: string) {
  const w = window as any;
  w && w.JSBridge && w.JSBridge.showMessageInNative(message);
}

function sendMessage(message: WebViewMessage) {
  sendToJSBridge(message);
}

function sendSelectedProject(projectId: string) {
  sendToJSBridge(`${PROJECT_PREF}_${projectId}`);
}

function sendCopyText(message: string) {
  sendToJSBridge(`${COPY_PREF}_${message}`);
}

function sendMail(subject: string, message: string) {
  sendToJSBridge(`${MAIL_PREF}_${subject}_${message}`);
}

function sendWhatsapp(message: string) {
  sendToJSBridge(`${WA_PREF}_${message}`);
}

function webViewMode(): boolean {
  const w = window as any;
  return w && w.JSBridge;
}

function sendRecord() {
  sendMessage("START_RECORDING");
}

function sendWifiCommand(state: WifiState) {
  sendMessage(state);
}

export {
  sendRecord,
  webViewMode,
  sendWifiCommand,
  sendSelectedProject,
  subscribeToNativeMessages,
  sendCopyText,
  sendMail,
  sendWhatsapp,
};
