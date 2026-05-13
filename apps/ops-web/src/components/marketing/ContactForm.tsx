"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";

type ContactFormLabels = {
  name: string;
  email: string;
  company: string;
  stage: string;
  challenge: string;
  submit: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
};

export function ContactForm({
  labels,
  locale,
}: {
  labels: ContactFormLabels;
  locale: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    stage: "",
    challenge: "",
  });
  const { addToast } = useToast();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, locale }),
      });

      if (!response.ok) {
        throw new Error("contact_failed");
      }

      setValues({
        name: "",
        email: "",
        company: "",
        stage: "",
        challenge: "",
      });
      addToast({
        type: "success",
        title: labels.successTitle,
        description: labels.successBody,
      });
    } catch {
      addToast({
        type: "error",
        title: labels.errorTitle,
        description: labels.errorBody,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[28px] border border-white/8 bg-white/[0.03] p-6 md:p-8">
      <Input
        label={labels.name}
        value={values.name}
        onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
        required
      />
      <Input
        type="email"
        label={labels.email}
        value={values.email}
        onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
        required
      />
      <Input
        label={labels.company}
        value={values.company}
        onChange={(event) => setValues((prev) => ({ ...prev, company: event.target.value }))}
        required
      />
      <Input
        label={labels.stage}
        value={values.stage}
        onChange={(event) => setValues((prev) => ({ ...prev, stage: event.target.value }))}
        placeholder="Ej. estamos relanzando / early traction / creciendo"
        required
      />
      <Textarea
        label={labels.challenge}
        value={values.challenge}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, challenge: event.target.value }))
        }
        rows={6}
        required
      />

      <Button type="submit" size="lg" loading={isSubmitting} fullWidth>
        {labels.submit}
      </Button>
    </form>
  );
}
