import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { About } from '../components/About';
import { eventCardId, eventTitleId } from '../components/EventCard';
import { EventsSection } from '../components/EventsSection';
import { Faq } from '../components/Faq';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { LaunchChecklist } from '../components/LaunchChecklist';
import { Resources } from '../components/Resources';
import type { VolunteerFormHandle } from '../components/VolunteerForm';
import { VolunteerSection } from '../components/VolunteerSection';
import { basePath, formspreeFormId, isDevelopment } from '../config/env';
import { copy } from '../content/en';
import { loadEvents } from '../data';
import {
  findPublicEvent,
  FUTURE_OPPORTUNITIES_ID,
  getRegistrationState,
  partitionEvents,
  type CityFilter,
} from '../lib/events';
import { readEventIdFromSearch } from '../lib/links';
import type { CommunityEvent } from '../types/events';

interface AppProps {
  /** Overrides for tests. The real site loads events from src/data. */
  events?: CommunityEvent[];
  now?: Date;
  search?: string;
}

export function App({ events: providedEvents, now: providedNow, search = window.location.search }: AppProps) {
  const [now] = useState(() => providedNow ?? new Date());
  const events = useMemo(() => providedEvents ?? loadEvents(now), [providedEvents, now]);
  const { upcoming, past } = useMemo(() => partitionEvents(events, now), [events, now]);

  // Shared links look like ?event=EVENT-ID and work on any static host.
  const requestedEventId = useMemo(() => readEventIdFromSearch(search), [search]);
  const linkedEvent = requestedEventId ? findPublicEvent(events, requestedEventId) : undefined;
  const linkedEventMissing = requestedEventId !== null && !linkedEvent;

  const [filter, setFilter] = useState<CityFilter>('all');
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set(linkedEvent ? [linkedEvent.id] : []),
  );
  const formRef = useRef<VolunteerFormHandle>(null);
  const notFoundRef = useRef<HTMLDivElement>(null);

  const focusEvent = (eventId: string) => {
    document.getElementById(eventCardId(eventId))?.scrollIntoView({ block: 'start' });
    document.getElementById(eventTitleId(eventId))?.focus({ preventScroll: true });
  };

  // On arrival through a shared link, bring the event (or the notice) into view.
  const linkedEventId = linkedEvent?.id ?? null;
  useEffect(() => {
    if (linkedEventId) {
      focusEvent(linkedEventId);
    } else if (linkedEventMissing) {
      notFoundRef.current?.scrollIntoView({ block: 'start' });
      notFoundRef.current?.focus({ preventScroll: true });
    }
  }, [linkedEventId, linkedEventMissing]);

  const toggleEvent = (eventId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const showEvent = (eventId: string) => {
    // Render the expanded card first so there is something to scroll to.
    flushSync(() => {
      setFilter('all');
      setExpandedIds((current) => new Set(current).add(eventId));
    });
    focusEvent(eventId);
  };

  const volunteerForEvent = (eventId: string) => formRef.current?.selectEvent(eventId);
  const askAboutFuture = () => formRef.current?.selectEvent(FUTURE_OPPORTUNITIES_ID);

  const nextEvent = upcoming.find((event) => event.publicationStatus !== 'cancelled');
  const signupAvailable = formspreeFormId !== null;

  return (
    <>
      <a
        href="#main"
        className="bg-charcoal sr-only z-50 rounded-xl px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {copy.skipLink}
      </a>
      <div id="top" />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero
          nextEvent={nextEvent}
          nextEventRegistration={nextEvent ? getRegistrationState(nextEvent, now) : undefined}
          hasUpcomingEvents={nextEvent !== undefined}
          signupAvailable={signupAvailable}
          onShowEvent={showEvent}
          onVolunteerForEvent={volunteerForEvent}
          onAskAboutFuture={askAboutFuture}
        />
        <About />
        <EventsSection
          upcoming={upcoming}
          past={past}
          now={now}
          filter={filter}
          onFilterChange={setFilter}
          expandedIds={expandedIds}
          onToggle={toggleEvent}
          onVolunteer={volunteerForEvent}
          onAskAboutFuture={askAboutFuture}
          signupAvailable={signupAvailable}
          linkedEventId={linkedEventId}
          linkedEventMissing={linkedEventMissing}
          notFoundRef={notFoundRef}
        />
        <VolunteerSection events={events} privacyHref={`${basePath}privacy.html`} formRef={formRef} />
        <Resources />
        <Faq />
      </main>
      {isDevelopment && <LaunchChecklist />}
      <Footer privacyHref={`${basePath}privacy.html`} />
    </>
  );
}
