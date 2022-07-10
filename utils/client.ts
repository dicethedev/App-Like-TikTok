import sanityClient from '@sanity/client';


// All details below is gotten from my sanity project setup
export const client = sanityClient({
  projectId: '4qwmav0m',
  dataset: 'production',
  apiVersion: '2022-07-10',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
