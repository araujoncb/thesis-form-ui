import { NextRequest, NextResponse } from 'next/server';

import { getSupabaseAdminClient, getSupabaseTableName } from '@/lib/supabase-admin';
import { submissionSchema } from '@/lib/submission';

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Campos obrigatórios ausentes ou inválidos.',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  if (parsed.data.honeypot.trim()) {
    return NextResponse.json({ error: 'Submissão bloqueada.' }, { status: 400 });
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor ? forwardedFor.split(',')[0]?.trim() ?? null : null;
  const userAgent = request.headers.get('user-agent');
  const referrer = request.headers.get('referer');

  const supabase = getSupabaseAdminClient();
  const tableName = getSupabaseTableName();

  const { error } = await supabase.from(tableName).insert({
    form_version: parsed.data.form_version,
    submitted_at: parsed.data.submitted_at,
    full_name: parsed.data.nome,
    email: parsed.data.email,
    company_name: parsed.data.empresa,
    role: parsed.data.cargo,
    industry: parsed.data.setor,
    region: parsed.data.regiao,
    answers: {
      q1: parsed.data.q1,
      q2: parsed.data.q2,
      q3: parsed.data.q3,
      q4: parsed.data.q4,
      q5: parsed.data.q5,
      q6: parsed.data.q6,
      q7: parsed.data.q7,
      q8: parsed.data.q8,
      q9: parsed.data.q9,
      q10: parsed.data.q10,
      q11: parsed.data.q11,
      q12: parsed.data.q12,
    },
    consent_contact: parsed.data.lgpd_contato,
    consent_data: parsed.data.lgpd_dados,
    honeypot: parsed.data.honeypot,
    referrer,
    user_agent: userAgent,
    ip_address: ipAddress,
    status: 'new',
  });

  if (error) {
    return NextResponse.json(
      { error: 'Não foi possível salvar a resposta.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
