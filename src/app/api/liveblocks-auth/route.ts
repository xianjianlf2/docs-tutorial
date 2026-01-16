import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// 环境变量验证
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

interface RequestBody {
  roomId?: string;
}

interface DocumentPermission {
  isOwner: boolean;
  isInSameOrganization: boolean;
}

/**
 * 验证请求体并提取 roomId
 */
function validateRequestBody(body: unknown): string {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be an object");
  }

  const { roomId } = body as RequestBody;
  if (!roomId || typeof roomId !== "string") {
    throw new Error("roomId is required and must be a string");
  }

  return roomId;
}

/**
 * 检查用户对文档的权限
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

/**
 * 获取用户显示名称
 */
function getUserDisplayName(user: {
  fullName?: string | null;
  firstName?: string | null;
}): string {
  return user.fullName ?? user.firstName ?? "Anonymous";
}

export async function POST(request: Request) {
  try {
    // 1. 验证用户身份
    const authResult = await auth();
    if (!authResult.sessionClaims) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. 解析和验证请求体
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON in request body", { status: 400 });
    }

    const roomId = validateRequestBody(body);

    // 3. 获取认证 token 并查询文档
    const token = await authResult.getToken();
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
    } catch (error) {
      console.error("Error querying document:", error);
      return new Response("Error querying document", { status: 500 });
    }

    if (!document) {
      return new Response("Document not found", { status: 404 });
    }

    // 4. 权限检查（与 documents.ts 中的逻辑保持一致）
    const organizationId = authResult.sessionClaims.org_id as string | undefined;
    const { isOwner, isInSameOrganization } = checkDocumentPermission(
      document,
      user.id,
      organizationId
    );

    if (!isOwner && !isInSameOrganization) {
      return new Response("Unauthorized", { status: 403 });
    }

    // 5. 创建 Liveblocks 会话
    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: getUserDisplayName(user),
        avatarUrl: user.imageUrl ?? "",
      },
    });

    session.allow(roomId, session.FULL_ACCESS);

    // 6. 授权并返回响应
    const { body: responseBody, status } = await session.authorize();
    return new Response(responseBody, { status });
  } catch (error) {
    // 处理已知的业务逻辑错误
    if (error instanceof Error && error.message.includes("required")) {
      return new Response(error.message, { status: 400 });
    }

    console.error("Error in Liveblocks auth endpoint:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
