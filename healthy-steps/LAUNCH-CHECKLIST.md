# Launch checklist

The website code is complete. These items need a person with the right access or authority. Tick them
off here as they are done. The same open items appear in a yellow box when you run `npm run dev`.

## Must be done before volunteers can register

- [ ] **Formspree form connected.** Create the form and set the repository variable
      `VITE_FORMSPREE_FORM_ID` (README, "Connect the volunteer form"). Until then the site shows
      "Volunteer signup is not available yet".
- [ ] **Notification recipients set** in the Formspree dashboard to an inbox organizers actually read.
- [ ] **Synthetic test request verified.** Send "TEST - please ignore" from the deployed site, confirm
      it reaches the Formspree dashboard and the inbox, then delete it. Live delivery is unverified
      until this is done.
- [ ] **Formspree plan checked.** Confirm the current monthly submission allowance and whether it is
      enough for your events. Check the form's spam protection settings.
- [ ] **Verified organizer contact** added to `src/config/site.config.ts` (`contact.email`, optionally
      name and phone). Volunteers need it to change or cancel a request and to ask for deletion.
- [ ] **Retention policy chosen** and written in `site.config.ts` (`privacy.retention`), for example how
      long after an event requests are deleted, and who deletes them in Formspree and in the inbox.
- [ ] **Privacy notice reviewed** by the organizers (wording is in `src/content/en.ts` under `privacy`)
      and dated in `site.config.ts` (`privacy.lastUpdated`). Confirm the statement about who can see
      requests matches who really has access to the Formspree account and inbox.

## Must be done before calling the site live

- [ ] **GitHub Pages source set to "GitHub Actions"** (Settings > Pages).
- [ ] **Changes merged to `main`** and the "Check and deploy to GitHub Pages" workflow finished green.
- [ ] **Deployed address verified** using the list in the README ("Verify the deployed site"),
      including that the other apps in this repository still load.
- [ ] **`VITE_SITE_URL` set** to the verified address, then redeployed (enables sharing tags).

## Content to confirm

- [ ] **Final name.** "Healthy Steps Inland Empire" is a working name. Check it is free to use.
- [ ] **First real event** added to `src/data/events.ts` with confirmed date, venue, roles, and shifts.
- [ ] **Event policies** (cost, ages, accessibility) confirmed per event, or initiative-wide in
      `site.config.ts` (`policies`). The FAQ gives no specific answer until these are filled in.
- [ ] **External links opened and checked**: the three CDC links in the Resources section and the
      Formspree privacy policy link on the privacy page. They could not be opened from the build
      environment, so a person needs to click each one.
- [ ] **Health wording reviewed** by someone qualified, against current CDC guidance.
- [ ] **No clinical services advertised** unless personnel and arrangements are confirmed.

## Not included in this release (by design)

Volunteer accounts, payments, an admin dashboard, automatic shift reservation or capacity tracking,
confirmation emails, newsletters, analytics, a Spanish translation, and embedded maps.
