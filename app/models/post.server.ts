import { prisma } from "~/db.server";

type Post = {
  slug: string;
  title: string;
};

export async function getPosts(): Promise<Array<Post>> {
  return prisma.post.findMany({
    select: { slug: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}
