import { useEffect } from "react";

const SITE = "manuxer";

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} | UX Designer Portfolio`;
  }, [title]);
}
