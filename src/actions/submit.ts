'use server';

import { env } from '@/env.mjs';

export async function submitUsingURL(
  name: string,
  twitter: string,
  discord: string,
  industry: string,
  proposal: string,
  fileId: string,
  terms: boolean,
  over18: boolean
) {
  const data = {
    Name: name,
    Twitter: twitter,
    Discord: discord,
    Industry: industry,
    Proposal: proposal,
    File: fileId,
    Terms: terms,
    Over18: over18,
  };

  const body = createQueryString(data);

  const response = await fetch(env.GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    console.error(response);
    throw new Error('Failed to submit form');
  }
}

function createQueryString(data: Record<string, unknown>) {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`)
    .join('&');
}
