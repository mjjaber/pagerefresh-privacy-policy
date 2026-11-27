import type { VolunteerRole } from '../types/events';

/**
 * The catalog of volunteer roles. An event lists the role IDs it needs in
 * `volunteerRoleIds`; only those roles are offered for that event.
 *
 * You may edit labels and descriptions freely. Do not change an `id` once
 * it has been used — organizers rely on it to read submitted requests.
 */
export const volunteerRoles: VolunteerRole[] = [
  {
    id: 'setup-cleanup',
    label: 'Event setup and cleanup',
    description: 'Help set up tables, signs, and supplies before the event, or pack up afterward.',
  },
  {
    id: 'welcome-checkin',
    label: 'Welcome and check in',
    description: 'Greet neighbors as they arrive and point them in the right direction.',
  },
  {
    id: 'activity-support',
    label: 'Activity support',
    description: 'Help walks, games, and family activities run smoothly.',
  },
  {
    id: 'education-table',
    label: 'Education table assistance',
    description:
      'Hand out approved educational materials and help visitors find resources. No health background needed.',
  },
  {
    id: 'language-support',
    label: 'Language support',
    description: 'Help neighbors who are more comfortable in a language other than English.',
  },
  {
    id: 'healthcare-professional',
    label: 'Nurse or healthcare professional',
    description:
      'Support health education with your professional background. Organizers confirm credentials and responsibilities with you separately.',
    isHealthcare: true,
  },
  {
    id: 'wherever-needed',
    label: 'Wherever help is needed',
    description: 'Happy to pitch in where the team needs you most on the day.',
  },
];

/**
 * Roles offered on the "Future volunteer opportunities" path, where no
 * specific event has been chosen.
 */
export const futureInterestRoleIds: string[] = volunteerRoles.map((role) => role.id);

export function getRole(roleId: string): VolunteerRole | undefined {
  return volunteerRoles.find((role) => role.id === roleId);
}

/** Looks up roles by ID, keeping the given order and skipping unknown IDs. */
export function getRoles(roleIds: readonly string[]): VolunteerRole[] {
  return roleIds.flatMap((id) => {
    const role = getRole(id);
    return role ? [role] : [];
  });
}
