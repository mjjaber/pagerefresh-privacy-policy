import { siteConfig } from '../config/site.config';
import { copy } from '../content/en';
import { formatLongDate, formatTimeRange, getDateTileParts } from '../lib/datetime';
import type { RegistrationState } from '../lib/events';
import type { CommunityEvent } from '../types/events';
import { HeroIllustration } from './Illustrations';
import { ArrowRightIcon, CalendarIcon, MapPinIcon } from './Icons';

interface HeroProps {
  /** The soonest upcoming event that has not been cancelled, if any. */
  nextEvent: CommunityEvent | undefined;
  nextEventRegistration: RegistrationState | undefined;
  hasUpcomingEvents: boolean;
  /** False when the signup form is not configured, so the page never promises it. */
  signupAvailable: boolean;
  onShowEvent: (eventId: string) => void;
  onVolunteerForEvent: (eventId: string) => void;
  onAskAboutFuture: () => void;
}

export function Hero({
  nextEvent,
  nextEventRegistration,
  hasUpcomingEvents,
  signupAvailable,
  onShowEvent,
  onVolunteerForEvent,
  onAskAboutFuture,
}: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="page-container grid items-center gap-10 pt-10 pb-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-20">
        <div>
          <p className="bg-sage text-charcoal inline-flex items-center gap-2 rounded-3xl px-4 py-2 text-sm font-bold">
            <MapPinIcon className="text-teal shrink-0" width={18} height={18} />
            {copy.hero.serviceArea}
          </p>
          <h1 id="hero-title" className="text-charcoal mt-6 text-[2.5rem] leading-[1.08] font-extrabold sm:text-6xl">
            {copy.hero.headline}
          </h1>
          <p className="text-muted mt-6 max-w-xl text-lg sm:text-xl">
            {hasUpcomingEvents
              ? copy.hero.withEvents
              : `${copy.hero.withoutEvents}${signupAvailable ? ` ${copy.hero.withoutEventsSignup}` : ''}`}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#events" className="btn btn-primary">
              {copy.hero.primaryAction}
            </a>
            <a href="#volunteer" className="btn btn-secondary">
              {copy.hero.secondaryAction}
            </a>
          </div>
          <p className="text-muted mt-6 text-[0.9375rem] font-semibold italic">{siteConfig.tagline}</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2.75rem] shadow-(--shadow-lift)">
            <HeroIllustration label={copy.hero.illustrationAlt} />
          </div>
        </div>
      </div>

      <div className="page-container pb-4">
        {nextEvent ? (
          <NextEventCard
            event={nextEvent}
            canVolunteer={nextEventRegistration?.isOpen === true}
            onShowEvent={onShowEvent}
            onVolunteerForEvent={onVolunteerForEvent}
          />
        ) : (
          <div className="card border-sage-dark flex flex-col gap-5 border sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="bg-gold-soft text-charcoal flex size-12 shrink-0 items-center justify-center rounded-2xl">
                <CalendarIcon width={24} height={24} />
              </span>
              <div>
                <h2 className="text-xl font-extrabold">{copy.nextEvent.noneTitle}</h2>
                <p className="text-muted mt-1 max-w-2xl">
                  {copy.nextEvent.noneText}
                  {signupAvailable && ` ${copy.nextEvent.noneSignupText}`}
                </p>
              </div>
            </div>
            {signupAvailable && (
              <button type="button" className="btn btn-secondary shrink-0" onClick={onAskAboutFuture}>
                {copy.nextEvent.noneAction}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function NextEventCard({
  event,
  canVolunteer,
  onShowEvent,
  onVolunteerForEvent,
}: {
  event: CommunityEvent;
  canVolunteer: boolean;
  onShowEvent: (eventId: string) => void;
  onVolunteerForEvent: (eventId: string) => void;
}) {
  const tile = event.start ? getDateTileParts(event.start) : null;
  return (
    <div className="on-dark bg-teal relative overflow-hidden rounded-3xl p-6 text-white shadow-(--shadow-lift) sm:p-8">
      <div className="bg-teal-dark absolute -top-16 -right-10 size-56 rounded-full opacity-50" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-5">
          {tile && (
            <div className="bg-warm-white text-charcoal flex w-20 shrink-0 flex-col items-center rounded-2xl py-2 text-center" aria-hidden="true">
              <span className="text-teal text-xs font-extrabold tracking-widest uppercase">{tile.month}</span>
              <span className="text-3xl leading-none font-extrabold">{tile.day}</span>
              <span className="text-muted text-xs font-bold">{tile.weekday}</span>
            </div>
          )}
          <div>
            <p className="text-gold text-sm font-extrabold tracking-[0.14em] uppercase">
              {copy.nextEvent.eyebrow}
              {event.isDemo && (
                <span className="bg-warm-white text-charcoal ml-3 rounded-full px-2.5 py-0.5 text-xs tracking-normal normal-case">
                  {copy.events.demoBadge}
                </span>
              )}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">{event.title}</h2>
            <p className="text-sage mt-2 text-base font-semibold">
              {event.start
                ? `${formatLongDate(event.start)} · ${formatTimeRange(event.start, event.end)}`
                : copy.events.dateTbc}
            </p>
            <p className="text-sage flex items-center gap-1.5 text-base font-semibold">
              <MapPinIcon width={16} height={16} />
              {event.city}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          {canVolunteer && (
            <button type="button" className="btn btn-gold" onClick={() => onVolunteerForEvent(event.id)}>
              {copy.nextEvent.volunteer}
            </button>
          )}
          <button
            type="button"
            className="btn hover:bg-teal-dark border-2 border-white text-white"
            onClick={() => onShowEvent(event.id)}
          >
            {copy.nextEvent.details}
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
