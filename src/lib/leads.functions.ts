import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Informe um telefone válido com DDD."),
  city: z.string().trim().min(2, "Informe sua cidade.").max(100),
  birthDate: z
    .string()
    .date("Informe uma data de nascimento válida.")
    .refine((value) => new Date(`${value}T12:00:00`) <= new Date(), "A data não pode ser futura."),
  consent: z.literal(true, { errorMap: () => ({ message: "Autorize o contato para continuar." }) }),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: LeadInput) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const url = process.env["SUPABASE_URL"]!;
    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabase.from("jessica_leads").insert({
      name: data.name,
      phone: data.phone,
      city: data.city,
      birth_date: data.birthDate,
      consent: data.consent,
    });

    if (error) {
      console.error("Lead submission failed", { code: error.code });
      throw new Error("Não foi possível enviar agora. Tente novamente em instantes.");
    }

    return { success: true };
  });