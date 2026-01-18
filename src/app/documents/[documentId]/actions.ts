"use server";

import { generateUserColor } from "@/lib/utils";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocumentsInfoById(ids: Id<"documents">[]) {
  const documents = await convex.query(api.documents.getDocumentsInfoById, {
    ids,
  });
  return documents;
}

export async function getUsers() {
  const { sessionClaims } = await auth();
  const clerk = await clerkClient();

  const orgId = sessionClaims?.org_id as string | undefined;

  // 如果有组织 ID，只获取组织内的用户；否则获取所有用户
  const response = await clerk.users.getUserList(
    orgId ? { organizationId: [orgId] } : {}
  );

  const users = response.data.map((user) => {
    const name =
      user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
    return {
      id: user.id,
      name,
      avatar: user.imageUrl ?? "",
      color: generateUserColor(name),
    };
  });

  return users;
}
