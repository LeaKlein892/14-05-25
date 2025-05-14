import * as React from "react";
import { useContext } from "react";
import { IconButton } from "@mui/material";
import { styled } from "@mui/system";

import { analyticsEvent } from "../../utils/analytics";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { getQueryArgs } from "../../utils/query-params";
import { EXPONET, GREENBOOK, JM, RAMDOR } from "../../utils/clients";
import { webViewMode } from "../../utils/webview-messenger";
import { WEBSITE } from "../../utils/site-routes";
import { UserProfile } from "../../models";
import { AppModeEnum } from "../../context/ViewContext";

interface LogoImage {
  href: string;
  src: string;
  mobileSrc: string;
}

const clientArg = getQueryArgs("client");

const getLogoImageByClient = (): LogoImage => {
  if (clientArg === RAMDOR) {
    return {
      href: "https://www.ramdor.co.il/",
      src: "/img/topRamdorIcon.png",
      mobileSrc: "/img/topRamdorMobile.png",
    };
  } else if (clientArg === EXPONET) {
    return {
      href: "https://www.expo-net.net/",
      src: "/img/exponet.png",
      mobileSrc: "/img/exponet.png",
    };
  } else {
    return {
      href: WEBSITE,
      src: "/logos/castory-full.svg",
      mobileSrc: "/logos/castory-icon.svg",
    };
  }
};

const topOffsetByClient = () =>
  clientArg === GREENBOOK || clientArg === JM ? "1.5vh" : "9vh";

export interface LogoButtonProps {
  mobileMode?: boolean;
  transparent?: boolean;
  loggedUser?: UserProfile;
  projectsCount: number;
  appMode: AppModeEnum;
}

const LogoLink = styled("a")<LogoButtonProps>(({ projectsCount }) => ({
  marginLeft: projectsCount >= 5 ? "0px" : "auto",
}));

const LogoImg = styled("img")({
  height: "2.5rem",
});

const LogoTransparentImage = styled("img")({
  height: "1.1rem",
  position: "fixed",
  top: topOffsetByClient(),
  right: "3vh",
  zIndex: 1000,
});

export const LogoButton: React.FC<LogoButtonProps> = ({
  mobileMode = false,
  transparent = false,
  projectsCount,
  appMode,
}) => {
  const { loggedUser } = useContext(LoggedUserContext);
  const { href, src, mobileSrc } = getLogoImageByClient();
  const inWebView = webViewMode();
  const linkTarget = !inWebView ? "_blank" : "_self";

  return (
    <LogoLink
      target={linkTarget}
      href={href}
      rel="noopener noreferrer"
      projectsCount={projectsCount}
      appMode={appMode}
      onClick={() => {
        analyticsEvent("Navigation", "Logo Icon Clicked", loggedUser.username);
      }}
    >
      {transparent ? (
        <LogoTransparentImage
          alt="website"
          src="/logos/castory-transparent.svg"
        />
      ) : (
        <IconButton size="large">
          {clientArg !== RAMDOR ? (
            mobileMode ? (
              <LogoImg alt="Castory" src={mobileSrc} height="39px" />
            ) : (
              <LogoImg alt="Castory" src={src} height="39px" />
            )
          ) : (
            <span />
          )}
        </IconButton>
      )}
    </LogoLink>
  );
};
