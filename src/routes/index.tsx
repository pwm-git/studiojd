import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  MessageCircle,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import { FormEvent, useState } from "react";

import heroImage from "@/assets/jessica-hero.jpg";
import studioJdLogo from "@/assets/studio-jd-logo.png";
import resultOne from "@/assets/hair-result-01.jpg";
import resultTwo from "@/assets/hair-result-02.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { leadSchema, submitLead, type LeadInput } from "@/lib/leads.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio JD | Especialista em Alisamentos" },
      {
        name: "description",
        content:
          "Conheça o Studio JD, especialista em alisamentos com atendimento cuidadoso e personalizado.",
      },
      { property: "og:title", content: "Studio JD | Especialista em Alisamentos" },
      {
        property: "og:description",
        content: "Alisamentos com cuidado, precisão e beleza para valorizar a sua rotina.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JessicaDantasPage,
});

const benefits = [
  { number: "01", title: "Olhar individual", text: "Cada cabelo pede uma avaliação cuidadosa antes de qualquer decisão." },
  { number: "02", title: "Execução precisa", text: "Um trabalho atento aos detalhes, com técnica e acabamento minucioso." },
  { number: "03", title: "Rotina prática", text: "Beleza pensada para facilitar seus cuidados e valorizar seu tempo." },
];

const journey = [
  ["01", "Conversa inicial", "Você conta sobre seu cabelo, sua rotina e o resultado que deseja."],
  ["02", "Avaliação", "Jessica analisa as características dos fios e alinha as possibilidades."],
  ["03", "Procedimento", "O serviço é conduzido com atenção, precisão e respeito a cada etapa."],
  ["04", "Orientação", "Você recebe orientações para cuidar do resultado no dia a dia."],
];

