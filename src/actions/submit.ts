'use server';

import { google } from 'googleapis';

import { env } from '@/env.mjs';

// Not working yet
export async function submitUsingSDK(
  name: string,
  twitter: string,
  discord: string,
  industry: string,
  proposal: string,
  fileId: string,
  terms: boolean,
  over18: boolean
) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_CLIENT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY,
    },
    scopes: [
      'https://www.googleapis.com/auth/script.scriptapp',
      'https://www.googleapis.com/auth/script.external_request',
    ],
  });

  const scriptsService = google.script({
    version: 'v1',
    auth,
  });

  const response = await scriptsService.scripts.run({
    requestBody: {
      function: 'doPost',
      parameters: [name, twitter, discord, industry, proposal, fileId, terms, over18],
    },
    scriptId: env.GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID,
  });

  if (!response.data.done) {
    console.log(response);
    throw new Error('Failed to submit form');
  }
}

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
