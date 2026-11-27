import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { copy } from '../content/en';
import { AlertIcon } from './Icons';

/**
 * Small building blocks for accessible form fields: every field has a
 * visible label, an "optional" marker where it applies, an optional hint,
 * and an error message that is linked to the input with aria-describedby.
 */

interface FieldShellProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
}

export const hintId = (id: string) => `${id}-hint`;
export const errorId = (id: string) => `${id}-error`;

function describedBy(id: string, hint: ReactNode, error: string | undefined, extra?: string): string | undefined {
  const ids = [hint ? hintId(id) : null, error ? errorId(id) : null, extra ?? null].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(id)} className="field-error">
      <AlertIcon className="mt-0.5 shrink-0" width={18} height={18} />
      <span>
        <span className="sr-only">Error: </span>
        {message}
      </span>
    </p>
  );
}

function FieldLabel({ id, label, optional }: { id: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={id} className="field-label">
      {label}
      {optional && <span className="field-optional">({copy.form.optional})</span>}
    </label>
  );
}

type TextFieldProps = FieldShellProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;

export function TextField({ id, label, optional, hint, error, ...inputProps }: TextFieldProps) {
  return (
    <div>
      <FieldLabel id={id} label={label} optional={optional} />
      {hint && (
        <p id={hintId(id)} className="field-hint">
          {hint}
        </p>
      )}
      <input
        id={id}
        className="field-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={!optional}
        {...inputProps}
      />
      <FieldError id={id} message={error} />
    </div>
  );
}

type SelectFieldProps = FieldShellProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & { children: ReactNode; selectRef?: React.Ref<HTMLSelectElement> };

export function SelectField({ id, label, optional, hint, error, children, selectRef, ...selectProps }: SelectFieldProps) {
  return (
    <div>
      <FieldLabel id={id} label={label} optional={optional} />
      {hint && (
        <p id={hintId(id)} className="field-hint">
          {hint}
        </p>
      )}
      <select
        id={id}
        ref={selectRef}
        className="field-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={!optional}
        {...selectProps}
      >
        {children}
      </select>
      <FieldError id={id} message={error} />
    </div>
  );
}

type TextAreaFieldProps = FieldShellProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & { footer?: ReactNode; footerId?: string };

export function TextAreaField({ id, label, optional, hint, error, footer, footerId, ...textareaProps }: TextAreaFieldProps) {
  return (
    <div>
      <FieldLabel id={id} label={label} optional={optional} />
      {hint && (
        <p id={hintId(id)} className="field-hint">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        className="field-input min-h-28"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error, footerId)}
        required={!optional}
        {...textareaProps}
      />
      {footer}
      <FieldError id={id} message={error} />
    </div>
  );
}

interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
}

interface ChoiceGroupProps {
  /** Also used as the id of the first option, so error links can focus it. */
  id: string;
  name: string;
  legend: string;
  options: ChoiceOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Shown instead of options when there is nothing to choose from yet. */
  emptyText?: string;
}

/** A group of large, tappable radio options. */
export function ChoiceGroup({ id, name, legend, options, value, onChange, error, emptyText }: ChoiceGroupProps) {
  return (
    <fieldset aria-describedby={error ? errorId(id) : undefined}>
      <legend className="field-label">{legend}</legend>
      {options.length === 0 && emptyText ? (
        <p className="field-hint">{emptyText}</p>
      ) : (
        <div className="mt-2 grid gap-2">
          {options.map((option, index) => (
            <label key={option.value} className="choice">
              <input
                id={index === 0 ? id : `${id}-${option.value}`}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                required
                aria-invalid={error ? true : undefined}
              />
              <span>
                <span className="font-bold">{option.label}</span>
                {option.description && <span className="text-muted block text-[0.9375rem]">{option.description}</span>}
              </span>
            </label>
          ))}
        </div>
      )}
      <FieldError id={id} message={error} />
    </fieldset>
  );
}
