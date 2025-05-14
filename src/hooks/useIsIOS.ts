import { useState, useEffect } from "react";
import {
  isTimeExceedingDays,
  setStorageKeyTime,
} from "../utils/storage-manager";

export interface IOSMode {
  isIOS: boolean;
  isSafari: boolean;
  prompt: boolean;
}

const emptyCheck: IOSMode = {
  isIOS: false,
  isSafari: false,
  prompt: false,
};

function checkForIOS() {
  if ((navigator as any).standalone) {
    return emptyCheck;
  }
  const ua = window.navigator.userAgent;
  const webkit = !!ua.match(/WebKit/i);
  const isIPad = !!ua.match(/iPad/i);
  const isIPhone = !!ua.match(/iPhone/i);
  const isIOS = isIPad || isIPhone;
  const isSafari = isIOS && webkit && !ua.match(/CriOS/i);

  const prompt = isTimeExceedingDays("INSTALL_PWA", 30) && isIOS && isSafari;

  if (prompt) {
    setStorageKeyTime("INSTALL_PWA");
  }

  return { isIOS, isSafari, prompt };
}

export default function useIsIOS() {
  const [isIOS, setIsIOS] = useState(emptyCheck);

  useEffect(() => {
    setIsIOS(checkForIOS());
  }, []);

  return isIOS;
}
