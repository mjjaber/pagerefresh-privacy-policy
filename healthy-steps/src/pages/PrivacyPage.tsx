import { ContactDetails, hasAnyContact } from '../components/ContactDetails';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ExternalLinkIcon } from '../components/Icons';
import { LaunchChecklist } from '../components/LaunchChecklist';
import { basePath, isDevelopment } from '../config/env';
import { siteConfig } from '../config/site.config';
import { copy } from '../content/en';

/**
 * The privacy notice. It is built as its own static page (privacy.html),
 * so its address keeps working when refreshed or opened directly.
 */
export function PrivacyPage() {
  const { sections } = copy.privacy;
  const retention = siteConfig.privacy.retention.trim();
  const lastUpdated = siteConfig.privacy.lastUpdated.trim();

  return (
    <>
      <a
        href="#main"
        className="bg-charcoal sr-only z-50 rounded-xl px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {copy.skipLink}
      </a>
      <Header homeHref={basePath} />
      <main id="main" tabIndex={-1} className="section">
        <div className="page-container max-w-3xl">
          <a className="text-link inline-flex min-h-11 items-center" href={basePath}>
            ← {copy.privacy.backHome}
          </a>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">{copy.privacy.pageTitle}</h1>
          {lastUpdated && <p className="text-muted mt-3">{copy.privacy.lastUpdated(lastUpdated)}</p>}

          <section aria-labelledby="privacy-summary" className="bg-sage/60 mt-8 rounded-3xl p-6 sm:p-8">
            <h2 id="privacy-summary" className="text-xl font-extrabold">
              {copy.privacy.summaryTitle}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              {copy.privacy.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="mt-10 space-y-10 [&_h2]:text-2xl [&_h2]:font-extrabold [&_p]:mt-3">
            <section>
              <h2>{sections.who.title}</h2>
              {sections.who.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section>
              <h2>{sections.collect.title}</h2>
              <p>{sections.collect.intro}</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                {sections.collect.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2>{sections.notCollect.title}</h2>
              {sections.notCollect.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section>
              <h2>{sections.why.title}</h2>
              {sections.why.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section>
              <h2>{sections.processor.title}</h2>
              {sections.processor.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>
                <a
                  className="text-link inline-flex min-h-11 items-center gap-1.5"
                  href={sections.processor.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sections.processor.linkLabel}
                  <ExternalLinkIcon width={16} height={16} />
                  <span className="sr-only">{copy.externalLinkNote}</span>
                </a>
              </p>
            </section>

            <section>
              <h2>{sections.access.title}</h2>
              {sections.access.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section>
              <h2>{sections.retention.title}</h2>
              <p>{retention || sections.retention.unset}</p>
            </section>

            <section>
              <h2>{sections.deletion.title}</h2>
              {hasAnyContact() ? (
                <>
                  <p>{sections.deletion.withContact}</p>
                  <ContactDetails className="mt-2" />
                </>
              ) : (
                <p>{sections.deletion.withoutContact}</p>
              )}
            </section>

            <section>
              <h2>{sections.website.title}</h2>
              {sections.website.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>

            <section>
              <h2>{sections.changes.title}</h2>
              {sections.changes.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          </div>

          <p className="border-sage-dark text-muted mt-12 border-t pt-6 text-[0.9375rem]">{copy.disclaimer}</p>
        </div>
      </main>
      {isDevelopment && <LaunchChecklist />}
      <Footer privacyHref={`${basePath}privacy.html`} homeHref={basePath} />
    </>
  );
}
