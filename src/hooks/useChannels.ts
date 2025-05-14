import { useEffect, useMemo, useRef, useState } from "react";

export interface TourTableChannelProps {
  anchor: string;
  leftLocation: number;
  topLocation: number;
  anchorId: number;
  building?: string;
  floor?: string;
  scene?: string;
}

const useChannel = <TInput>({
  channelName,
  messageHandler,
  subscribeToMessages = false,
}: {
  channelName: string;
  messageHandler: (message: MessageEvent) => void;
  subscribeToMessages?: boolean;
}) => {
  const channel = useMemo(
    () => new BroadcastChannel(channelName),
    [channelName]
  );
  const receiveChannel = useMemo(
    () => new BroadcastChannel(channelName),
    [channelName]
  );

  const broadcast = (message: TInput) => {
    channel.postMessage(message);
  };

  useEffect(() => {
    if (subscribeToMessages) {
      channel.addEventListener("message", messageHandler);
      receiveChannel.addEventListener("message", messageHandler);
    }
    return () => {
      if (subscribeToMessages) {
        channel.removeEventListener("message", messageHandler);
        receiveChannel.removeEventListener("message", messageHandler);
      }
    };
  }, [channelName]);

  return broadcast;
};

export default useChannel;
