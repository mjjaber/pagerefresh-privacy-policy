/* Shared vocabulary for the whole app. Keep this the single source of truth
   so views, forms, filters and the backup validator can never drift apart. */

export const APP_NAME = 'RCFZ Content Radar';
export const BACKUP_KIND = 'rcfz-content-radar-backup';
export const BACKUP_VERSION = 1;

export const PLATFORMS = [
  { id: 'facebook',  label: 'Facebook' },
  { id: 'tiktok',    label: 'TikTok' },
  { id: 'youtube',   label: 'YouTube' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'other',     label: 'Other' },
];

export const PERMISSIONS = [
  { id: 'approved',   label: 'Approved',    tone: 'ok'   },
  { id: 'waiting',    label: 'Waiting',     tone: 'warn' },
  { id: 'do_not_use', label: 'Do Not Use',  tone: 'bad'  },
];

export const CREATOR_PRIORITIES = [
  { id: 'high',   label: 'High',   tone: 'accent' },
  { id: 'normal', label: 'Normal', tone: 'tele'   },
  { id: 'low',    label: 'Low',    tone: 'neutral' },
];

export const FREQUENCIES = [
  { id: 'daily',   label: 'Daily',        days: 1  },
  { id: '3days',   label: 'Every 3 Days', days: 3  },
  { id: 'weekly',  label: 'Weekly',       days: 7  },
  { id: '2weeks',  label: 'Every 2 Weeks',days: 14 },
  { id: 'monthly', label: 'Monthly',      days: 30 },
  { id: 'custom',  label: 'Custom',       days: null },
];

export const VIDEO_PRIORITIES = [
  { id: 'must',  label: 'MUST MAKE', short: 'Must', tone: 'hot'     },
  { id: 'good',  label: 'GOOD',      short: 'Good', tone: 'tele'    },
  { id: 'maybe', label: 'MAYBE',     short: 'Maybe',tone: 'neutral' },
];

export const VIDEO_STATUSES = [
  { id: 'saved',   label: 'Saved',   tone: 'neutral' },
  { id: 'editing', label: 'Editing', tone: 'warn'    },
  { id: 'ready',   label: 'Ready',   tone: 'ok'      },
  { id: 'posted',  label: 'Posted',  tone: 'tele'    },
  { id: 'skipped', label: 'Skipped', tone: 'neutral' },
];

export const DEFAULT_CATEGORIES = [
  'RC Jets', 'RC Airliners', 'RC Warbirds', 'RC Planes', 'RC Helicopters',
  'RC Cars', 'RC Trucks', 'RC Boats', 'FPV', 'Crashes', 'Close Calls',
  'Crazy Builds', 'Giant Scale', 'Scale RC', 'Turbine', 'Funny',
  'Educational', 'Satisfying', 'Insane Skill', 'Other',
];

/* ------------------------------------------------------------- lookups -- */

const index = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

export const PLATFORM_BY_ID   = index(PLATFORMS);
export const PERMISSION_BY_ID = index(PERMISSIONS);
export const CPRIORITY_BY_ID  = index(CREATOR_PRIORITIES);
export const FREQ_BY_ID       = index(FREQUENCIES);
export const VPRIORITY_BY_ID  = index(VIDEO_PRIORITIES);
export const VSTATUS_BY_ID    = index(VIDEO_STATUSES);

export const label = (map, id, fallback = '—') => (map[id] ? map[id].label : fallback);

/* Rank helpers used by the default sort orders. */
export const VIDEO_PRIORITY_RANK = { must: 0, good: 1, maybe: 2 };
export const CREATOR_PRIORITY_RANK = { high: 0, normal: 1, low: 2 };

/* Extra weight (in "days overdue" units) that High priority creators get in
   Discovery Mode so they surface sooner without starving everyone else. */
export const DISCOVERY_PRIORITY_BONUS = { high: 5, normal: 0, low: -5 };
