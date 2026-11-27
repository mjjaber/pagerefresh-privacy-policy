import { describe, expect, it } from 'vitest';
import {
  formatLongDate,
  formatTimeRange,
  formatZoneAbbreviation,
  isIsoWithOffset,
  losAngelesOffsetAt,
  losAngelesWallTimeToIso,
} from './datetime';

describe('event times are shown in America/Los_Angeles', () => {
  it('formats a standard time event (PST)', () => {
    expect(formatLongDate('2027-01-16T09:00:00-08:00')).toBe('Saturday, January 16, 2027');
    expect(formatTimeRange('2027-01-16T09:00:00-08:00', '2027-01-16T11:30:00-08:00')).toBe('9:00 AM – 11:30 AM PST');
  });

  it('formats a daylight saving time event (PDT)', () => {
    expect(formatTimeRange('2027-06-12T09:00:00-07:00', '2027-06-12T11:30:00-07:00')).toBe('9:00 AM – 11:30 AM PDT');
    expect(formatZoneAbbreviation('2027-06-12T09:00:00-07:00')).toBe('PDT');
  });

  it('converts timestamps written in another offset to Los Angeles time', () => {
    // 17:00 UTC on a winter day is 9:00 AM in Los Angeles.
    expect(formatTimeRange('2027-01-16T17:00:00Z')).toBe('9:00 AM PST');
    // Late evening UTC is still the same calendar day in Los Angeles.
    expect(formatLongDate('2027-01-17T05:30:00Z')).toBe('Saturday, January 16, 2027');
  });

  it('handles the daylight saving changeover dates', () => {
    // 2027: clocks go forward on March 14 and back on November 7.
    expect(losAngelesWallTimeToIso(2027, 3, 13, 9)).toBe('2027-03-13T09:00:00-08:00');
    expect(losAngelesWallTimeToIso(2027, 3, 14, 9)).toBe('2027-03-14T09:00:00-07:00');
    expect(losAngelesWallTimeToIso(2027, 11, 6, 9)).toBe('2027-11-06T09:00:00-07:00');
    expect(losAngelesWallTimeToIso(2027, 11, 7, 9)).toBe('2027-11-07T09:00:00-08:00');
    expect(losAngelesOffsetAt(new Date('2027-07-01T12:00:00Z'))).toBe('-07:00');
  });
});

describe('isIsoWithOffset', () => {
  it('accepts timestamps with an explicit offset', () => {
    expect(isIsoWithOffset('2027-03-13T09:00:00-08:00')).toBe(true);
    expect(isIsoWithOffset('2027-03-13T09:00-07:00')).toBe(true);
    expect(isIsoWithOffset('2027-03-13T17:00:00Z')).toBe(true);
  });

  it('rejects timestamps without an offset or with impossible dates', () => {
    expect(isIsoWithOffset('2027-03-13T09:00:00')).toBe(false);
    expect(isIsoWithOffset('2027-03-13')).toBe(false);
    expect(isIsoWithOffset('March 13, 2027 9am')).toBe(false);
    expect(isIsoWithOffset('2027-13-40T09:00:00-08:00')).toBe(false);
  });
});
