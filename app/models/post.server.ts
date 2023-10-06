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

export async function createPost({
  slug,
  title,
  markdown,
}: Pick<Post, "slug" | "title" | "markdown">) {
  return prisma.post.create({
    data: {
      slug,
      title,
      markdown,
    },
  });
}

export async function updatePost({
  slug,
  title,
  markdown,
}: Pick<Post, "slug" | "title" | "markdown">) {
  return prisma.post.update({
    where: {
      slug,
    },
    data: {
      title,
      markdown,
    },
  });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({
    where: { slug },
  });
}
