import {
  Content,
  fetchOneEntry,
  getBuilderSearchParams,
  isPreviewing,
} from '@builder.io/sdk-react';
import type {LoaderFunctionArgs} from '@netlify/remix-runtime';
import {useLoaderData} from '@remix-run/react';
import {fetch as webFetch} from '@remix-run/web-fetch';

const webFetch = fetch;
const apiKey = '810e5adb1ee04fe3b583ce53929b2942';

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const urlPath = `/${params['slug'] || ''}`;

  const page = await fetchOneEntry({
    model: 'page',
    apiKey,
    options: getBuilderSearchParams(url.searchParams),
    userAttributes: {urlPath},
    fetch: webFetch,
  });

  if (!page && !isPreviewing(url.search)) {
    throw new Response('Page Not Found', {
      status: 404,
      statusText: 'Page not found in Builder.io',
    });
  }

  return {page};
};

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return <Content model="page" apiKey={apiKey} content={page as any} />;
}
