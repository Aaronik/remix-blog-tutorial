import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { deletePost, getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const slug = formData.get("slug");

  invariant(slug, "Must supply slug");

  if (typeof slug !== "string" || slug.length === 0) {
    return json(
      { errors: { message: "Must supply slug" } },
      { status: 400 },
    );
  }

  await deletePost(slug);
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Posts</h1>
      <Link to="new">Make a new one</Link>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="flex">
            <Link
              to={post.slug}
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
            <span>|</span>
            <Form action={`/posts/${post.slug}`} method="delete"><button type="submit">Deltaco The Thing</button></Form>
          </li>
        ))}
      </ul>
    </main>
  );
}
