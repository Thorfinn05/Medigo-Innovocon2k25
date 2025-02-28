import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_STUDIO_URL
    ? `https://${process.env.NEXT_PUBLIC_STUDIO_URL}/studio`
    : `${process.env.NEXT_PUBLIC_VERCEL_URL}/studio`,
  },
});
