# Healthy Steps Inland Empire

A static website for a community prediabetes awareness initiative serving Ontario, Eastvale, and nearby
Inland Empire communities. Visitors can learn about the initiative, find local awareness events, and
send a request to volunteer for a specific event, role, and shift.

"Healthy Steps Inland Empire" is a **working name**. Change it in one file (see
[Edit the organization details](#edit-the-organization-details)).

- **Hosting:** GitHub Pages, built and deployed by GitHub Actions. No server and no database.
- **Stack:** React, TypeScript, Vite, Tailwind CSS. Tests with Vitest and Testing Library.
- **Volunteer requests:** sent privately to [Formspree](https://formspree.io). They never touch GitHub.
- **Events:** a typed data file in this repository. Edit, push, published.

> **Status:** the code is complete and checked locally, but the site is not operational until the items
> in [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) are done. In particular, no Formspree form is connected
> yet, so the published site honestly shows "Volunteer signup is not available yet".

## Run it on your computer

You need [Node.js](https://nodejs.org) 22.22 or newer (24 recommended).

```bash
cd healthy-steps
npm ci            # install the exact dependency versions from the lockfile
npm run dev       # preview at the address it prints, with demo events
npm run check     # types + lint + tests + production build (what CI runs)
```

`npm run dev` shows three clearly labelled **demo events** and a yellow "launch checklist" box. Neither
appears on the published site.

## Where things live

| You want to change...                         | Edit this file                         |
| --------------------------------------------- | -------------------------------------- |
| Name, tagline, contact, colors, policies      | `src/config/site.config.ts`            |
| Events                                        | `src/data/events.ts`                   |
| Volunteer role names and descriptions         | `src/data/roles.ts`                    |
| Any wording on the site, including the privacy notice | `src/content/en.ts`            |
| Demo events for local preview only            | `src/data/demo-events.ts`              |
| Layout and components                         | `src/components/`, `src/pages/`        |
| Colors and base styles                        | `src/config/site.config.ts`, `src/styles/index.css` |
| Deployment                                    | `../.github/workflows/deploy-pages.yml` |

## Edit the organization details

Open `src/config/site.config.ts`. Everything about the organization is there: name, tagline, service
area, organizer contact, social links, initiative-wide policies, privacy settings, and brand colors.

**Leave a value empty until it is real.** Empty contact details, policies, and social links are simply
hidden, and the site says honestly that they are still being confirmed. Do not add nonprofit status,
sponsors, partners, endorsements, statistics, or medical services unless they are true and confirmed.

After changing colors, run `npm test`. It checks every text and background pair against WCAG AA contrast.

## Add your first real event

1. Open `src/data/events.ts` and copy the template from the comment into the `events` list.
2. Fill in **confirmed details only**. If the date or venue is not confirmed, leave that line out and
   the site will show "to be confirmed".
3. Write every time with an explicit Los Angeles offset: `-08:00` in winter (standard time), `-07:00`
   in summer (daylight saving). Example: `2027-03-13T09:00:00-08:00`.
4. List the role IDs you need in `volunteerRoleIds` (IDs are in `src/data/roles.ts`) and add shifts
   if volunteers should choose one.
5. Set `publicationStatus: 'published'` and `registrationStatus: 'open'`.
6. Run `npm test`. It catches duplicate IDs, missing offsets, unknown roles, and reversed times.
7. Commit and push to `main`. GitHub Actions rebuilds and publishes the site in a few minutes.

Never change an event `id` or shift `id` after publishing. Shared links (`?event=ID`) and submitted
requests refer to them.

### Change an event later

| Situation                          | What to set                                                        |
| ---------------------------------- | ------------------------------------------------------------------ |
| Not ready to show yet              | `publicationStatus: 'draft'`                                       |
| Stop taking volunteer requests     | `registrationStatus: 'closed'`                                     |
| Stop taking requests automatically | `registrationDeadline: '2027-03-10T23:59:00-08:00'`                |
| Event cancelled                    | `publicationStatus: 'cancelled'` and a short `cancellationNote`    |
| Event finished                     | Nothing. It moves to "Past events" once its end time passes. You may also set `publicationStatus: 'completed'`. |

Cancelled events stay visible with a notice so volunteers who signed up can see it. Past, cancelled,
closed, and past-deadline events cannot be selected in the form.

**Important:** the website does not track capacity. Roles and shifts are preferences, and the checks
above run in the visitor's browser only. Organizers must review each request against the current event
plan and confirm assignments by hand.

## Connect the volunteer form (Formspree)

The form ID is public configuration, not a password. It identifies the form and is visible in the
published JavaScript. Never put a Formspree API key, password, or any other private credential in this
repository, in `.env` files, or in GitHub variables used by the build.

1. Create a Formspree account with an email address the organizers control, and create a new form.
2. Copy the form ID: the part after `https://formspree.io/f/`.
3. In GitHub: **Settings > Secrets and variables > Actions > Variables > New repository variable**.
   Name `VITE_FORMSPREE_FORM_ID`, value the form ID. (A *variable*, not a secret.)
4. Re-run the deploy: **Actions > Check and deploy to GitHub Pages > Run workflow** on `main`.
5. For local testing, copy `.env.example` to `.env.local` and set the same value there.

If the variable is missing or malformed, the site still builds and the form area shows "Volunteer signup
is not available yet". It never pretends to collect requests.

### Notification recipients

Requests are emailed to the address on the Formspree account. To change or add recipients, use the
form's email settings in the Formspree dashboard. Additional recipients may require a paid plan.

### Spam protection

- The form includes Formspree's honeypot field (`_gotcha`), which automated spam tools tend to fill in.
- Formspree applies its own spam filtering in its dashboard. Keep it on.
- This site sends requests in the background (JSON to `https://formspree.io/f/FORM_ID`). If the
  Formspree dashboard has a CAPTCHA enabled for the form and your test request is refused, review the
  form's spam settings. No third-party challenge script is loaded by this site. If you add one later,
  update the privacy notice first.

### Limits and paid features

Checked in November 2026 from Formspree's help center; **confirm on Formspree's pricing page before
launch, because plans change**:

- The free plan allows a limited number of submissions per month (50 at the time of writing). When the
  allowance is used up, further requests are refused and the form shows an honest "not accepting more
  requests right now" message.
- Formspree also rate-limits bursts of submissions per form.
- Automatic confirmation emails to the volunteer are not set up, and on Formspree they may need a paid
  plan. The site therefore never claims a confirmation email was sent.

### Verify before calling registration operational

Send one clearly marked synthetic request from the deployed site (name "TEST - please ignore") and
confirm that it arrives in the Formspree dashboard and the notification inbox, then delete it. Until
that is done, live delivery is unverified.

## How organizers receive and manage requests

- Each request arrives in the Formspree dashboard and by email, with the event, role, and shift (IDs
  and readable labels), the contact details, the note, and the version of the consent wording.
- Treat submitted values as unverified. Check them against the current event plan.
- **Confirming an assignment is a manual step:** reply to the volunteer by email. The website never
  confirms anything automatically.
- A healthcare role selection does not verify credentials. Confirm credentials, responsibilities, and
  supervision separately before any professional duties.
- To change or cancel, volunteers contact the organizer. There is no self-service cancellation.
- There is no admin dashboard in this release. Use the Formspree dashboard and the organizer inbox.

## Deploy to GitHub Pages

In this repository the site lives in the `healthy-steps/` folder next to other small apps, and one
workflow (`.github/workflows/deploy-pages.yml`) publishes everything. The address is:

```
https://USERNAME.github.io/REPOSITORY/healthy-steps/
```

For this repository that is `https://mjjaber.github.io/pagerefresh-privacy-policy/healthy-steps/`.

The workflow:

- on every push and pull request: `npm ci`, type check, lint, tests, build (nothing is published);
- on pushes to `main` and manual runs from `main`: also uploads the site and deploys it to Pages.

One-time setup:

1. **Settings > Pages > Build and deployment > Source: GitHub Actions.**
2. If **Settings > Environments > github-pages** restricts deployment branches, make sure `main` is allowed.
3. Push to `main`, or run the workflow manually from the **Actions** tab.

### Verify the deployed site

Do not call the site live until these work at the real address:

- the main page loads with styles and illustrations;
- `privacy.html` opens directly and after a refresh;
- a shared event link such as `.../healthy-steps/?event=EVENT-ID` opens the event, also after a refresh;
- `.../healthy-steps/?event=nonsense` shows "We could not find that event";
- the other apps in this repository still load.

Then set the repository variable `VITE_SITE_URL` to the verified address (with a trailing slash) to
enable the canonical link and social sharing tags, and redeploy.

### Base path

Vite needs to know the path the site is served from. `vite.config.ts` reads `SITE_BASE_PATH`:

| Where the site is served                       | `SITE_BASE_PATH`              |
| ---------------------------------------------- | ----------------------------- |
| This repository (sub-folder of a project site) | `/REPOSITORY/healthy-steps/` (set by the workflow) |
| Its own repository as a project site           | `/REPOSITORY/`                |
| A user site (`USERNAME.github.io`) or custom domain | `/`                      |
| Not set                                        | `./` relative paths, which work at any address |

To override the workflow's default, add a repository variable named `HEALTHY_STEPS_BASE_PATH`.

There is no client-side router. The site is two real static pages (`index.html` and `privacy.html`),
and event links use a query parameter, so refreshing any address works on GitHub Pages.

### Moving to its own repository

Copy the contents of `healthy-steps/` to the root of a new repository and copy
`docs/standalone-deploy-workflow.yml` to `.github/workflows/deploy.yml`. The site is then served at
`https://USERNAME.github.io/REPOSITORY/`.

## Privacy rules for maintainers

- Never commit volunteer details to this repository, and never paste them into issues or pull requests.
- The site does not use analytics, advertising, cookies, or browser storage, and it does not write
  volunteer details to the browser console (a lint rule blocks `console` calls). Keep it that way.
- The form must not ask for diagnoses, test results, insurance details, medical history, or identity
  documents.
- Do not claim HIPAA compliance. This is not a medical records system.
- Retention and contact details in the privacy notice come from `site.config.ts`. They stay marked as
  "not set yet" until the organizers choose real values.
- Maps are plain links. Nothing is embedded or loaded from third parties.

## Health wording

Keep the tone encouraging and free of blame. Use "people with prediabetes" and "people at risk". Do not
promise cures, and do not add statistics unless they are verified, attributed, and dated. Do not
advertise glucose testing, screenings, or clinical services until the organizer confirms the personnel
and arrangements. Linking to the CDC does not make the CDC a partner; the site says so.

## Adding Spanish later

All wording is in `src/content/en.ts`. Copy it to `es.ts`, translate everything (including form errors
and the privacy notice), and only then add a language switch. Do not show a toggle for a partial
translation.

## Tests

`npm test` runs focused tests with synthetic data and mocked network responses. No real request is
ever sent. They cover event selection, role and shift reset when the event changes, registration
deadlines and closed, cancelled, past, and demo events, submission success and each failure type,
shared links, the unconfigured form state, daylight saving time, the event data file, and color
contrast.
