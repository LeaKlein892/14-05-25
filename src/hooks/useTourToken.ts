import { useCallback, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { getTourToken } from "../graphql/queries";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

export type TokenStatus = "NO_TOKEN" | "TOKEN_MATCH" | "TOKEN_NOT_MATCHED";

export function useTourToken(dataUrl: string) {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("NO_TOKEN");

  const fetch = useCallback(async () => {
    const tokenValue = window.sessionStorage.getItem("token");
    if (tokenValue && dataUrl && dataUrl.length !== 0) {
      const tourTokenData: any = await API.graphql({
        query: getTourToken,
        variables: {
          id: dataUrl,
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      const tourToken = tourTokenData.data.getTourToken;
      if (tourToken.token === tokenValue) {
        setTokenStatus("TOKEN_MATCH");
      } else if (
        tourTokenData !== null &&
        tourTokenData !== undefined &&
        tourToken.token !== tokenValue
      ) {
        setTokenStatus("TOKEN_NOT_MATCHED");
      }
    }
  }, [dataUrl]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  return tokenStatus;
}
