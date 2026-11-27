import { copy } from '../content/en';
import { ExternalLinkIcon, InfoIcon } from './Icons';

export function Resources() {
  return (
    <section id="resources" aria-labelledby="resources-title" className="section bg-sage/45">
      <div className="page-container">
        <p className="eyebrow">{copy.resources.eyebrow}</p>
        <h2 id="resources-title" className="section-title">
          {copy.resources.title}
        </h2>
        <p className="lead">{copy.resources.intro}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <dl className="space-y-6">
              {copy.resources.points.map((point) => (
                <div key={point.title} className="border-gold border-l-4 pl-5">
                  <dt className="text-lg font-extrabold">{point.title}</dt>
                  <dd className="mt-1">{point.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 flex items-start gap-3 rounded-2xl bg-white p-5 text-[0.9375rem] shadow-(--shadow-soft)">
              <InfoIcon className="text-teal mt-0.5 shrink-0" />
              <span>{copy.disclaimer}</span>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-extrabold">{copy.resources.linksTitle}</h3>
            <ul className="mt-4 space-y-4">
              {copy.resources.links.map((link) => (
                <li key={link.url} className="rounded-2xl bg-white p-5 shadow-(--shadow-soft)">
                  <a
                    className="text-link inline-flex min-h-11 items-center gap-2 text-lg"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      {link.label}
                      <span className="sr-only"> {copy.externalLinkNote}</span>
                    </span>
                    <ExternalLinkIcon className="shrink-0" width={18} height={18} />
                  </a>
                  <p className="text-muted mt-1 text-[0.9375rem]">{link.description}</p>
                  <p className="text-muted mt-1 text-sm font-bold">{link.source}</p>
                </li>
              ))}
            </ul>
            <p className="text-charcoal mt-6 text-[0.9375rem]">{copy.resources.riskTestNote}</p>
            <p className="text-muted mt-3 text-[0.9375rem]">{copy.resources.affiliationNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
