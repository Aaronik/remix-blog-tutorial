import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
    Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";

import { deletePost, getPost } from "~/models/post.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "post not found");

  const post = await getPost({ slug: params.slug });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
};

// Note, this is responsible to both the below and /posts
export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.slug, "Must supply slug");
  await deletePost(params.slug);
  return redirect("/posts");
};

export default function PostDetailsPage() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex">
        <h3 className="text-2xl font-bold">{post.title}</h3>
        <Form method="delete"><button className="text-2xl font-bold" type="submit">X</button></Form>
      </div>
      <div dangerouslySetInnerHTML={{ __html: marked(post.markdown) }}></div>
      <hr className="my-4" />
    </div>
  );
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
    return <div>Post not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
