import { Post } from "@prisma/client";
import { prisma } from "~/db.server";

export function getPost({ slug }: Pick<Post, "slug">) {
  return prisma.post.findFirst({
    where: { slug },
  });
}

export async function getPosts(): Promise<Array<Post>> {
  return prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
  });
}
