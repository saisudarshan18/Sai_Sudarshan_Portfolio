import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { PortfolioShell, pageMeta, portfolioLinks } from "@/components/PortfolioShell";
import { contactSchema, submitContact } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta(
      "Say hello — Sai Sudarshan",
      "Send Sai Sudarshan a message about cloud, DevOps or SRE opportunities.",
    ),
    links: portfolioLinks,
  }),
  component: ContactPage,
});

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function ContactPage() {
  const send = useServerFn(submitContact);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (k && !errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      await send({ data: parsed.data });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <PortfolioShell>
      <main id="main" className="page-contact">
        <section className="section contact-form-section">
          <div className="container contact-form-grid">
            <div className="reveal is-visible">
              <span className="section-kicker"><span>06</span> / SAY HELLO</span>
              <h1 className="contact-form-title">Got a question? <em>Drop it here.</em></h1>
              <p className="contact-form-lead">
                Tell me a little about the role, project or problem. I'll reply to the email you leave.
              </p>
            </div>
            {status === "sent" ? (
              <div className="query-card query-sent" role="status">
                <span className="success-check"><svg className="icon" aria-hidden="true"><use href="#i-check" /></svg></span>
                <h2>Message received.</h2>
                <p>Thanks for reaching out — I'll get back to you soon.</p>
                <button type="button" className="button button-text" onClick={() => setStatus("idle")}>Send another</button>
              </div>
            ) : (
              <form className="query-card" onSubmit={onSubmit} noValidate>
                <label className="query-field">
                  <span>Your name</span>
                  <input name="name" autoComplete="name" maxLength={100} aria-invalid={!!errors.name} />
                  {errors.name && <small className="query-error">{errors.name}</small>}
                </label>
                <label className="query-field">
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" maxLength={255} aria-invalid={!!errors.email} />
                  {errors.email && <small className="query-error">{errors.email}</small>}
                </label>
                <label className="query-field">
                  <span>Your query</span>
                  <textarea name="message" rows={6} maxLength={2000} aria-invalid={!!errors.message} />
                  {errors.message && <small className="query-error">{errors.message}</small>}
                </label>
                <input name="website" tabIndex={-1} autoComplete="off" className="query-hp" aria-hidden="true" />
                {status === "error" && <p className="query-error">Something went wrong. Please try again.</p>}
                <button className="button button-primary" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message"}
                  <svg className="icon" aria-hidden="true"><use href="#i-arrow" /></svg>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </PortfolioShell>
  );
}
