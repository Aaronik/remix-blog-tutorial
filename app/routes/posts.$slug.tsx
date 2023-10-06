import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";

import { getPost } from "~/models/post.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "post not found");

  const post = await getPost({ slug: params.slug });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
};

export default function PostDetailsPage() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{post.title}</h3>
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
