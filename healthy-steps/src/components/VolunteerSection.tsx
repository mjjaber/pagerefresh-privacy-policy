import type { Ref } from 'react';
import { copy } from '../content/en';
import type { CommunityEvent } from '../types/events';
import { CheckIcon } from './Icons';
import { VolunteerIllustration } from './Illustrations';
import { VolunteerForm, type VolunteerFormHandle } from './VolunteerForm';

interface VolunteerSectionProps {
  events: CommunityEvent[];
  privacyHref: string;
  formRef: Ref<VolunteerFormHandle>;
}

export function VolunteerSection({ events, privacyHref, formRef }: VolunteerSectionProps) {
  return (
    <section id="volunteer" aria-labelledby="volunteer-title" className="section">
      <div className="page-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">{copy.volunteer.eyebrow}</p>
          <h2 id="volunteer-title" className="section-title">
            {copy.volunteer.title}
          </h2>
          <p className="lead">{copy.volunteer.intro}</p>

          <div className="mt-8 overflow-hidden rounded-[2rem] shadow-(--shadow-soft)">
            <VolunteerIllustration label={copy.volunteer.illustrationAlt} />
          </div>

          <h3 className="mt-10 text-xl font-extrabold">{copy.volunteer.waysTitle}</h3>
          <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {copy.volunteer.ways.map((way) => (
              <li key={way} className="flex items-start gap-3 font-semibold">
                <span className="bg-sage text-teal-dark mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                  <CheckIcon width={14} height={14} strokeWidth={3} />
                </span>
                {way}
              </li>
            ))}
          </ul>
          <p className="text-muted mt-5 text-[0.9375rem]">{copy.volunteer.generalVolunteerNote}</p>

          <h3 className="mt-10 text-xl font-extrabold">{copy.volunteer.howTitle}</h3>
          <ol className="mt-4 space-y-4">
            {copy.volunteer.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span
                  className="bg-teal flex size-9 shrink-0 items-center justify-center rounded-full font-extrabold text-white"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <VolunteerForm ref={formRef} events={events} privacyHref={privacyHref} />
        </div>
      </div>
    </section>
  );
}
