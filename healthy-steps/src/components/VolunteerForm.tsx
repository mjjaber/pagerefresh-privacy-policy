import { useEffect, useImperativeHandle, useMemo, useRef, useState, type FormEvent, type Ref } from 'react';
import { formspreeFormId } from '../config/env';
import { siteConfig } from '../config/site.config';
import { copy, type FailureKind } from '../content/en';
import { getRole } from '../data/roles';
import { formatShortDate, formatTimeRange } from '../lib/datetime';
import { ANY_SHIFT_ID, FUTURE_OPPORTUNITIES_ID, getOpenEvents } from '../lib/events';
import { submitVolunteerRequest } from '../lib/formspree';
import {
  buildRequestSummary,
  buildSubmissionPayload,
  changeEvent,
  describeShift,
  emptyFormValues,
  fieldOrder,
  getRoleOptions,
  getShiftOptions,
  isFuturePath,
  validateForm,
  type FieldErrors,
  type FieldName,
  type RequestSummary,
  type VolunteerFormValues,
} from '../lib/volunteerForm';
import type { CommunityEvent } from '../types/events';
import { ContactDetails, hasAnyContact } from './ContactDetails';
import { ChoiceGroup, errorId, FieldError, SelectField, TextAreaField, TextField } from './FormFields';
import { AlertIcon, CheckCircleIcon, InfoIcon } from './Icons';

export interface VolunteerFormHandle {
  /** Preselects an event (or the future opportunities path) and moves focus to the form. */
  selectEvent: (eventId: string) => void;
}

interface VolunteerFormProps {
  events: CommunityEvent[];
  /** Address of the privacy page. */
  privacyHref: string;
  /** Public Formspree form ID, or null when signup is not configured. */
  formId?: string | null;
  ref?: Ref<VolunteerFormHandle>;
}

type Phase = 'editing' | 'submitting' | 'success';
type FocusTarget = 'event' | 'errors' | 'failure' | 'success' | 'unavailable';

/** The id of each field's first focusable control. */
const fieldId = (name: FieldName) => `volunteer-${name}`;

const fieldLabels: Partial<Record<FieldName, string>> = {
  eventId: 'Event',
  roleId: copy.form.roleLegend,
  shiftId: copy.form.shiftLegend,
  fullName: copy.form.nameLabel,
  email: copy.form.emailLabel,
  phone: copy.form.phoneLabel,
  city: copy.form.cityLabel,
  languages: copy.form.languagesLabel,
  skills: copy.form.skillsLabel,
  note: copy.form.noteLabel,
  consent: 'Consent to be contacted',
};

