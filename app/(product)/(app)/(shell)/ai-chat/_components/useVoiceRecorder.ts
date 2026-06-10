"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/lib/web/toast";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB

/** Pick a MediaRecorder mimeType the browser actually supports. */
function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = ["audio/webm", "audio/ogg", "audio/mp4"];
  for (let i = 0; i < candidates.length; i += 1) {
    const type = candidates[i];
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return undefined;
}

export interface VoiceRecorder {
  isRecording: boolean;
  /** Mic capture supported in this browser. */
  supported: boolean;
  start: () => Promise<void>;
  /** Stop and resolve with the recorded blob (null if nothing/too large). */
  stop: () => void;
}

/**
 * Records mic audio via MediaRecorder. On stop, hands the blob to `onBlob`
 * (skipping blobs over 10 MB with a toast). Cleans up tracks on stop/unmount.
 */
export function useVoiceRecorder(
  onBlob: (blob: Blob) => void,
): VoiceRecorder {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const onBlobRef = useRef(onBlob);
  onBlobRef.current = onBlob;

  const supported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined";

  const cleanupStream = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    if (!supported || recorderRef.current) return;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const denied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" || err.name === "SecurityError");
      toast(
        denied
          ? "Microphone access was denied. Enable it in your browser settings to use voice input."
          : "Couldn't access your microphone. Please try again.",
        "error",
      );
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];
    const mimeType = pickMimeType();
    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mimeType || "audio/webm",
      });
      chunksRef.current = [];
      recorderRef.current = null;
      cleanupStream();
      setIsRecording(false);
      if (blob.size === 0) return;
      if (blob.size > MAX_AUDIO_BYTES) {
        toast("That recording is too long. Keep it under 10 MB.", "error");
        return;
      }
      onBlobRef.current(blob);
    };

    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  }, [supported, cleanupStream]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      cleanupStream();
      setIsRecording(false);
    }
  }, [cleanupStream]);

  // Stop recording and release the mic on unmount.
  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      cleanupStream();
    };
  }, [cleanupStream]);

  return { isRecording, supported, start, stop };
}
