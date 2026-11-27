import { describe, expect, it } from 'vitest';
import { siteConfig, type BrandColor } from '../config/site.config';
import { contrastRatio } from './contrast';

const { colors } = siteConfig;

/** Every text-on-background pair the site uses. WCAG AA needs 4.5:1 for normal text. */
const textPairs: [text: BrandColor, background: BrandColor][] = [
  ['charcoal', 'warmWhite'],
  ['charcoal', 'white'],
  ['charcoal', 'sage'],
  ['charcoal', 'gold'],
  ['charcoal', 'goldSoft'],
  ['charcoal', 'dangerSoft'],
  ['muted', 'warmWhite'],
  ['muted', 'white'],
  ['muted', 'sage'],
  ['teal', 'warmWhite'],
  ['teal', 'white'],
  ['teal', 'sage'],
  ['tealDark', 'sage'],
  ['white', 'teal'],
  ['white', 'tealDark'],
  ['white', 'charcoal'],
  ['sage', 'teal'],
  ['sage', 'charcoal'],
  ['danger', 'white'],
  ['danger', 'dangerSoft'],
];

/** Outlines of form fields and focus rings need 3:1 against what surrounds them. */
const nonTextPairs: [color: BrandColor, background: BrandColor][] = [
  ['border', 'white'],
  ['border', 'warmWhite'],
  ['teal', 'white'],
  ['tealDark', 'warmWhite'],
  ['tealDark', 'sage'],
  ['gold', 'charcoal'],
  ['gold', 'teal'],
  ['danger', 'white'],
];

describe('brand colors meet WCAG 2.2 AA contrast', () => {
  it.each(textPairs)('%s text on %s is at least 4.5:1', (text, background) => {
    expect(contrastRatio(colors[text], colors[background])).toBeGreaterThanOrEqual(4.5);
  });

  it.each(nonTextPairs)('%s outline on %s is at least 3:1', (color, background) => {
    expect(contrastRatio(colors[color], colors[background])).toBeGreaterThanOrEqual(3);
  });

  it('documents that gold is not readable as text on light backgrounds', () => {
    // Gold is an accent for shapes and dark backgrounds only.
    expect(contrastRatio(colors.gold, colors.white)).toBeLessThan(3);
  });
});
