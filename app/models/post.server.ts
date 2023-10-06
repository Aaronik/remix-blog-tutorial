import { prisma } from "~/db.server";

type Post = {
  slug: string;
  title: string;
};

export function getPost({ slug }: Pick<Post, "slug">) {
  return prisma.post.findFirst({
    where: { slug },
  });
}

export async function getPosts(): Promise<Array<Post>> {
  return prisma.post.findMany({
    select: { slug: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}
