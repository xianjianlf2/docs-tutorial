"use client";

import { FullscreenLoader } from "@/components/fullscreen-loader";
import { DEFAULT_MARGIN } from "@/constants/editor";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { getDocumentsInfoById, getUsers } from "./actions";

type User = { id: string; name: string; avatar: string; color: string };

export function Room({ children }: { children: ReactNode }) {
  const { documentId } = useParams();

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const users = await getUsers();
      setUsers(users);
    } catch {
      toast.error("Fail to fetch users", {
        description: "Please try again later",
      });
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return (
    <LiveblocksProvider
      authEndpoint={`/api/liveblocks-auth?roomId=${documentId}`}
      throttle={16}
      resolveUsers={({ userIds }) => {
        return userIds
          .map((userId) => users.find((user) => user.id === userId))
          .filter((user): user is User => user !== undefined);
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;

        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }
        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocumentsInfoById(
          roomIds as Id<"documents">[]
        );
        return documents.map((document) => ({
          id: document.id,
          name: document.name,
        }));
      }}
    >
      <RoomProvider
        id={documentId as string}
        initialStorage={{
          leftMargin: DEFAULT_MARGIN,
          rightMargin: DEFAULT_MARGIN,
        }}
      >
        <ClientSideSuspense
          fallback={<FullscreenLoader label="Loading room..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
