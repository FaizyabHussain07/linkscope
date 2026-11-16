"use client";

import { useCallback, useRef, useState } from "react";
import { formatUrl } from "@/lib/cache";
import type { ExtractedMetadata } from "@/types";

export type MetaData = ExtractedMetadata;

export function useMetadata() {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  const inFlight = useRef(false);

  const fetchMetadata = useCallback(async (urlToFetch: string) => {
    if (inFlight.current) return;
    if (!urlToFetch) {
      setError("Please enter a URL");
      return;
    }

    const formattedUrl = formatUrl(urlToFetch);

    try {
      inFlight.current = true;
      const controller = new AbortController();
      activeRequest.current = controller;
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/v1/inspect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: formattedUrl }),
          signal: controller.signal,
        }
      ).catch(() => null);

      if (!response || !response.ok) {
        setError("Error fetching metadata. Please check the URL and try again.");
        return;
      }

      const data = await response.json().catch(() => null);
      if (!data || !data.success) {
        setError(data?.error || "Error fetching metadata. Please check the URL and try again.");
        return;
      }

      setMetadata(data.metadata);
    } catch {
      setError("Error fetching metadata. Please check the URL and try again.");
    } finally {
      inFlight.current = false;
      activeRequest.current = null;
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    activeRequest.current?.abort();
    inFlight.current = false;
    setUrl("");
    setMetadata(null);
    setError("");
  }, []);

  const refresh = useCallback(() => {
    if (url) fetchMetadata(url);
  }, [url, fetchMetadata]);

  return {
    url,
    setUrl,
    metadata,
    loading,
    error,
    fetchMetadata,
    clear,
    refresh,
  };
}
