"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs"; // client-side Clerk
import { isOwner } from "../../actions/isOwner"; // server action

/**
 * Returns { isOwner, isLoading }
 *   isOwner   → true  if current user owns the doc
 *             → false if not owner (or not signed-in)
 *   isLoading → true  while the check is still running
 */
export function useIsOwner(docId: string) {
  const { userId } = useAuth();

  // null  = still loading
  // true  = owner
  // false = not owner
  const [ownerState, setOwnerState] = useState<boolean | null>(null);

  useEffect(() => {
    // No user?  Definitely not owner.
    if (!userId) {
      setOwnerState(false);
      return;
    }

    let active = true;

    (async () => {
      const { owns } = await isOwner(docId);
      if (active) setOwnerState(owns);
    })();

    // Cleanup to avoid setting state on unmounted component
    return () => {
      active = false;
    };
  }, [docId, userId]);

  return {
    isOwner: ownerState === true,
    isLoading: ownerState === null,
  };
}
