import {
  Content,
  fetchOneEntry,
  getBuilderSearchParams,
  isPreviewing,
} from '@builder.io/sdk-react';
import type {LoaderFunctionArgs} from '@netlify/remix-runtime';
import {useLoaderData} from '@remix-run/react';
// import {fetch as webFetch} from '@remix-run/web-fetch';
import {BuilderComponent, useIsPreviewing} from '@builder.io/react';
import builderPkg from '@builder.io/react';
import type {BuilderContent} from '@builder.io/sdk';

const webFetch = fetch;
const apiKey = '810e5adb1ee04fe3b583ce53929b2942';
const {builder} = builderPkg;
builder.init(apiKey);
builder.apiVersion = 'v3';

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const urlPath = `/${params['slug'] || ''}`;

  // const page = await fetchOneEntry({
  //   model: 'page',
  //   apiKey,
  //   options: getBuilderSearchParams(url.searchParams),
  //   userAttributes: {urlPath},
  //   fetch: webFetch,
  // });

  // if (!page && !isPreviewing(url.search)) {
  //   throw new Response('Page Not Found', {
  //     status: 404,
  //     statusText: 'Page not found in Builder.io',
  //   });
  // }

  // return {page};

  const page = await builder
    .get('hydrogen-page-test', {
      userAttributes: {
        urlPath: '/' + params['*'],
      },
    })
    .toPromise();

  if (page) return page;

  return {};
};

// export default function Page() {
//   const {page} = useLoaderData<typeof loader>();
//
//   return <Content model="page" apiKey={apiKey} content={page as any} />;
// }

type BuilderContentRemix = Omit<BuilderContent, 'variations' | 'data'>;

export default function Page() {
  const page: BuilderContentRemix = useLoaderData<BuilderContentRemix>();
  const isPreviewingInBuilder = useIsPreviewing();
  const show404 = !page && !isPreviewingInBuilder;

  if (show404) {
    return <h1>404 not found (customize your 404 here)</h1>;
  }

  return <BuilderComponent model="hydrogen-page-test" content={page} />;
}