export function VolunteerForm({ events, privacyHref, formId = formspreeFormId, ref }: VolunteerFormProps) {
  const openEvents = useMemo(() => getOpenEvents(events, new Date()), [events]);
  const initialValues = (): VolunteerFormValues => ({
    ...emptyFormValues,
    // With nothing open, the only choice is the future opportunities path.
    eventId: openEvents.length === 0 ? FUTURE_OPPORTUNITIES_ID : '',
  });

  const [values, setValues] = useState<VolunteerFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const [phase, setPhase] = useState<Phase>('editing');
  const [failure, setFailure] = useState<FailureKind | null>(null);
  const [successSummary, setSuccessSummary] = useState<RequestSummary | null>(null);
  /** What to focus after the next render. */
  const [focusRequest, setFocusRequest] = useState<{ target: FocusTarget } | null>(null);
  /** A fresh object every time, so asking for the same target twice still moves focus. */
  const requestFocus = (target: FocusTarget) => setFocusRequest({ target });

  const submittingRef = useRef(false);
  const eventSelectRef = useRef<HTMLSelectElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const failureRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const unavailableRef = useRef<HTMLHeadingElement>(null);

  const selectedEvent = events.find((event) => event.id === values.eventId);
  const roleOptions = getRoleOptions(selectedEvent, values.eventId);
  const shiftOptions = getShiftOptions(selectedEvent, values.eventId);
  const selectedRole = getRole(values.roleId);
  const isConfigured = formId !== null;

  // Moves keyboard focus once the element it needs has been rendered.
  useEffect(() => {
    if (!focusRequest) return;
    const targets = {
      event: eventSelectRef,
      errors: errorSummaryRef,
      failure: failureRef,
      success: successRef,
      unavailable: unavailableRef,
    } as const;
    const element = targets[focusRequest.target].current;
    if (element) {
      element.focus({ preventScroll: true });
      element.scrollIntoView({ block: focusRequest.target === 'event' ? 'center' : 'start' });
    }
  }, [focusRequest]);

  useImperativeHandle(ref, () => ({
    selectEvent(eventId: string) {
      if (!isConfigured) {
        requestFocus('unavailable');
        return;
      }
      const isKnown = eventId === FUTURE_OPPORTUNITIES_ID || openEvents.some((event) => event.id === eventId);
      const nextId = isKnown ? eventId : '';
      const nextEvent = events.find((event) => event.id === nextId);
      setValues((current) => changeEvent(phase === 'success' ? initialValues() : current, nextId, nextEvent));
      setPhase('editing');
      setFailure(null);
      setErrors((current) => ({ ...current, eventId: undefined, roleId: undefined, shiftId: undefined }));
      requestFocus('event');
    },
  }));

  const update = <K extends FieldName>(name: K, value: VolunteerFormValues[K]) => {
    setValues((current) => ({ ...current, [name]: value }));
    // Once someone has tried to send, clear each error as they fix it.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleEventChange = (nextId: string) => {
    const nextEvent = events.find((event) => event.id === nextId);
    setValues((current) => changeEvent(current, nextId, nextEvent));
    setErrors((current) => ({ ...current, eventId: undefined, roleId: undefined, shiftId: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Guards against double clicks and repeated Enter presses.
    if (submittingRef.current || !formId) return;

    const validationErrors = validateForm(values, { event: selectedEvent, now: new Date() });
    setErrors(validationErrors);
    setHasTriedSubmit(true);
    setFailure(null);
    if (Object.keys(validationErrors).length > 0) {
      requestFocus('errors');
      return;
    }

    submittingRef.current = true;
    setPhase('submitting');
    const summary = buildRequestSummary(values, selectedEvent);
    const result = await submitVolunteerRequest(formId, buildSubmissionPayload(values, selectedEvent));
    submittingRef.current = false;

    if (result.status === 'success') {
      // Only reached when the form service acknowledged the request.
      setSuccessSummary(summary);
      setValues(initialValues());
      setErrors({});
      setHasTriedSubmit(false);
      setPhase('success');
      requestFocus('success');
      return;
    }

    // Keep everything the visitor typed so they can try again.
    setPhase('editing');
    setFailure(result.kind);
    setErrors(result.fieldErrors);
    requestFocus('failure');
  };

  const focusField = (name: FieldName) => {
    document.getElementById(fieldId(name))?.focus();
  };

  if (!isConfigured) {
    return (
      <div className="card border-line border-2 border-dashed">
        <div className="flex items-start gap-4">
          <span className="bg-gold-soft flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <InfoIcon width={24} height={24} />
          </span>
          <div>
            <h3 ref={unavailableRef} tabIndex={-1} className="text-xl font-extrabold">
              {copy.form.unavailableTitle}
            </h3>
            <p className="mt-2">{copy.form.unavailableText}</p>
            {hasAnyContact() ? (
              <>
                <p className="mt-4 font-semibold">{copy.form.unavailableContact}</p>
                <ContactDetails className="mt-1" />
              </>
            ) : (
              <p className="mt-4 font-semibold">{copy.form.unavailableNoContact}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'success' && successSummary) {
    return (
      <div className="card border-teal border-2" role="status">
        <div className="flex items-start gap-4">
          <span className="bg-sage text-teal-dark flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <CheckCircleIcon width={28} height={28} />
          </span>
          <div className="min-w-0">
            <h3 ref={successRef} tabIndex={-1} className="text-2xl font-extrabold">
              {copy.form.successTitle}
            </h3>
            <p className="mt-2 text-lg">{copy.form.successText}</p>
          </div>
        </div>

        <div className="bg-warm-white mt-6 rounded-2xl p-5">
          <h4 className="font-extrabold">{copy.form.successSummaryTitle}</h4>
          <SummaryList summary={successSummary} />
        </div>

        <p className="text-muted mt-6 text-[0.9375rem]">{copy.volunteer.requestNotice}</p>

        <div className="mt-6">
          <p className="font-bold">{copy.form.successChange}</p>
          <ChangeRequestHelp />
        </div>

        <button
          type="button"
          className="btn btn-secondary mt-6"
          onClick={() => {
            setPhase('editing');
            setSuccessSummary(null);
            requestFocus('event');
          }}
        >
          {copy.form.successAnother}
        </button>
      </div>
    );
  }

  const errorEntries = fieldOrder.flatMap((name) => (errors[name] ? [{ name, message: errors[name] }] : []));
  const isSubmitting = phase === 'submitting';
  const noteCountId = `${fieldId('note')}-count`;

  return (
    <form className="card" noValidate onSubmit={handleSubmit} aria-labelledby="volunteer-form-title">
      <h3 id="volunteer-form-title" className="text-2xl font-extrabold">
        {copy.form.title}
      </h3>
      <p className="text-muted mt-1 text-[0.9375rem]">{copy.form.requiredNote}</p>

      <p className="bg-gold-soft text-charcoal mt-5 flex items-start gap-3 rounded-2xl p-4 text-[0.9375rem]">
        <InfoIcon className="mt-0.5 shrink-0" />
        <span>{copy.volunteer.requestNotice}</span>
      </p>

      {hasTriedSubmit && errorEntries.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="border-danger bg-danger-soft mt-6 rounded-2xl border-2 p-5"
        >
          <p className="text-danger flex items-center gap-2 font-extrabold">
            <AlertIcon />
            {copy.form.errorSummaryTitle(errorEntries.length)}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {errorEntries.map(({ name, message }) => (
              <li key={name}>
                <a
                  className="text-danger font-semibold underline underline-offset-4"
                  href={`#${fieldId(name)}`}
                  onClick={(clickEvent) => {
                    clickEvent.preventDefault();
                    focusField(name);
                  }}
                >
                  {fieldLabels[name] ?? name}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {failure && (
        <div
          ref={failureRef}
          tabIndex={-1}
          role="alert"
          className="border-danger bg-danger-soft mt-6 rounded-2xl border-2 p-5"
        >
          <p className="text-danger flex items-start gap-2 font-extrabold">
            <AlertIcon className="mt-0.5 shrink-0" />
            {copy.form.failure[failure].title}
          </p>
          <p className="mt-2">{copy.form.failure[failure].text}</p>
          {hasAnyContact() && (
            <>
              <p className="mt-3 font-semibold">{copy.form.failureContact}</p>
              <ContactDetails className="mt-1" />
            </>
          )}
        </div>
      )}

      <div className="mt-8 space-y-7">
        <SelectField
          id={fieldId('eventId')}
          selectRef={eventSelectRef}
          name="eventId"
          label={copy.form.eventLabel}
          hint={openEvents.length === 0 ? copy.form.noOpenEvents : copy.form.eventHint}
          error={errors.eventId}
          value={values.eventId}
          onChange={(changeEventArg) => handleEventChange(changeEventArg.target.value)}
        >
          <option value="">{copy.form.eventPlaceholder}</option>
          {openEvents.map((event) => (
            <option key={event.id} value={event.id}>
              {[event.title, event.start ? formatShortDate(event.start) : copy.events.dateTbc, event.city].join(' · ')}
            </option>
          ))}
          <option value={FUTURE_OPPORTUNITIES_ID}>{copy.form.futureOption}</option>
        </SelectField>

        {values.eventId && (
          <div className="bg-sage/60 rounded-2xl p-5" aria-live="polite">
            <p className="text-teal-dark text-sm font-extrabold tracking-wide uppercase">{copy.form.summaryTitle}</p>
            {isFuturePath(values.eventId) ? (
              <p className="mt-1">{copy.form.summaryFuture}</p>
            ) : selectedEvent ? (
              <>
                <p className="mt-1 text-lg font-extrabold">{selectedEvent.title}</p>
                <p className="font-semibold">
                  {selectedEvent.start
                    ? `${formatShortDate(selectedEvent.start)}, ${formatTimeRange(selectedEvent.start, selectedEvent.end)}`
                    : copy.events.dateTbc}
                </p>
                <p className="text-muted">
                  {[selectedEvent.venue ?? copy.events.venueTbc, selectedEvent.city].join(' · ')}
                </p>
                {selectedEvent.isDemo && (
                  <p className="text-charcoal mt-3 flex items-start gap-2 text-[0.9375rem] font-semibold">
                    <InfoIcon className="mt-0.5 shrink-0" width={18} height={18} />
                    {copy.events.demoNotice}
                  </p>
                )}
              </>
            ) : null}
          </div>
        )}

        <ChoiceGroup
          id={fieldId('roleId')}
          name="roleId"
          legend={copy.form.roleLegend}
          options={roleOptions.map((role) => ({ value: role.id, label: role.label, description: role.description }))}
          value={values.roleId}
          onChange={(roleId) => update('roleId', roleId)}
          error={errors.roleId}
          emptyText={copy.form.roleNeedsEvent}
        />

        {shiftOptions.length > 0 && (
          <ChoiceGroup
            id={fieldId('shiftId')}
            name="shiftId"
            legend={copy.form.shiftLegend}
            options={[
              ...shiftOptions.map((shift) => ({ value: shift.id, label: describeShift(shift) })),
              { value: ANY_SHIFT_ID, label: copy.form.anyShift, description: copy.form.anyShiftHint },
            ]}
            value={values.shiftId}
            onChange={(shiftId) => update('shiftId', shiftId)}
            error={errors.shiftId}
          />
        )}

        {selectedRole?.isHealthcare && (
          <fieldset className="border-sage-dark space-y-5 rounded-2xl border-2 p-5">
            <legend className="px-2 font-extrabold">{copy.form.healthcareTitle}</legend>
            <p className="text-[0.9375rem]">{copy.form.healthcareNotice}</p>
            <SelectField
              id={fieldId('professionalCategory')}
              name="professionalCategory"
              label={copy.form.professionalCategoryLabel}
              optional
              value={values.professionalCategory}
              onChange={(changeArg) => update('professionalCategory', changeArg.target.value)}
            >
              <option value="">{copy.form.professionalCategoryPlaceholder}</option>
              {copy.form.professionalCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </SelectField>
            <TextField
              id={fieldId('professionalExperience')}
              name="professionalExperience"
              label={copy.form.professionalExperienceLabel}
              optional
              hint={copy.form.professionalExperienceHint}
              maxLength={200}
              value={values.professionalExperience}
              onChange={(changeArg) => update('professionalExperience', changeArg.target.value)}
            />
          </fieldset>
        )}

        <fieldset className="space-y-6">
          <legend className="text-xl font-extrabold">{copy.form.aboutYouTitle}</legend>
          <TextField
            id={fieldId('fullName')}
            name="name"
            label={copy.form.nameLabel}
            autoComplete="name"
            maxLength={120}
            error={errors.fullName}
            value={values.fullName}
            onChange={(changeArg) => update('fullName', changeArg.target.value)}
          />
          <TextField
            id={fieldId('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            label={copy.form.emailLabel}
            hint={copy.form.emailHint}
            maxLength={254}
            error={errors.email}
            value={values.email}
            onChange={(changeArg) => update('email', changeArg.target.value)}
          />
          <TextField
            id={fieldId('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            label={copy.form.phoneLabel}
            optional
            hint={copy.form.phoneHint}
            maxLength={30}
            error={errors.phone}
            value={values.phone}
            onChange={(changeArg) => update('phone', changeArg.target.value)}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              id={fieldId('city')}
              name="city"
              autoComplete="address-level2"
              label={copy.form.cityLabel}
              optional
              maxLength={80}
              error={errors.city}
              value={values.city}
              onChange={(changeArg) => update('city', changeArg.target.value)}
            />
            <TextField
              id={fieldId('languages')}
              name="languages"
              label={copy.form.languagesLabel}
              optional
              hint={copy.form.languagesHint}
              maxLength={120}
              error={errors.languages}
              value={values.languages}
              onChange={(changeArg) => update('languages', changeArg.target.value)}
            />
          </div>
          <TextField
            id={fieldId('skills')}
            name="skills"
            label={copy.form.skillsLabel}
            optional
            maxLength={200}
            error={errors.skills}
            value={values.skills}
            onChange={(changeArg) => update('skills', changeArg.target.value)}
          />
          <TextAreaField
            id={fieldId('note')}
            name="note"
            label={copy.form.noteLabel}
            optional
            hint={copy.form.noteHint}
            maxLength={siteConfig.noteMaxLength}
            rows={4}
            error={errors.note}
            value={values.note}
            onChange={(changeArg) => update('note', changeArg.target.value)}
            footerId={noteCountId}
            footer={
              <p id={noteCountId} className="text-muted mt-1 text-right text-sm">
                {copy.form.noteCount(values.note.length, siteConfig.noteMaxLength)}
              </p>
            }
          />
        </fieldset>

        {/* Honeypot for automated spam. Hidden from people and assistive technology. */}
        <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
          <label htmlFor="volunteer-gotcha">{copy.form.honeypotLabel}</label>
          <input
            id="volunteer-gotcha"
            name="_gotcha"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.gotcha}
            onChange={(changeArg) => update('gotcha', changeArg.target.value)}
          />
        </div>

        <div>
          <label className="choice">
            <input
              id={fieldId('consent')}
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(changeArg) => update('consent', changeArg.target.checked)}
              required
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? errorId(fieldId('consent')) : undefined}
            />
            <span className="font-semibold">{copy.form.consentLabel}</span>
          </label>
          <FieldError id={fieldId('consent')} message={errors.consent} />
          <p className="text-muted mt-3 text-[0.9375rem]">
            {copy.form.consentPrivacyLead}{' '}
            <a className="text-link" href={privacyHref}>
              {copy.form.consentPrivacyLink}
            </a>
            .
          </p>
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto aria-disabled:cursor-progress aria-disabled:opacity-70"
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? copy.form.submitting : copy.form.submit}
          </button>
          <p role="status" className="sr-only">
            {isSubmitting ? copy.form.submitting : ''}
          </p>
        </div>

        <div className="border-sage-dark border-t pt-6 text-[0.9375rem]">
          <ChangeRequestHelp />
        </div>
      </div>
    </form>
  );
}

function SummaryList({ summary }: { summary: RequestSummary }) {
  const rows = [
    { label: copy.form.summaryLabels.event, value: summary.eventTitle },
    { label: copy.form.summaryLabels.when, value: summary.eventWhen },
    { label: copy.form.summaryLabels.where, value: summary.eventWhere },
    { label: copy.form.summaryLabels.role, value: summary.roleLabel },
    { label: copy.form.summaryLabels.shift, value: summary.shiftLabel },
  ].flatMap((row) => (row.value ? [{ label: row.label, value: row.value }] : []));
  return (
    <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-muted font-semibold">{row.label}</dt>
          <dd className="font-bold">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** How to change or cancel. A real contact when verified; honest wording when not. */
export function ChangeRequestHelp() {
  return hasAnyContact() ? (
    <>
      <p>{copy.changeRequest.withContact}</p>
      <ContactDetails className="mt-1" />
    </>
  ) : (
    <p>{copy.changeRequest.withoutContact}</p>
  );
}
