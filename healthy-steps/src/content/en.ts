import { siteConfig } from '../config/site.config';

/**
 * All English wording for the site lives in this file, grouped by section,
 * so the team can edit text without touching layout code.
 *
 * Adding Spanish later: copy this file to `es.ts`, translate every value
 * (including form errors and the privacy notice), and only then add a
 * language switch. Do not show a language toggle for a partial translation.
 */

const { name, serviceArea } = siteConfig;
const [cityOne = 'Ontario', cityTwo = 'Eastvale'] = serviceArea.filterCities;

export const copy = {
  skipLink: 'Skip to main content',
  externalLinkNote: '(opens in a new tab)',
  disclaimer:
    'This website provides general education and community event information. It does not provide medical advice, diagnosis, or treatment.',

  nav: {
    label: 'Main',
    links: [
      { href: '#about', label: 'About' },
      { href: '#events', label: 'Events' },
      { href: '#volunteer', label: 'Volunteer' },
      { href: '#resources', label: 'Resources' },
      { href: '#faq', label: 'FAQ' },
    ],
    volunteerButton: 'Volunteer',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    homeLabel: `${name} home`,
  },

  hero: {
    serviceArea: `Serving ${serviceArea.summary}`,
    headline: 'Small steps toward a healthier community.',
    withEvents: `Join neighbors in ${cityOne} and ${cityTwo} for prediabetes education, community activities, and opportunities to make a difference.`,
    withoutEvents: `We are neighbors in ${cityOne} and ${cityTwo} planning prediabetes education and community activities. Our next events are still being planned.`,
    withoutEventsSignup: 'You can ask to hear about future volunteer opportunities today.',
    primaryAction: 'Explore events',
    secondaryAction: 'Become a volunteer',
    illustrationAlt:
      'Illustration of neighbors of different ages walking together along a park path, with trees and foothills behind them.',
  },

  nextEvent: {
    eyebrow: 'Next event',
    details: 'See event details',
    volunteer: 'Volunteer for this event',
    noneTitle: 'Events are being planned',
    noneText: 'Dates and locations will be posted here once they are confirmed.',
    noneSignupText: 'In the meantime, you can let us know you are interested in helping.',
    noneAction: 'Ask about future volunteer opportunities',
  },

  about: {
    eyebrow: 'About',
    title: 'Neighbors helping neighbors take the next step',
    paragraphs: [
      `${name} is a community education and volunteering initiative for ${serviceArea.summary}. We want more people to know what prediabetes is and to feel supported in everyday healthy habits.`,
      'We keep things friendly and practical. Our events are meant to be places where people can ask questions, pick up reliable information, and enjoy time outdoors with neighbors.',
      'Everyone is welcome to take part, whether you are curious about your own health, supporting a family member, or looking for a way to give back. You do not need a healthcare background to volunteer.',
    ],
    activitiesTitle: 'What we are planning',
    activitiesNote:
      'These are examples of the kinds of activities we are planning. Each event listing shows what is actually confirmed for that day.',
    activities: [
      { title: 'Community walks', text: 'Relaxed group walks at a comfortable pace for all ages.' },
      { title: 'Education tables', text: 'Approved, easy to read materials about prediabetes and healthy habits.' },
      { title: 'Family activities', text: 'Simple games and activities that get everyone moving together.' },
      { title: 'Healthy habit conversations', text: 'Friendly chats about small, realistic changes.' },
    ],
  },

  events: {
    eyebrow: 'Events',
    title: 'Upcoming events',
    intro: `All times are shown in Pacific Time (${siteConfig.timezone.replace('_', ' ')}).`,
    filterLabel: 'Filter events by location',
    filterAll: 'All locations',
    resultCount: (count: number, city: string | null) =>
      `Showing ${count} ${count === 1 ? 'event' : 'events'}${city ? ` in ${city}` : ''}.`,
    emptyAllTitle: 'No upcoming events have been announced yet',
    emptyAllText: 'New events are still being planned. Confirmed dates and locations will appear here.',
    emptyAllSignupText: 'You can already tell us you would like to help.',
    emptyAllAction: 'Ask about future volunteer opportunities',
    emptyFilterTitle: (city: string) => `No upcoming events in ${city} right now`,
    emptyFilterText: 'Try another location, or view all events.',
    emptyFilterAction: 'Show all locations',
    notFoundTitle: 'We could not find that event',
    notFoundText:
      'The link you followed may be out of date, or the event may have been removed. Current events are listed below.',
    linkedNotice: 'You opened a link to this event.',
    pastTitle: 'Past events',
    demoBadge: 'Demo',
    demoNotice:
      'Demo listing for previewing the website. This is not a real event, and volunteer requests cannot be sent for it.',
    dateTbc: 'Date to be confirmed',
    timeTbc: 'Time to be confirmed',
    venueTbc: 'Venue to be confirmed',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
    detailsFor: (title: string) => `for ${title}`,
    where: 'Where',
    when: 'When',
    mapLink: 'Open in maps',
    activities: 'Planned activities',
    aboutEvent: 'About this event',
    volunteerNeeds: 'Volunteers needed',
    rolesAvailable: 'Volunteer roles',
    shiftsAvailable: 'Volunteer shifts',
    expectations: 'What volunteers can expect',
    goodToKnow: 'Good to know',
    admission: 'Cost',
    ageGuidance: 'Ages',
    accessibility: 'Accessibility',
    volunteerAction: 'Volunteer for this event',
    copyLink: 'Copy link to this event',
    linkCopied: 'Link copied.',
    linkCopyFallback: 'Copy this link:',
    cancelledNotice: 'This event has been cancelled.',
    cancelledFollowUp: 'If you had asked to volunteer, an organizer will be in touch. You do not need to do anything.',
    capacityNote:
      'Roles and shifts shown here are preferences, not live availability. Organizers review every request and confirm assignments by hand.',
    status: {
      open: 'Volunteer signup open',
      closed: 'Volunteer signup closed',
      'deadline-passed': 'Volunteer signup deadline passed',
      cancelled: 'Cancelled',
      completed: 'Event completed',
      draft: 'Draft',
      'no-roles': 'Volunteer signup not open',
    },
    closedExplanation: {
      closed: 'Volunteer signup for this event is closed.',
      'deadline-passed': 'The deadline to ask to volunteer for this event has passed.',
      cancelled: 'This event was cancelled, so it is not accepting volunteer requests.',
      completed: 'This event has already taken place.',
      draft: '',
      'no-roles': 'Volunteer signup for this event has not opened yet.',
      open: '',
    },
    signupDeadline: (when: string) => `Ask to volunteer by ${when}.`,
  },

  volunteer: {
    eyebrow: 'Volunteer',
    title: 'Lend a hand at a community event',
    intro:
      'Volunteers make these events welcoming. Whatever your background, there is a way to help, and most roles need no healthcare experience at all.',
    waysTitle: 'Ways to help',
    ways: [
      'Welcoming visitors',
      'Event setup',
      'Education support',
      'Activity assistance',
      'Language support',
      'Professional health education',
    ],
    illustrationAlt: 'Illustration of two volunteers greeting a neighbor at a welcome table under a canopy.',
    howTitle: 'How it works',
    steps: [
      'Tell us which event, role, and shift you would prefer. It takes about two minutes.',
      'An organizer reviews your request.',
      'The organizer contacts you to confirm your role and schedule.',
    ],
    requestNotice:
      'Sending this form is a request, not a confirmed assignment. A role or shift is only yours once an organizer confirms it with you.',
    generalVolunteerNote:
      'General volunteers support events and hand out approved educational materials. They are never asked to give medical advice.',
  },

  form: {
    title: 'Volunteer request form',
    requiredNote: 'Fields are required unless marked optional.',
    optional: 'optional',
    eventLabel: 'Which event would you like to help with?',
    eventPlaceholder: 'Choose an option',
    futureOption: 'Future volunteer opportunities (no specific event)',
    eventHint: 'Only events that are currently accepting volunteer requests are listed.',
    noOpenEvents:
      'No events are accepting volunteer requests right now. You can still ask to hear about future volunteer opportunities.',
    summaryTitle: 'Your selection',
    summaryFuture:
      'You are asking to hear about future volunteer opportunities. An organizer may contact you when an event needs help.',
    roleLegend: 'Preferred role',
    roleNeedsEvent: 'Choose an event above to see its roles.',
    shiftLegend: 'Preferred shift',
    anyShift: 'Any shift',
    anyShiftHint: 'I am flexible. Place me where I am needed.',
    healthcareTitle: 'About your professional background',
    healthcareNotice:
      'Choosing this role does not verify credentials or guarantee a clinical assignment. Organizers confirm credentials, responsibilities, and supervision with you separately before any professional duties. Please do not send license numbers or documents through this form.',
    professionalCategoryLabel: 'Professional category',
    professionalCategoryPlaceholder: 'Choose a category',
    professionalCategories: [
      'Registered nurse',
      'Licensed vocational nurse',
      'Nurse practitioner',
      'Physician',
      'Physician assistant',
      'Pharmacist',
      'Registered dietitian',
      'Diabetes care and education specialist',
      'Community health worker or promotor(a)',
      'Health professions student',
      'Other',
    ],
    professionalExperienceLabel: 'Relevant professional experience',
    professionalExperienceHint: 'For example: “Ten years in community health education.”',
    aboutYouTitle: 'About you',
    nameLabel: 'Full name',
    emailLabel: 'Email address',
    emailHint: 'An organizer will reply to this address.',
    phoneLabel: 'Phone number',
    phoneHint:
      'Only used to reach you about this request. Sharing a number does not sign you up for marketing calls or text messages.',
    cityLabel: 'City',
    languagesLabel: 'Languages spoken',
    languagesHint: 'For example: English, Spanish.',
    skillsLabel: 'Relevant skills or experience',
    noteLabel: 'Anything else we should know?',
    noteHint: 'Please do not include personal medical information.',
    noteCount: (used: number, max: number) => `${used} of ${max} characters used`,
    consentLabel: `I agree that ${name} organizers may contact me about this volunteer request.`,
    consentPrivacyLead: 'Read how we handle your information in the',
    consentPrivacyLink: 'privacy notice',
    honeypotLabel: 'Leave this field empty',
    submit: 'Send volunteer request',
    submitting: 'Sending your request…',
    errorSummaryTitle: (count: number) =>
      count === 1 ? 'Please fix 1 problem before sending.' : `Please fix ${count} problems before sending.`,
    unavailableTitle: 'Volunteer signup is not available yet',
    unavailableText:
      'We are still setting up our signup form, so volunteer requests cannot be sent from this page right now. Nothing you type here would be collected.',
    unavailableContact: 'To ask about volunteering in the meantime, contact the organizer:',
    unavailableNoContact: 'Please check back soon.',
    successTitle: 'Thank you. We received your volunteer request.',
    successText: 'An organizer will contact you to confirm your role and schedule.',
    successSummaryTitle: 'What you asked for',
    successChange: 'Need to change or cancel your request?',
    successAnother: 'Send another request',
    summaryLabels: { event: 'Event', when: 'When', where: 'Where', role: 'Preferred role', shift: 'Preferred shift' },
    failure: {
      validation: {
        title: 'The signup service could not accept some answers',
        text: 'Please check the highlighted fields and send the form again. Your answers are still here.',
      },
      'rate-limited': {
        title: 'The signup service is not accepting more requests right now',
        text: 'Your request was not sent. This can happen when many requests arrive at once or the form has reached its submission limit. Your answers are still here, so you can try again later.',
      },
      unavailable: {
        title: 'Volunteer signup is temporarily unavailable',
        text: 'Your request was not sent because the signup service is not available right now. Your answers are still here, so you can try again later.',
      },
      rejected: {
        title: 'The signup service did not accept this request',
        text: 'Your request was not sent. The service may have declined it as part of its spam protection. Your answers are still here, so you can try again.',
      },
      network: {
        title: 'We could not confirm that your request was sent',
        text: 'We did not hear back from the signup service. Please check your internet connection. We have not retried automatically, so it is safe to press send again. If you are unsure whether an earlier attempt went through, mention that in your note.',
      },
      unconfirmed: {
        title: 'We could not confirm that your request was received',
        text: 'The signup service replied in a way we did not expect, so we cannot promise your request arrived. Your answers are still here. You can try again, and mention in your note that this may be a second attempt.',
      },
    },
    failureContact: 'You can also reach the organizer directly:',
  },

  changeRequest: {
    withContact: 'To change your availability or cancel a request, contact the organizer and mention the event name:',
    withoutContact:
      'To change your availability or cancel a request, reply to the organizer who contacts you about it. A public contact address will be listed here once it is confirmed.',
  },

  resources: {
    eyebrow: 'Resources',
    title: 'Understanding prediabetes',
    intro:
      'A short, plain language introduction based on public information from the U.S. Centers for Disease Control and Prevention (CDC).',
    points: [
      {
        title: 'What it is',
        text: 'Prediabetes means blood sugar levels are higher than normal, but not high enough for a type 2 diabetes diagnosis.',
      },
      {
        title: 'Why it is easy to miss',
        text: 'Prediabetes often has no clear symptoms, so many people who have it do not know. A simple blood sugar test ordered by a healthcare professional is how people find out.',
      },
      {
        title: 'Why it matters',
        text: 'Prediabetes raises the risk of developing type 2 diabetes, heart disease, and stroke.',
      },
      {
        title: 'The encouraging part',
        text: 'For many people, healthy changes such as eating well and being more active can help prevent or delay type 2 diabetes. Small steps count.',
      },
    ],
    riskTestNote:
      'A risk questionnaire is not a diagnosis. Only a healthcare professional can test for and diagnose prediabetes, so please bring medical questions and testing to a qualified healthcare professional.',
    linksTitle: 'Trusted places to learn more',
    links: [
      {
        label: 'CDC: Prediabetes – Your Chance to Prevent Type 2 Diabetes',
        url: 'https://www.cdc.gov/diabetes/prevention-type-2/prediabetes-prevent-type-2.html',
        source: 'cdc.gov',
        description: 'The official CDC overview of prediabetes, risk factors, and next steps.',
      },
      {
        label: 'CDC Prediabetes Risk Test',
        url: 'https://www.cdc.gov/prediabetes/risktest/index.html',
        source: 'cdc.gov',
        description:
          'A short questionnaire about your risk, on the CDC website. Your answers go to that website, not to us. It is not a diagnosis.',
      },
      {
        label: 'CDC National Diabetes Prevention Program',
        url: 'https://www.cdc.gov/diabetes-prevention/index.html',
        source: 'cdc.gov',
        description: 'Information about lifestyle change programs recognized by the CDC.',
      },
    ],
    affiliationNote: `${name} is an independent community initiative. Links to CDC resources are provided for education and do not mean the CDC endorses or is affiliated with us.`,
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions and answers',
    items: {
      experience: {
        question: 'Do I need healthcare experience to volunteer?',
        answer: [
          'No. Most roles, such as welcoming visitors, setting up, or helping with activities, need no healthcare background. We will explain what to do on the day.',
          'If you are a nurse or another healthcare professional, there is a separate role for you. Organizers confirm credentials and responsibilities with you directly before any professional duties.',
        ],
      },
      whatVolunteersDo: {
        question: 'What do volunteers do?',
        answer: [
          'Volunteers greet neighbors, help set up and clean up, support walks and family activities, hand out approved educational materials, and help in other languages when they can.',
          'General volunteers are never asked to give medical advice, test anyone, or answer personal medical questions.',
        ],
      },
      confirmation: {
        question: 'How are volunteer assignments confirmed?',
        answer: [
          'When you send the form, you are making a request. An organizer reviews each request against the current event plan and contacts you to confirm your role and schedule.',
          'The website does not reserve a spot automatically, so please wait to hear from an organizer before planning around a shift.',
        ],
      },
      changes: {
        question: 'How do I change my availability or cancel?',
      },
      contact: {
        question: 'How do I contact the organizer?',
        withContact: 'You can reach the organizer here:',
        withoutContact:
          'We are still confirming a public contact address and will list it here. If you send a volunteer request, an organizer will contact you using the details you provide.',
      },
      eventDetails: {
        question: 'Is there a cost to attend? Who can come, and are events accessible?',
        fallback:
          'Details such as cost, age guidelines, and accessibility arrangements are confirmed for each event and shown in that event’s listing. If something you need to know is not listed, please ask the organizer before attending.',
        labels: { admission: 'Cost', ageEligibility: 'Who can attend', accessibility: 'Accessibility' },
      },
      medical: {
        question: 'Do events offer medical advice or testing?',
        answer: [
          'Our events focus on general education and community activities. They do not offer medical advice, diagnosis, or treatment, and you should not expect testing or screening unless an event listing clearly says it is offered.',
          'For questions about your own health, please talk with a qualified healthcare professional.',
        ],
      },
    },
  },

  footer: {
    serviceAreaLabel: 'Service area',
    contactLabel: 'Contact',
    privacyLink: 'Privacy notice',
    backToTop: 'Back to top',
    rights: 'All rights reserved.',
  },

  privacy: {
    pageTitle: 'Privacy notice',
    backHome: 'Back to the main page',
    lastUpdated: (date: string) => `Last updated: ${date}`,
    summaryTitle: 'In short',
    summary: [
      'We only collect what you type into the volunteer request form.',
      'We use it to review your request and contact you about volunteering. Nothing else.',
      'We do not use advertising, marketing trackers, or analytics on this website.',
      'Please do not send health information. We do not need it and do not want you to share it here.',
    ],
    sections: {
      who: {
        title: 'Who we are',
        body: [
          `${name} is a community education and volunteering initiative serving ${serviceArea.summary}. This notice explains what happens to information you send through the volunteer request form on this website.`,
        ],
      },
      collect: {
        title: 'What the form collects',
        intro: 'When you send a volunteer request, the form collects:',
        items: [
          'Your full name and email address (required).',
          'The event, role, and shift you would prefer, or that you asked about future volunteer opportunities.',
          'Your confirmation that organizers may contact you about the request, and the version of the consent wording you saw.',
          'If you choose to provide them: phone number, city, languages spoken, relevant skills or experience, and a short note.',
          'If you choose the healthcare professional role and decide to share them: your professional category and relevant experience.',
        ],
      },
      notCollect: {
        title: 'What we ask you not to send',
        body: [
          'Please do not include diagnoses, blood sugar or other test results, medical history, insurance details, license numbers, or identity documents. The form is not designed for health or identity records, and this website is not a medical records system.',
        ],
      },
      why: {
        title: 'Why organizers need it',
        body: [
          'Organizers use your information to review your request, plan volunteer roles and shifts for events, and contact you to confirm, change, or cancel an assignment.',
          'Giving a phone number does not sign you up for marketing calls or text messages. We do not send newsletters or advertising, and we do not sell or rent your information.',
        ],
      },
      processor: {
        title: 'Which service processes it',
        body: [
          'The form is delivered by Formspree, a form handling service. When you press send, your browser sends your answers directly to Formspree, which stores the submission and emails it to the organizers. Formspree handles this information under its own terms and privacy policy.',
          'To reduce spam, the form includes a hidden field that automated tools tend to fill in, and Formspree applies its own spam filtering to submissions. We have not added any separate third party challenge or tracking script to this website.',
        ],
        linkLabel: 'Formspree privacy policy',
        linkUrl: 'https://formspree.io/legal/privacy-policy/',
      },
      access: {
        title: 'Who can see your request',
        body: [
          'Volunteer requests are visible to the organizers who manage this initiative’s Formspree account and the email inbox where notifications are delivered. They are not published on this website or in its public source code.',
        ],
      },
      retention: {
        title: 'How long it is kept',
        unset:
          'The organizers have not set a fixed retention period yet. This notice will be updated when they do. You can ask for your information to be deleted at any time.',
      },
      deletion: {
        title: 'How to ask for changes or deletion',
        withContact:
          'To see, correct, or delete the information you sent, contact the organizer. Requests are handled by a person, so please allow a little time for a reply.',
        withoutContact:
          'To see, correct, or delete the information you sent, reply to the organizer who contacted you about your request. A public contact address for privacy requests will be listed here once it is confirmed.',
      },
      website: {
        title: 'The website itself',
        body: [
          'This website does not use advertising, marketing trackers, or analytics, and it does not save your form answers in your browser.',
          'The site is hosted on GitHub Pages. Like most web hosts, GitHub may record technical details such as visitors’ IP addresses for security purposes. Links to maps and to outside resources open those websites, which have their own privacy practices.',
        ],
      },
      changes: {
        title: 'Changes to this notice',
        body: ['If how we handle volunteer information changes, we will update this page before the change takes effect.'],
      },
    },
  },

} as const;

export type FailureKind = keyof typeof copy.form.failure;
