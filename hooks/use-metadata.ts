"use client";

import { useCallback, useState } from "react";
import { formatUrl } from "@/lib/cache";
import type { ExtractedMetadata } from "@/types";

export type MetaData = ExtractedMetadata;

export function useMetadata() {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMetadata = useCallback(async (urlToFetch: string) => {
    if (!urlToFetch) {
      setError("Please enter a URL");
      return;
    }

    const formattedUrl = formatUrl(urlToFetch);

    try {
      setLoading(true);
      setError("");
      setMetadata(null);

      const response = await fetch(
        `/api/v1/inspect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: formattedUrl }),
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
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
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
