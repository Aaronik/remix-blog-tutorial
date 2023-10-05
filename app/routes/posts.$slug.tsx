import { LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData, useRouteLoaderData } from "@remix-run/react"
import { getPost } from "~/models/post.server"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const post = await getPost(params.slug as string);
  return json({ post });
}


export default function Post() {
  const { post } = useLoaderData<typeof loader>()

  if (!post) {
    return <h1>404</h1>
  }

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {post.title}
      </h1>

      {post.slug}
    </main>
  )
}

