import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  message: z
    .string()
    .trim()
    .min(5, "Please tell me a bit more")
    .max(2000, "Message must be under 2000 characters"),
  website: z.string().max(0).optional(), // honeypot: real visitors leave this empty
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({ name: data.name, email: data.email, message: data.message });
    if (error) {
      console.error("contact insert failed", error.message);
      throw new Error("Could not send your message. Please try again.");
    }
    return { ok: true };
  });
