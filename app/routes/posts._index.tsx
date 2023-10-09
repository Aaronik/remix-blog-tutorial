import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import { deletePost, getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const slug = formData.get("slug");

  invariant(slug, "Must supply slug");

  if (typeof slug !== "string" || slug.length === 0) {
    return json(
      { errors: { message: "Must supply slug" } },
      { status: 400 },
    );
  }

  return deletePost(slug);
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();

  const [open, setOpen] = useState<Boolean>(false);

  return (
    <main>
      <h1 onClick={() => setOpen(!open)}>open: <span>{open.toString()}</span></h1>
      <h1>Posts</h1>
      <Link to="new">Make a new one</Link>
      <ul>
        {posts.map((post) => (
          <Post post={post} />
        ))}
      </ul>
    </main>
  );
}

// Our custom type utility generic
type ClientType<TLoader> = ReturnType<typeof useLoaderData<TLoader>>;

// In module
type PostsObject = ClientType<typeof loader>;
type Post = PostsObject['posts'][0];

function Post({ post }: { post: Post }) {
  return (
    <li key={post.slug} className="flex">
      <Link
        to={post.slug}
        className="text-blue-600 underline"
      >
        {post.title}
      </Link>
      <span>|</span>
      <Form method="delete">
        <input type="hidden" name="slug" value={post.slug}></input>
        <button type="submit">Deltaco The Thing</button>
      </Form>
    </li>
  )
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Not Found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
