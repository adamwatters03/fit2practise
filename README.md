# Fit to Practise

Marketing website **and** learning/analytics portal for [Fit to Practise](https://fit2practise.com) — mentorship and courses that help UK healthcare professionals regain and maintain their Fitness to Practise.

Built as a fast, dependency-free **static site** (plain HTML/CSS/JS) so it deploys to Vercel with zero configuration and no build step. Recreated pixel-for-pixel from the Claude Design prototypes in `project/`, with all interactivity wired up for real.

## Pages

| File | What it is |
|------|------------|
| `index.html` | Home — hero, stats, features, popular courses, mentorship, portal showcase, testimonial, FAQ, CTAs, newsletter |
| `courses.html` | Course catalogue with category filter, live search, add-to-cart |
| `course.html` | Course detail (`?c=<id>`) — curriculum, outcomes, sticky buy card |
| `cart.html` | Cart with member discount (20% off 2+) and checkout |
| `my-courses.html` | Learner dashboard — enrolled courses, progress bars, learning stats |
| `login.html` | Login / Register (tabbed) |
| `profile.html` | Editable account details, notification toggles, progress, achievements |
| `about.html` | Founder, mission, board of advisors |
| `mentorship.html` | 1:1 mentorship — how it works, mentors, CTA |
| `faqs.html` | FAQ accordion |
| `articles.html` | Articles / blog grid |
| `article.html` | Article detail (`?id=<slug>`) — 7 posts + related |
| `contact.html` | Contact form + details |
| `privacy.html` · `terms.html` · `refunds.html` | Legal pages (template copy — have reviewed before relying on them) |
| `404.html` | Not-found page (Vercel serves it automatically for unknown routes) |
| `portal.html` | Role-based portal — **Learner** dashboard/courses/schedule/instructors/profile/activity, and **Business owner** analytics + members table |

## How it works

- **Shared UI** — `assets/js/site.js` injects the header/footer into every inner page, drives the animations (scroll-reveal, parallax, sticky-shrink header), and keeps the cart badge live. `assets/css/site.css` holds all shared styles and animation keyframes.
- **State** — `assets/js/cart.js` exposes `window.F2P`, the course catalogue plus cart / enrolment / progress state, persisted in `localStorage`. Pages listen for the `f2p-change` event to stay in sync (including across tabs). No backend required.
- **The journey is connected:** Home → Courses → Course detail → Add to cart → Cart → Checkout → My Courses, with progress, enrolment, and profile all persisted client-side. Log in via the portal to see the learner dashboard, or the business-owner analytics/members views.
- **Animations** are a progressive enhancement: content is fully visible without JS (or with reduced-motion), and animates in when JS runs.

## Images

All imagery is served locally from `assets/img/` (nothing hotlinks the old WordPress site).

> ⚠️ The images currently in `assets/img/` are lightweight, brand-coloured **placeholders** — the build environment's network policy could not reach `fit2practise.com` to download the originals. To pull in the real brand photos, run this once from a machine that can reach the live site:
>
> ```bash
> bash scripts/fetch-images.sh
> ```
>
> It downloads each photo/logo/avatar into `assets/img/` under the exact filenames the pages already reference — no code changes needed. Then commit the updated images.

## Run locally

It's static, so any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to Vercel

No configuration needed — Vercel serves the repo as a static site. Import the GitHub repo and deploy, or:

```bash
npx vercel
```

## Notes for going live

- **Payments** — checkout is a front-end flow that enrols instantly so My Courses populates. Wire it to Stripe (or your processor) before taking real payments.
- **Forms** — the contact and newsletter forms are front-end mocks (they show a confirmation). Connect them to your email/form service.
- **Placeholder content** — the homepage stats (`00+`), FAQ answers, and Articles posts are drafts; swap in your real numbers/copy.
- **Portal** — a front-end demo. Login accepts any details; the role (learner vs owner) is what changes the views. Analytics figures and the members list are realistic demo data.

## Demo logins

Password is anything (front-end only — no real auth yet). Both are defined in `assets/js/cart.js`.

| Account | Email | What you get |
|---------|-------|--------------|
| **All-access learner** | `member@fit2practise.com` | Every course unlocked/enrolled — full My Courses + learner dashboard |
| **Admin (business owner)** | `admin@fit2practise.com` | Opens the portal's owner dashboard — revenue/user analytics + members table |

Sign in from **`login.html`** (there are one-click "fill" buttons for each) or from the **portal** gate. The admin email always opens the owner dashboard, whichever role tab is selected. Wire these to real auth/entitlements when you add a backend (`ALL_ACCESS_EMAILS` / `ADMIN_EMAILS` in `cart.js`).

## Design source

The original Claude Design prototypes and conversation are kept in `project/` and `chats/` for reference. The production site was recreated from them; those files are not part of the deployed site.
