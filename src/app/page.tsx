'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';

/* Types */
interface FormData {
  nome: string;
  email: string;
  empresa: string;
  cargo: string;
  setor: string;
  regiao: string;
  q1: string;
  q2: string[];
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  lgpd_contato: boolean;
  lgpd_dados: boolean;
}

const INITIAL: FormData = {
  nome: '', email: '', empresa: '', cargo: '', setor: '', regiao: '',
  q1: '', q2: [], q3: '', q4: '', q5: '', q6: '',
  q7: '', q8: '', q9: '', q10: '',
  lgpd_contato: false, lgpd_dados: false,
};

const SETORES = ['Química', 'Mineração', 'Alimentos e Bebidas', 'Papel e Celulose', 'Energia', 'Saneamento', 'Outro'];
const REGIOES = ['SP', 'MG', 'RJ', 'ES', 'PR', 'SC', 'RS', 'MT', 'MS', 'GO', 'DF', 'BA', 'PA', 'AM', 'Outro'];
const CARGOS = ['Gestor(a) Ambiental', 'Gerente de EHS / ESG', 'Diretor(a)', 'CEO / Sócio', 'Consultor(a)', 'Outro'];
const LICENCAS = ['LP/LI/LO', 'CADRI', 'RAPP / CTF', 'MTR / SIGOR', 'Outorga de Recursos Hídricos', 'GHG / Inventário de Emissões', 'IFRS S1/S2', 'Outro'];

const STEPS = ['Identificação', 'Contexto', 'Dores', 'Soluções', 'Valor', 'Compromisso'];
const TOTAL = STEPS.length;

/* Colors */
const C = {
  navy: '#091D2E',
  gold: '#E7B630',
  goldDark: '#C99B1A',
  blue: '#33A0FF',
  cream: '#FAE7C8',
  blueGray: '#BBCAD8',
  text: '#091D2E',
  textSec: '#466683',
  white: '#F8F9FA',
};

/* Sub-components */
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block mb-2 text-sm font-semibold" style={{ color: C.navy, fontFamily: 'var(--font-montserrat)' }}>
      {children}
      {required && <span style={{ color: C.gold }} className="ml-1">*</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = 'text', required }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const invalid = required && touched && !value.trim();
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all duration-200 placeholder:text-slate-400"
        style={{
          borderColor: invalid ? '#e53e3e' : value ? C.gold : C.blueGray,
          background: C.white,
          color: C.navy,
          fontFamily: 'var(--font-open-sans)',
          boxShadow: 'none',
        }}
      />
      {invalid && <p className="mt-1 text-xs text-red-500">Campo obrigatório</p>}
    </div>
  );
}

function Textarea({ value, onChange, placeholder, required, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; rows?: number;
}) {
  const [touched, setTouched] = useState(false);
  const invalid = required && touched && !value.trim();
  return (
    <div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all duration-200 resize-none placeholder:text-slate-400"
        style={{
          borderColor: invalid ? '#e53e3e' : value ? C.gold : C.blueGray,
          background: C.white,
          color: C.navy,
          fontFamily: 'var(--font-open-sans)',
          lineHeight: 1.6,
        }}
      />
      {invalid && <p className="mt-1 text-xs text-red-500">Campo obrigatório</p>}
    </div>
  );
}

function Select({ value, onChange, options, placeholder, required }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; required?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const invalid = required && touched && !value;
  return (
    <div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        required={required}
        className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all duration-200 cursor-pointer appearance-none"
        style={{
          borderColor: invalid ? '#e53e3e' : value ? C.gold : C.blueGray,
          background: C.white,
          color: value ? C.navy : '#94a3b8',
          fontFamily: 'var(--font-open-sans)',
        }}
      >
        <option value="">{placeholder ?? 'Selecione...'}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {invalid && <p className="mt-1 text-xs text-red-500">Campo obrigatório</p>}
    </div>
  );
}

