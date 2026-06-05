import { z } from 'zod';

export const submissionSchema = z.object({
  form_version: z.string().min(1).default('v1'),
  submitted_at: z.string().datetime(),
  nome: z.string().min(1).max(200),
  email: z.string().email().max(320),
  empresa: z.string().min(1).max(200),
  cargo: z.string().min(1).max(100),
  setor: z.string().min(1).max(100),
  regiao: z.string().min(1).max(100),
  q1: z.string().min(1).max(8000),
  q2: z.array(z.string()).min(1),
  q3: z.string().min(1).max(8000),
  q4: z.string().min(1).max(1000),
  q5: z.string().max(8000).default(''),
  q6: z.string().min(1).max(8000),
  q7: z.string().min(1).max(8000),
  q8: z.string().min(1).max(8000),
  q9: z.string().min(1).max(8000),
  q10: z.string().min(1).max(1000),
  q11: z.string().min(1).max(1000),
  lgpd_contato: z.literal(true),
  lgpd_dados: z.literal(true),
  honeypot: z.string().max(100).default(''),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
