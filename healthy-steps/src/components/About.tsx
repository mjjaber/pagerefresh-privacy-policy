import { copy } from '../content/en';
import { BookIcon, ChatIcon, FamilyIcon, WalkIcon } from './Icons';

const activityIcons = [WalkIcon, BookIcon, FamilyIcon, ChatIcon];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="page-container grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow">{copy.about.eyebrow}</p>
          <h2 id="about-title" className="section-title">
            {copy.about.title}
          </h2>
          <div className="text-charcoal mt-6 space-y-4 text-lg">
            {copy.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="bg-sage/60 rounded-[2rem] p-6 sm:p-8">
          <h3 className="text-xl font-extrabold">{copy.about.activitiesTitle}</h3>
          <p className="text-muted mt-2 text-[0.9375rem]">{copy.about.activitiesNote}</p>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {copy.about.activities.map((activity, index) => {
              const ActivityIcon = activityIcons[index % activityIcons.length] ?? WalkIcon;
              return (
                <li key={activity.title} className="flex items-start gap-4">
                  <span className="text-teal flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-(--shadow-soft)">
                    <ActivityIcon width={26} height={26} />
                  </span>
                  <div>
                    <h4 className="font-bold">{activity.title}</h4>
                    <p className="text-muted mt-0.5 text-[0.9375rem]">{activity.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