function CheckGroup({ options, selected, onChange }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: active ? C.gold : C.blueGray,
              background: active ? `${C.gold}22` : C.white,
              color: C.navy,
              fontFamily: 'var(--font-open-sans)',
              fontWeight: active ? 600 : 400,
            }}
          >
            <span
              className="w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center"
              style={{ borderColor: active ? C.gold : C.blueGray, background: active ? C.gold : 'transparent' }}
            >
              {active && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function RadioGroup({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm text-left transition-all duration-200"
            style={{
              borderColor: active ? C.gold : C.blueGray,
              background: active ? `${C.gold}22` : C.white,
              color: C.navy,
              fontFamily: 'var(--font-open-sans)',
              fontWeight: active ? 600 : 400,
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center"
              style={{ borderColor: active ? C.gold : C.blueGray }}
            >
              {active && <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.gold }} />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  const pct = ((step) / TOTAL) * 100;
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className="text-xs font-semibold hidden sm:block"
            style={{
              color: i < step ? C.gold : i === step ? C.navy : C.textSec,
              fontFamily: 'var(--font-montserrat)',
            }}
          >
            {s}
          </span>
        ))}
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.blueGray }}>
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${C.navy}, ${C.gold})` }}
        />
      </div>
      <p className="mt-2 text-xs text-right" style={{ color: C.textSec, fontFamily: 'var(--font-open-sans)' }}>
        Etapa <strong style={{ color: C.navy }}>{step + 1}</strong> de {TOTAL}
      </p>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-1" style={{ color: C.navy, fontFamily: 'var(--font-montserrat)' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm leading-relaxed" style={{ color: C.textSec, fontFamily: 'var(--font-open-sans)' }}>
          {subtitle}
        </p>
      )}
      <div className="mt-3 w-14 h-1 rounded-full" style={{ background: C.gold }} />
    </div>
  );
}

function NavButtons({ step, onBack, onNext, isLast, loading }: {
  step: number; onBack: () => void; onNext: () => void; isLast?: boolean; loading?: boolean;
}) {
  return (
    <div className="flex gap-3 mt-8">
      {step > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 sm:flex-none px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200"
          style={{
            borderColor: C.navy,
            color: C.navy,
            background: 'transparent',
            fontFamily: 'var(--font-montserrat)',
            minHeight: 48,
          }}
        >
          ← Voltar
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="flex-1 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
        style={{
          background: loading ? '#ccc' : C.gold,
          color: C.navy,
          fontFamily: 'var(--font-montserrat)',
          minHeight: 48,
          boxShadow: `0 4px 14px rgba(231, 182, 48, 0.4)`,
        }}
      >
        {loading ? 'Enviando...' : isLast ? 'Enviar Pesquisa' : 'Continuar →'}
      </button>
    </div>
  );
}

/* Steps Content */
function Step0({ d, u }: { d: FormData; u: (k: keyof FormData, v: string) => void }) {
  return (
    <>
      <SectionTitle
        title="Sobre você"
        subtitle="Queremos entender melhor o contexto da sua empresa antes de começar."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Label required>Nome completo</Label>
          <Input value={d.nome} onChange={v => u('nome', v)} placeholder="Ex: João da Silva" required />
        </div>
        <div>
          <Label required>E-mail corporativo</Label>
          <Input value={d.email} onChange={v => u('email', v)} placeholder="joao@empresa.com.br" type="email" required />
        </div>
        <div>
          <Label required>Empresa</Label>
          <Input value={d.empresa} onChange={v => u('empresa', v)} placeholder="Razão social ou nome fantasia" required />
        </div>
        <div>
          <Label required>Cargo</Label>
          <Select value={d.cargo} onChange={v => u('cargo', v)} options={CARGOS} placeholder="Selecione seu cargo" required />
        </div>
        <div>
          <Label required>Setor industrial</Label>
          <Select value={d.setor} onChange={v => u('setor', v)} options={SETORES} placeholder="Selecione o setor" required />
        </div>
        <div className="sm:col-span-2">
          <Label required>Estado (UF)</Label>
          <Select value={d.regiao} onChange={v => u('regiao', v)} options={REGIOES} placeholder="Selecione o estado" required />
        </div>
      </div>
    </>
  );
}

function Step1({ d, u }: { d: FormData; u: (k: keyof FormData, v: unknown) => void }) {
  return (
    <>
      <SectionTitle
        title="Contexto da empresa"
        subtitle="Entenda como vocês organizam o Processo Operacional Ambiental hoje."
      />
      <div className="flex flex-col gap-6">
        <div>
          <Label required>1. Na sua empresa, como vocês organizam o Processo Operacional Ambiental hoje?</Label>
          <p className="text-xs mb-2" style={{ color: C.textSec }}>Equipe interna, consultoria externa ou mix dos dois?</p>
          <Textarea value={d.q1} onChange={v => u('q1', v)} placeholder="Descreva como funciona hoje..." required rows={4} />
        </div>
        <div>
          <Label required>2. Quais são as licenças e obrigações ambientais mais críticas que vocês cumprem?</Label>
          <p className="text-xs mb-3" style={{ color: C.textSec }}>Selecione todas que se aplicam:</p>
          <CheckGroup
            options={LICENCAS}
            selected={d.q2}
            onChange={v => u('q2', v)}
          />
        </div>
      </div>
    </>
  );
}

function Step2({ d, u }: { d: FormData; u: (k: keyof FormData, v: string) => void }) {
  return (
    <>
      <SectionTitle
        title="Dores e desafios"
        subtitle="Queremos entender a fundo as dificuldades reais do dia a dia."
      />
      <div className="flex flex-col gap-6">
        <div>
          <Label required>3. Me conta a última vez que vocês tomaram um susto com prazo ou autuação ambiental.</Label>
          <p className="text-xs mb-2" style={{ color: C.textSec }}>Quanto antes isso aconteceu? O que causou?</p>
          <Textarea value={d.q3} onChange={v => u('q3', v)} placeholder="Descreva a situação..." required />
        </div>
        <div>
          <Label required>4. Quanto vocês gastam por ano somando consultoria ambiental + software + advogado?</Label>
          <p className="text-xs mb-2" style={{ color: C.textSec }}>Estimativa aproximada em R$ é suficiente.</p>
          <Input value={d.q4} onChange={v => u('q4', v)} placeholder="Ex: R$ 200 mil/ano" required />
        </div>
        <div>
          <Label>5. Vocês usam Verde Ghaia / SOGI ou outro software ambiental?</Label>
          <p className="text-xs mb-2" style={{ color: C.textSec }}>Como ficou a operação após a recuperação judicial da Ambipar?</p>
          <Textarea value={d.q5} onChange={v => u('q5', v)} placeholder="Descreva a ferramenta que usa e como está a situação..." rows={3} />
        </div>
      </div>
    </>
  );
}

function Step3({ d, u }: { d: FormData; u: (k: keyof FormData, v: string) => void }) {
  return (
    <>
      <SectionTitle
        title="Processo atual"
        subtitle="Entendendo as ferramentas e frustrações com o processo de hoje."
      />
      <div className="flex flex-col gap-6">
        <div>
          <Label required>6. Que ferramenta vocês usam para controlar prazos e requisitos legais ambientais?</Label>
          <p className="text-xs mb-2" style={{ color: C.textSec }}>Planilhas, software específico, processo manual?</p>
          <Textarea value={d.q6} onChange={v => u('q6', v)} placeholder="Descreva as ferramentas e o processo..." required rows={3} />
        </div>
        <div>
          <Label required>7. Se pudesse arrumar UMA coisa nesse processo, qual seria?</Label>
          <Textarea value={d.q7} onChange={v => u('q7', v)} placeholder="A principal dor ou gargalo que você eliminaria..." required />
        </div>
      </div>
    </>
  );
}

function Step4({ d, u }: { d: FormData; u: (k: keyof FormData, v: string) => void }) {
  const AUTONOMIA = ['Sim, com autonomia total', 'Sim, mas precisa de aprovação da diretoria', 'Não, quem decide é outra pessoa'];
  return (
    <>
      <SectionTitle
        title="Valor e decisão"
        subtitle="Entendendo como a empresa avalia investimentos em compliance."
      />
      <div className="flex flex-col gap-6">
        <div>
          <Label required>8. Quanto vale para a empresa evitar uma multa IBAMA de R$ 500 mil ou perder uma licença?</Label>
          <p className="text-xs mb-2" style={{ color: C.textSec }}>Qual seria o impacto real no negócio?</p>
          <Textarea value={d.q8} onChange={v => u('q8', v)} placeholder="Descreva o impacto financeiro e operacional para a empresa..." required />
        </div>
        <div>
          <Label required>9. Se eu trouxesse uma solução que resolve sua dor central por R$ 999/mês, você teria autonomia para contratar?</Label>
          <div className="mt-3">
            <RadioGroup options={AUTONOMIA} value={d.q9} onChange={v => u('q9', v)} />
          </div>
        </div>
      </div>
    </>
  );
}

function Step5({ d, u }: { d: FormData; u: (k: keyof FormData, v: string | boolean) => void }) {
  const PILOTO = ['Sim, topo testar com desconto', 'Talvez, depende da solução', 'Não no momento'];
  return (
    <>
      <SectionTitle
        title="Próximos passos"
        subtitle="Quase lá! Vamos entender o interesse em piloto."
      />
      <div className="flex flex-col gap-6">
        <div>
          <Label required>10. Se eu tiver um piloto em 45 dias, você toparia testar com desconto por 3 meses?</Label>
          <div className="mt-3">
            <RadioGroup options={PILOTO} value={d.q10} onChange={v => u('q10', v as string)} />
          </div>
        </div>

        {/* LGPD */}
        <div
          className="rounded-2xl p-5 border"
          style={{ background: `${C.cream}88`, borderColor: C.blueGray }}
        >
          <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: C.navy, fontFamily: 'var(--font-montserrat)' }}>
            Consentimento LGPD
          </p>
          <div className="flex flex-col gap-3">
            {[
              { key: 'lgpd_contato' as const, label: 'Concordo em receber contato via e-mail ou telefone sobre esta pesquisa e produtos relacionados.' },
              { key: 'lgpd_dados' as const, label: 'Autorizo o uso dos meus dados de contato para fins de pesquisa de mercado, conforme art. 6º da LGPD, e compreendo que eles serão deletados em até 90 dias após o encerramento desta pesquisa.' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => u(key, !d[key])}
                  className="mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200"
                  style={{
                    borderColor: d[key] ? C.gold : C.blueGray,
                    background: d[key] ? C.gold : 'transparent',
                    minWidth: 20,
                    minHeight: 20,
                  }}
                >
                  {d[key] && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-xs leading-relaxed" style={{ color: C.textSec }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* Main Component */
export default function Home() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);

  const update = useCallback((key: keyof FormData, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const validate = (): boolean => {
    if (step === 0) return !!(data.nome && data.email && data.empresa && data.cargo && data.setor && data.regiao);
    if (step === 1) return !!(data.q1 && data.q2.length > 0);
    if (step === 2) return !!(data.q3 && data.q4 && data.q5);
    if (step === 3) return !!(data.q6 && data.q7);
    if (step === 4) return !!(data.q8 && data.q9);
    if (step === 5) return !!(data.q10 && data.lgpd_contato && data.lgpd_dados);
    return true;
  };

  const handleNext = async () => {
    if (!validate()) {
      alert('Por favor, preencha todos os campos obrigatórios antes de continuar.');
      return;
    }
    if (step < TOTAL - 1) {
      setStep(s => s + 1);
      setTimeout(() => {
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } else {
      setLoading(true);
      try {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form_version: 'v1',
            submitted_at: new Date().toISOString(),
            nome: data.nome,
            email: data.email,
            empresa: data.empresa,
            cargo: data.cargo,
            setor: data.setor,
            regiao: data.regiao,
            q1: data.q1,
            q2: data.q2,
            q3: data.q3,
            q4: data.q4,
            q5: data.q5,
            q6: data.q6,
            q7: data.q7,
            q8: data.q8,
            q9: data.q9,
            q10: data.q10,
            lgpd_contato: data.lgpd_contato,
            lgpd_dados: data.lgpd_dados,
            honeypot: '',
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(result?.error ?? 'Falha ao enviar a pesquisa.');
        }

        setSubmitted(true);
        setTimeout(() => {
          formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Falha ao enviar a pesquisa.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.navy }}>
        <div className="max-w-md w-full text-center reveal">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: C.gold }}
          >
            <svg className="w-10 h-10" fill="none" stroke={C.navy} strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Obrigado, {data.nome.split(' ')[0]}!
          </h1>
          <p className="text-base mb-2" style={{ color: C.blueGray, fontFamily: 'var(--font-open-sans)' }}>
            Suas respostas foram recebidas com sucesso.
          </p>
          <p className="text-sm" style={{ color: C.blueGray, fontFamily: 'var(--font-open-sans)' }}>
            Entraremos em contato em breve pelo e-mail <strong style={{ color: C.gold }}>{data.email}</strong>.
          </p>
          <div className="mt-8 w-10 h-1 rounded-full mx-auto" style={{ background: C.gold }} />
          <p className="mt-4 text-xs" style={{ color: '#466683', fontFamily: 'var(--font-open-sans)' }}>
            <Link
              href="https://nocobi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-transparent hover:decoration-current transition-all"
              style={{ color: C.gold }}
            >
              nocobi
            </Link>{' '}
            — Pesquisa de Processo Operacional Ambiental 2026
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="nocobi-shell min-h-screen" style={{ background: '#F0F4F8' }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between" style={{ background: C.navy }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: C.gold }}>
            <svg className="w-4 h-4" fill="none" stroke={C.navy} strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <Link
            href="https://nocobi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold text-sm tracking-wide underline decoration-transparent hover:decoration-current transition-all"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            nocobi
          </Link>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: `${C.gold}22`, color: C.gold, fontFamily: 'var(--font-montserrat)' }}>
          Pesquisa 2026
        </span>
      </header>

      {/* ── Hero ── */}
      <section className="px-6 py-12 sm:py-16 text-center relative overflow-hidden" style={{ background: C.navy }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #33A0FF 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ background: `${C.gold}22`, color: C.gold, fontFamily: 'var(--font-montserrat)' }}
          >
            Pesquisa de Mercado — Confidencial
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Processo Operacional Ambiental:
            <br />
            <span style={{ color: C.gold }}>Como as empresas gerenciam hoje?</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: C.blueGray, fontFamily: 'var(--font-open-sans)' }}>
            Esta pesquisa é 100% confidencial e leva cerca de <strong className="text-white">10 a 15 minutos</strong> para ser respondida.
            Seus dados não serão compartilhados com terceiros.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            {['10 perguntas', 'Totalmente anônimo', 'Resultados compartilhados'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.blueGray, fontFamily: 'var(--font-open-sans)' }}>
                <span style={{ color: C.gold }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form card ── */}
      <section className="px-4 py-10 max-w-2xl mx-auto w-full">
        <div
          ref={formCardRef}
          className="rounded-3xl p-6 sm:p-10 shadow-xl reveal"
          style={{ background: C.white, boxShadow: `0 20px 60px ${C.navy}20` }}
        >
          <ProgressBar step={step} />

          <form onSubmit={e => e.preventDefault()}>
            {step === 0 && <Step0 d={data} u={(k, v) => update(k, v)} />}
            {step === 1 && <Step1 d={data} u={update} />}
            {step === 2 && <Step2 d={data} u={(k, v) => update(k, v as string)} />}
            {step === 3 && <Step3 d={data} u={(k, v) => update(k, v as string)} />}
            {step === 4 && <Step4 d={data} u={(k, v) => update(k, v as string)} />}
            {step === 5 && <Step5 d={data} u={update} />}

            <NavButtons
              step={step}
              onBack={() => {
                setStep(s => s - 1);
                setTimeout(() => {
                  formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 0);
              }}
              onNext={handleNext}
              isLast={step === TOTAL - 1}
              loading={loading}
            />
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: C.textSec, fontFamily: 'var(--font-open-sans)' }}>
                    <br />
          Pesquisa realizada pela{' '}
          <Link
            href="https://nocobi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline decoration-transparent hover:decoration-current transition-all"
            style={{ color: C.navy }}
          >
            nocobi
          </Link>{' '}
          para fins de entendimento de mercado e desenvolvimento de produto.
        </p>
      </section>
    </div>
  );
}