const faqs = [
  ["Todo cabelo pode passar por alisamento?", "A indicação depende das condições atuais dos fios e do histórico de procedimentos. Por isso, a avaliação profissional é uma etapa indispensável."],
  ["Quanto tempo dura o atendimento?", "O tempo varia conforme comprimento, volume, histórico e técnica indicada. A estimativa correta é informada após a avaliação."],
  ["Como escolher o melhor procedimento?", "Você não precisa decidir sozinha. Jessica considera o resultado desejado, a rotina e as características do seu cabelo para orientar o caminho mais adequado."],
  ["Quais cuidados devo ter depois?", "As orientações são personalizadas de acordo com o procedimento e as necessidades dos fios, ajudando a preservar acabamento e saúde capilar."],
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function JessicaDantasPage() {
  const saveLead = useServerFn(submitLead);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const candidate = {
      name: values["name"] ?? "",
      phone,
      city: values["city"] ?? "",
      birthDate: values["birthDate"] ?? "",
      consent,
    };
    const parsed = leadSchema.safeParse(candidate);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.errors[0]?.message ?? "Confira os dados informados.");
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      await saveLead({ data: parsed.data as LeadInput });
      setStatus("success");
      setMessage("Obrigada! Seus dados foram recebidos. Jessica poderá entrar em contato com você.");
      form.reset();
      setPhone("");
      setConsent(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar agora.");
    }
  }

  return (
    <main>
      <header className="absolute inset-x-0 top-0 z-20 border-b border-border/70">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#inicio" aria-label="Studio JD — início" className="flex items-center">
            <img src={studioJdLogo} alt="Studio JD" width={1024} height={1008} className="h-14 w-auto" />
          </a>
          <nav aria-label="Navegação principal" className="hidden items-center gap-8 text-xs uppercase text-muted-foreground md:flex">
            <a className="transition-colors hover:text-primary" href="#sobre">Sobre</a>
            <a className="transition-colors hover:text-primary" href="#especialidade">Especialidade</a>
            <a className="transition-colors hover:text-primary" href="#resultados">Resultados</a>
            <a className="transition-colors hover:text-primary" href="#contato">Contato</a>
          </nav>
          <Button asChild variant="luxuryOutline" className="h-10 px-4 text-xs uppercase tracking-[0.18em]">
            <a href="#agendamento">Agendar</a>
          </Button>
        </div>
      </header>

      <section id="inicio" className="relative min-h-[94svh] overflow-hidden">
        <img src={heroImage} alt="Profissional em um salão contemporâneo com plantas rosadas" width={1408} height={1712} className="absolute inset-0 h-full w-full object-cover object-[65%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/35" />
        <div className="relative mx-auto flex min-h-[94svh] max-w-7xl items-center px-5 pb-16 pt-28 lg:px-8">
          <div className="reveal-up max-w-2xl">
            <p className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-primary">
              <span className="h-px w-10 bg-primary" /> Especialista em alisamentos
            </p>
            <h1>
              <img src={studioJdLogo} alt="Studio JD — Especialista em alisamentos" width={1024} height={1008} className="w-64 sm:w-80 lg:w-96" />
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Cuidado nos detalhes. Precisão em cada etapa. Um alisamento pensado para valorizar sua beleza e simplificar sua rotina.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="luxury" size="xl"><a href="#agendamento">Agendar avaliação <ArrowRight /></a></Button>
              <Button asChild variant="luxuryOutline" size="xl"><a href="#sobre">Conheça Jessica</a></Button>
            </div>
          </div>
        </div>
        <a href="#sobre" aria-label="Ir para a próxima seção" className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Descubra <ArrowDown className="h-4 w-4 text-primary" />
        </a>
      </section>

      <section id="sobre" className="section-rule py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary">Sobre Jessica</p>
            <div className="mt-6 h-20 w-px bg-gradient-to-b from-primary to-transparent" />
          </div>
          <div>
            <h2 className="font-display text-4xl leading-tight sm:text-6xl">Beleza bem-feita nasce do <span className="italic text-pink-botanical">cuidado.</span></h2>
            <div className="mt-10 grid gap-8 text-sm leading-7 text-muted-foreground sm:grid-cols-2">
              <p>Por trás do Studio JD está Jessica, uma profissional caprichosa, correta e comprometida com um atendimento claro. Para ela, fazer bem-feito é respeitar o processo e cuidar de cada detalhe.</p>
              <p>Sua forma prática de trabalhar transforma escolhas complexas em uma experiência objetiva, acolhedora e pensada para a vida real de cada cliente.</p>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-7 text-xs uppercase tracking-[0.18em] text-foreground">
              <span className="flex items-center gap-2"><Check className="text-primary" /> Capricho</span>
              <span className="flex items-center gap-2"><Check className="text-primary" /> Transparência</span>
              <span className="flex items-center gap-2"><Check className="text-primary" /> Praticidade</span>
            </div>
          </div>
        </div>
      </section>

      <section id="especialidade" className="bg-surface-elevated py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-primary">Especialidade</p>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">Alisamento com intenção, não por impulso.</h2>
          </div>
          <div className="mt-16 grid border-y border-border md:grid-cols-3">
            {benefits.map((item) => (
              <article key={item.number} className="border-b border-border px-0 py-10 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
                <span className="font-display text-4xl text-primary/60">{item.number}</span>
                <h3 className="mt-8 text-lg font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="resultados" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div><p className="text-xs uppercase tracking-[0.25em] text-primary">Inspiração de resultados</p><h2 className="mt-5 font-display text-4xl sm:text-6xl">Leveza que se vê.</h2></div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">Imagens ilustrativas da direção de acabamento. O resultado real varia conforme a avaliação de cada cabelo.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {[resultOne, resultTwo].map((image, index) => (
              <figure key={image} className="group relative aspect-[4/3] overflow-hidden">
                <img src={image} alt={index === 0 ? "Cabelo escuro longo com acabamento liso e brilhante" : "Cabelo castanho longo com acabamento liso e natural"} loading="lazy" width={1200} height={912} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-6 pb-5 pt-16 text-xs uppercase tracking-[0.2em] text-foreground">Acabamento • movimento • brilho</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section-rule bg-surface-elevated py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Sua experiência</p>
          <h2 className="mt-5 max-w-3xl font-display text-4xl sm:text-6xl">Um caminho claro, do desejo ao cuidado.</h2>
          <div className="mt-16 grid gap-px bg-border lg:grid-cols-4">
            {journey.map(([number, title, text]) => (
              <article key={number} className="min-h-64 bg-surface-elevated p-7">
                <span className="text-xs tracking-[0.2em] text-primary">ETAPA {number}</span>
                <h3 className="mt-16 font-display text-3xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="agendamento" className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <span className="flex h-12 w-12 items-center justify-center border border-primary text-primary"><CalendarDays /></span>
            <p className="mt-10 text-xs uppercase tracking-[0.25em] text-primary">Agende seu momento</p>
            <h2 className="mt-5 font-display text-5xl leading-none sm:text-6xl">Pronta para cuidar do seu cabelo?</h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground">A agenda online estará disponível em breve. Enquanto isso, deixe seus dados ao lado para receber novidades e facilitar o primeiro contato.</p>
            <Button variant="luxury" size="xl" disabled className="mt-9"><CalendarDays /> Agenda online em preparação</Button>
          </div>

          <form id="contato" onSubmit={handleSubmit} className="border border-border bg-card p-6 sm:p-9" noValidate>
            <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
              <div><p className="text-xs uppercase tracking-[0.2em] text-primary">Quero saber mais</p><h3 className="mt-2 font-display text-3xl">Deixe seus dados</h3></div>
              <Sparkle className="h-6 w-6 text-pink-botanical" />
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-2 block text-xs text-muted-foreground">Nome completo</span><Input name="name" autoComplete="name" maxLength={100} required className="h-12" placeholder="Como você gostaria de ser chamada?" /></label>
              <label><span className="mb-2 block text-xs text-muted-foreground">Telefone</span><Input name="phone" autoComplete="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(formatPhone(event.target.value))} required className="h-12" placeholder="(00) 00000-0000" /></label>
              <label><span className="mb-2 block text-xs text-muted-foreground">Cidade</span><Input name="city" autoComplete="address-level2" maxLength={100} required className="h-12" placeholder="Sua cidade" /></label>
              <label className="sm:col-span-2"><span className="mb-2 block text-xs text-muted-foreground">Data de nascimento</span><Input name="birthDate" type="date" autoComplete="bday" max={new Date().toISOString().slice(0, 10)} required className="h-12 [color-scheme:dark]" /></label>
            </div>
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-5 text-muted-foreground">
              <Checkbox checked={consent} onCheckedChange={(value) => setConsent(value === true)} aria-label="Autorizar contato" className="mt-0.5" />
              Autorizo o uso destes dados para que Jessica Dantas entre em contato comigo sobre atendimento e novidades.
            </label>
            <Button type="submit" variant="luxury" size="xl" disabled={status === "loading"} className="mt-7 w-full">
              {status === "loading" ? "Enviando..." : "Quero receber contato"} <ArrowRight />
            </Button>
            {message && <p role="status" className={`mt-4 text-sm leading-6 ${status === "success" ? "text-primary" : "text-destructive"}`}>{message}</p>}
            <p className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Seus dados ficam protegidos e não aparecem publicamente.</p>
          </form>
        </div>
      </section>

      <section className="section-rule bg-surface-elevated py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 lg:flex-row lg:items-center lg:px-8">
          <div className="flex max-w-2xl items-start gap-5"><MessageCircle className="mt-1 h-7 w-7 shrink-0 text-pink-botanical" /><div><p className="text-xs uppercase tracking-[0.2em] text-primary">Atendimento inteligente</p><h2 className="mt-3 font-display text-3xl sm:text-4xl">Assistente virtual em breve</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Este espaço está preparado para o GPT Maker responder dúvidas e ajudar no agendamento quando a integração for conectada.</p></div></div>
          <Button variant="luxuryOutline" size="xl" disabled>Integração em preparação</Button>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div><p className="text-xs uppercase tracking-[0.25em] text-primary">Dúvidas frequentes</p><h2 className="mt-5 font-display text-4xl sm:text-5xl">Informação também é cuidado.</h2></div>
          <Accordion type="single" collapsible className="border-t border-border">
            {faqs.map(([question, answer], index) => (
              <AccordionItem value={`item-${index}`} key={question}>
                <AccordionTrigger className="py-6 text-base hover:no-underline">{question}</AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-6 leading-6 text-muted-foreground">{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="border-t border-primary/30 bg-card py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between lg:px-8">
          <div><img src={studioJdLogo} alt="Studio JD" width={1024} height={1008} loading="lazy" className="h-16 w-auto" /><p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Especialista em alisamentos</p></div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Jessica Dantas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}