import type { ReactNode } from 'react';
import { siteConfig } from '../config/site.config';
import { copy } from '../content/en';
import { ContactDetails, hasAnyContact } from './ContactDetails';
import { ChevronDownIcon } from './Icons';
import { ChangeRequestHelp } from './VolunteerForm';

function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="group border-sage-dark rounded-2xl border bg-white open:shadow-(--shadow-soft)">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
        <h3 className="text-lg leading-snug font-bold">{question}</h3>
        <ChevronDownIcon className="text-teal shrink-0 transition-transform duration-150 group-open:rotate-180" />
      </summary>
      <div className="space-y-3 px-5 pb-5">{children}</div>
    </details>
  );
}

export function Faq() {
  const { items } = copy.faq;
  const policyLabels = items.eventDetails.labels;
  const policies = (Object.keys(policyLabels) as (keyof typeof policyLabels)[])
    .map((key) => ({ label: policyLabels[key], value: siteConfig.policies[key].trim() }))
    .filter((policy) => policy.value.length > 0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="section">
      <div className="page-container max-w-3xl">
        <p className="eyebrow">{copy.faq.eyebrow}</p>
        <h2 id="faq-title" className="section-title">
          {copy.faq.title}
        </h2>

        <div className="mt-8 space-y-3">
          <FaqItem question={items.experience.question}>
            {items.experience.answer.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </FaqItem>

          <FaqItem question={items.whatVolunteersDo.question}>
            {items.whatVolunteersDo.answer.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </FaqItem>

          <FaqItem question={items.confirmation.question}>
            {items.confirmation.answer.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </FaqItem>

          <FaqItem question={items.changes.question}>
            <ChangeRequestHelp />
          </FaqItem>

          <FaqItem question={items.contact.question}>
            {hasAnyContact() ? (
              <>
                <p>{items.contact.withContact}</p>
                <ContactDetails />
              </>
            ) : (
              <p>{items.contact.withoutContact}</p>
            )}
          </FaqItem>

          <FaqItem question={items.eventDetails.question}>
            {policies.length > 0 && (
              <dl className="space-y-2">
                {policies.map((policy) => (
                  <div key={policy.label}>
                    <dt className="font-bold">{policy.label}</dt>
                    <dd>{policy.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p>{items.eventDetails.fallback}</p>
          </FaqItem>

          <FaqItem question={items.medical.question}>
            {items.medical.answer.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </FaqItem>
        </div>
      </div>
    </section>
  );
}
