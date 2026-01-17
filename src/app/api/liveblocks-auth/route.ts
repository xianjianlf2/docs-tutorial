import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// Environment variable validation
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}

const LIVEBLOCKS_SECRET_KEY = getEnvVar("LIVEBLOCKS_SECRET_KEY");

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY,
});

interface DocumentPermission {
  isOwner: boolean;
  isInSameOrganization: boolean;
}

/**
 * Check user permissions for the document
 */
function checkDocumentPermission(
  document: { ownerId: string; organizationId?: string },
  userId: string,
  organizationId?: string
): DocumentPermission {
  const isOwner = document.ownerId === userId;
  const isInSameOrganization = Boolean(
    organizationId &&
      document.organizationId &&
      document.organizationId === organizationId
  );

  return { isOwner, isInSameOrganization };
}

export async function POST(request: Request) {
  try {
    // 1. Verify user authentication
    const authResult = await auth();
    if (!authResult?.sessionClaims) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Get roomId from URL query parameters
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");

    if (!roomId || typeof roomId !== "string") {
      return new Response("roomId is required and must be a string", {
        status: 400,
      });
    }

    // 3. Get authentication token and query document
    // Use Convex JWT template to generate a token that meets Convex authentication requirements
    const token = await authResult.getToken({ template: "convex" });
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    let document;
    try {
      document = await fetchQuery(
        api.documents.getById,
        { id: roomId as Id<"documents"> },
        { token }
      );
    } catch {
      return new Response("Error querying document", { status: 500 });
    }

    if (!document) {
      return new Response("Document not found", { status: 404 });
    }

    // 4. Permission check (keep consistent with logic in documents.ts)
    const organizationId = authResult.sessionClaims.org_id as
      | string
      | undefined;
    const { isOwner, isInSameOrganization } = checkDocumentPermission(
      document,
      user.id,
      organizationId
    );

    if (!isOwner && !isInSameOrganization) {
      return new Response("Unauthorized", { status: 403 });
    }

    // 5. Create Liveblocks session
    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name:
          user.fullName ??
          user.primaryEmailAddress?.emailAddress ??
          "Anonymous",
        avatar: user.imageUrl ?? "",
      },
    });

    session.allow(roomId, session.FULL_ACCESS);

    // 6. Authorize and return response
    const { body: responseBody, status } = await session.authorize();
    return new Response(responseBody, { status });
  } catch (error) {
    // Handle known business logic errors
    if (error instanceof Error && error.message.includes("required")) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Internal server error", { status: 500 });
  }
}
