import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { createPost, getPost, updatePost } from "~/models/post.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const slug = formData.get("slug");
  const title = formData.get("title");
  const markdown = formData.get("markdown");

  if (typeof slug !== "string" || slug.length === 0) {
    return json(
      { errors: { markdown: null, title: null, slug: "Slug is required" } },
      { status: 400 },
    );
  }

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { markdown: null, slug: null, title: "Title is required" } },
      { status: 400 },
    );
  }

  if (typeof markdown !== "string" || markdown.length === 0) {
    return json(
      { errors: { markdown: "Markdown is required", title: null, slug: null } },
      { status: 400 },
    );
  }

  const post = await updatePost({ markdown, title, slug });

  return redirect(`/posts/${post.slug}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "post not found");

  const post = await getPost({ slug: params.slug });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
};

export default function EditPostPage() {
  const actionData = useActionData<typeof action>();
  const { post } = useLoaderData<typeof loader>();

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Slug: </span>
          <input
            name="slug"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.slug ? true : undefined}
            aria-errormessage={
              actionData?.errors?.slug ? "slug-error" : undefined
            }
            defaultValue={post.slug}
          />
        </label>
        {actionData?.errors?.slug ? (
          <div className="pt-1 text-red-700" id="slug-error">
            {actionData.errors.slug}
          </div>
        ) : null}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
            defaultValue={post.title}
          />
        </label>
        {actionData?.errors?.title ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Markdown: </span>
          <textarea
            name="markdown"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.markdown ? true : undefined}
            aria-errormessage={
              actionData?.errors?.markdown ? "body-error" : undefined
            }
            defaultValue={post.markdown}
          />
        </label>
        {actionData?.errors?.markdown ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.markdown}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
