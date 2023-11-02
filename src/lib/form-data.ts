import { z } from 'zod';

export const Industry = {
  Development: 'Development',
  Marketing: 'Marketing',
  Design: 'Design',
};

// Vercel serverless functions have a 4.5MB limit on the request body
// If we wanted to upload larger files, we would need have the client login to Google Drive
// and upload the file directly to their drive, then send the file ID to the serverless function
export const formSchema = z.object({
  name: z.string().min(1, 'Required'),
  twitter: z.string().min(1, 'Required'),
  discord: z.string().min(1, 'Required'),
  industry: z.string().min(1, 'Required'),
  proposal: z.string().min(1, 'Required'),
  file: z
    .any()
    .refine(v => v !== null, { message: 'Required' })
    .refine(v => v!.size < 4 * 1024 * 1024, { message: 'File must be less than 4MB' }),
  terms: z.boolean().refine(v => v, { message: 'Required' }),
  over18: z.boolean().refine(v => v, { message: 'Required' }),
});
