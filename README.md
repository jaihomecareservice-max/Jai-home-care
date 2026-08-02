# JAI Home Care Services — website

Static one-page site. No build step. Animation by [anime.js](https://animejs.com) v4.5.0,
vendored into `assets/vendor/` so the published site makes **zero external requests** except
Google Fonts.

## Run it locally

```bash
cd "E:\CLAUDE KA KAAM\AAKASH UPADHYAY\jai-home-care" && python serve.py
```

Then open <http://127.0.0.1:4173>.

> Use `serve.py`, not `python -m http.server`. The plain module lets the browser cache HTML/CSS/JS,
> so edits silently appear to do nothing. `serve.py` sends `Cache-Control: no-store` and is
> threaded, so an open tab can't block other requests.

> Must be served over `http://`, not opened as a `file://` path — `assets/app.js` is an ES module
> and browsers block module imports from `file://`.

## Enquiry logging — 10 minutes, do this before launch

Right now every enquiry only opens WhatsApp. If the visitor closes it without pressing send, or the
phone is busy, **that lead is gone with no record**.

Open `assets/config.js` and set `ENQUIRY_ENDPOINT`. The easiest is [Formspree](https://formspree.io):
sign up, create a form, paste the URL. Every booking and callback is then emailed and kept in a
searchable list, on top of the WhatsApp message.

The logging is deliberately fire-and-forget — verified that a failed log still opens WhatsApp
normally, so a broken endpoint can never cost a customer.

## Theme

Three themes, chosen from the dropdown in the header:

| Theme | What it is |
|---|---|
| **Calm** *(default)* | Clear and clinical — near-opaque surfaces, defined borders, blue-dominant, decoration turned down |
| **Warm** | The softer, more colourful glass look |
| **Dark** | For night |

**Calm is the default deliberately.** Healthcare-trust research is consistent: clean layout, high
contrast, blue dominance and restrained decoration read as *competent*, while heavy colour and blur
read as *marketing*. Roughly [75% of people judge a business's credibility on its
website](https://www.crowdspring.com/blog/healthcare-website-design/), and for medical care that
judgement is the whole decision. Calm raises heading contrast from 8.7:1 to **11.9:1** and cuts the
background wash — the same content, presented as a clinic rather than a startup.

First visit follows the operating system; after that the explicit choice is remembered in
`localStorage` under `jai-theme`. An inline script in `<head>` applies it before first paint, so
there is no flash of the wrong colours.

Colours are CSS custom properties in `assets/styles.css` — `:root` (warm), `:root[data-theme="calm"]`
and `:root[data-theme="dark"]`. Retune those blocks only; nothing else hard-codes a colour. Every
text/background pair passes WCAG AA in all three themes.

## Files

| File | What it is |
|---|---|
| `index.html` | All page content |
| `assets/styles.css` | Design system, glassmorphism, responsive rules |
| `assets/app.js` | anime.js animation, nav, booking form (ES module) |
| `assets/reviews.js` | **Review content — edit this to publish real reviews** |
| `assets/logo.svg` | JAI monogram |
| `assets/img/` | Care illustration + 4 review avatars |
| `assets/vendor/` | anime.js bundle + its MIT licence |

`node_modules/` and `package.json` are only used to pull anime.js. They are **not needed to run or
deploy** the site — you can delete them and everything still works.

## ⚠️ Before this goes live

### 1. The reviews are placeholders

`assets/reviews.js` contains four **sample** entries, and the page shows an amber warning box
saying so. I did not invent customer quotes: publishing fabricated reviews for a medical service
is dishonest to families choosing care, and is an unfair trade practice under India's Consumer
Protection Act 2019.

To publish real ones: replace the four entries, then set `SHOW_SAMPLE_NOTICE = false` at the top of
the file — that removes the warning box automatically.

Worth doing alongside: set up a free **Google Business Profile**. Reviews collected there can be
quoted here *and* make the business appear in local "home nursing near me" searches.

### 2. Confirm the 24×7 claim

You asked for 24×7 and it now appears in the top bar, the nav badge, the hero, the stats, the FAQ
and the footer. It is a service promise customers will hold the business to at 3am — make sure it
is accurate before publishing.

### 3. Other things to check

1. **Legal / trading name + licence.** The site says *JAI Home Care Services* throughout, per the
   printed material. Registration as **Jaishiv** and the operating licence are in progress — once
   the documents exist, add the registered name and licence number to the footer. Displaying a real
   licence number is one of the strongest trust signals a home-healthcare site can carry, so it is
   worth doing the day it arrives. Nothing about registration or licensing is claimed anywhere on
   the site today.
2. **Service scope lists.** Each service card lists "what's included". These are standard
   descriptions of each service — confirm they match what the team actually does, and remove any
   line that doesn't.
3. **Service areas.** The FAQ says "call to confirm we cover your locality."
4. **Staff qualifications.** The site claims no certifications. If the team holds nursing
   registrations, adding that would be the single biggest trust improvement on the page.
5. **Photographs.** The illustrations are drawn vectors. Real photos of the actual staff (with
   consent) would build far more trust than any illustration.

Note: the printed flyer reads "JAI HOME CARE SERVCE" — a missing `I` in *Services*. The site uses
the correct spelling; worth fixing before the next print run.

## Competitor research → what was added

Researched [Portea](https://www.portea.com/) (the closest match — home nursing, physio, attendants,
equipment across Indian cities), its [nursing service page](https://www.portea.com/nursing/), and a
[Delhi NCR home-care pricing guide](https://care.samarth.community/safety/delhi-home-attendants-nursing-and-physio-care/).

Patterns worth copying, and what is now on our site:

| Their pattern | What we added |
|---|---|
| "When do you need a nurse at home?" — the single biggest section on Portea's service page | **"When families usually call us"** — 6 situation cards so a visitor self-identifies before reading service lists |
| Care sold by duration: short visit / 12-hour / 24-hour | **Care plans** section with those three tiers |
| Nobody in the market publishes prices | **Pricing section** explaining the three variables, plus a "ask us all of this" checklist — a real differentiator, see below |
| Deep FAQs on the worries that actually stop people booking | FAQ grown from 6 to **11**, covering replacements, deposits, equipment cost, emergencies, and doctor boundaries |
| City pages + heavy local SEO | **JSON-LD `MedicalBusiness` structured data** so Google can surface the business in local searches and Maps |
| Low-friction "book now" everywhere | **Callback strip** — just name + number, for people not ready for the full form |

### The pricing opportunity

Portea and the rest publish **no prices at all**. Families researching care for a parent find this
genuinely frustrating. The pricing section is built so that publishing even indicative rates would
put this site ahead of much larger competitors on the thing buyers care about most.

Market rates from the Delhi NCR research, for reference when setting yours:

| Service | Typical agency rate |
|---|---|
| Attendant, 12-hour | ₹12,000–18,000 / month |
| Attendant, 24-hour live-in | ₹18,000–28,000 / month |
| Qualified nurse (GNM/ANM), 12-hour | ₹22,000–35,000 / month |
| Physiotherapy | ₹800–2,000 / visit |
| Equipment rental (bed, oxygen, wheelchair) | ₹2,000–8,000 per item / month |

South Delhi, Gurgaon and Dwarka command 15–25% above outer areas. **These are market figures, not
ours** — three `<!-- TODO owner -->` comments in `index.html` mark exactly where real rates go. Until
then each plan reads "Rates on call", which is honest rather than invented.

### Second research pass — four new sections

Sources: [Portea](https://www.portea.com/), [Care24 on insurance and home
healthcare](https://care24.co.in/blog/navigating-insurance-home-healthcare-what-you-need-to-know/),
[Niva Bupa on home healthcare
cover](https://www.nivabupa.com/health-insurance-articles/health-insurance-home-healthcare-coverage.html),
[India Home Health Care](https://www.bayada.com/international/india-hhc),
[Health4Silvers](https://health4silvers.com/), and healthcare-trust design research from
[crowdspring](https://www.crowdspring.com/blog/healthcare-website-design/) and
[Sprypt](https://www.sprypt.com/blog/visual-elements-that-build-trust-on-clinic-websites).

| Section | Why it earns its place |
|---|---|
| **Family updates** (`#updates`) | IHHC and Health4Silvers both build their offering around keeping families who live elsewhere informed — WhatsApp updates, documented assessments. For families with children in another city or abroad, this is the deciding factor, and almost nobody at this scale advertises it |
| **Insurance paperwork** (`#insurance`) | Indian policies often include a *domiciliary hospitalisation* clause that can cover home treatment, but claims fail on missing documentation. Promising good records — while explicitly **not** promising approval — is honest and genuinely valuable |
| **Care charter** (`#charter`) | Hospitals publish a patient charter; home-care providers almost never do, despite entering the patient's home. Six concrete commitments (consent, privacy, no unannounced staff, scope limits, hygiene, complaints) |
| **Work with us** (`#careers`) | The growth ceiling for a care agency is **staff, not customers** — you cannot accept a booking without an attendant. Pre-fills a WhatsApp application with the details worth asking for |

### Not added, and why

Portea lists 16 services (lab tests, doctor consultation, vaccination, mother & baby care, critical
care). I did not add services the business does not offer. They are worth considering as the firm
grows — especially **elder care** as a named category, since it is how most families search.

Their strongest trust line is "every nurse is background-checked, GNM/B.Sc qualified". That is the
single biggest gap against them, and it cannot be written until it is true. Once staff
qualifications and police verification are in place, say so prominently — it beats any design work
on this page.

## Responsive behaviour

Tested at every width below, in both themes — no horizontal scroll, no touch target under 40px:

| Width | Device | Layout |
|---|---|---|
| 320 | small Android | 1 column, compact header |
| 360 / 375 / 390 | most phones | 1 column, burger menu |
| 844×390 | phone in landscape | top bar hidden, menu scrolls |
| 768 / 820 | iPad portrait | 2 columns, burger menu |
| 912 | large tablet portrait | 2 columns, burger menu |
| 960–1160 | iPad landscape / small laptop | 3 columns, full nav (tightened) |
| 1280 / 1440 | desktop | 3 columns, full nav |

Breakpoints are at 430 (compact header), 620 (phone), 940 (burger ⇄ full nav), 1000 (hero splits),
1160 (nav spacing relaxes), plus a landscape rule for viewports under 460px tall.

**Note:** media queries evaluate against the window width *including* the scrollbar, while
`clientWidth` excludes it — roughly 15px apart. Worth remembering when checking a breakpoint.

### Responsive bugs found and fixed in this pass

1. **36px sideways scroll at 320px.** The booking form's `<select>` takes its minimum width from
   its longest option, and grid children default to `min-width:auto`, so one dropdown widened the
   whole column past the screen. Fixed with `min-width:0` on grid/flex children.
2. **`<fieldset>` would not shrink** below its min-content width — the standard `fieldset{min-width:0}`
   fix.
3. **Full-width buttons could not wrap.** `.btn` sets `white-space:nowrap`, so "Send booking on
   WhatsApp" set the width of the entire form column on a narrow phone.
4. **Header overflowed at 320px** — logo, wordmark, theme switch and burger together were too wide.
   Compacted under 430px so the wordmark is kept rather than dropped.
5. **Nav overflowed between 861–940px.** With seven links the full nav does not actually fit until
   about 900px, so the burger breakpoint moved from 860 to 940 — tablets keep the burger.
6. **Menu unreachable on a phone in landscape.** The open menu was 613px tall in a 390px viewport
   and did not scroll, so "Book care" could not be tapped. Now capped with `dvh` and scrollable.
7. **Touch targets too small** — duration presets were 35px tall and the checkbox 13px. Now ≥42px,
   with extra padding on footer and top-bar links on touch devices.

## What the animations do

| Effect | anime.js API |
|---|---|
| Logo strokes draw themselves on load | `createDrawable` + `animate` |
| Hero elements enter in sequence | `createTimeline` + `stagger` |
| The two floating cards drift | looping `alternate` animation |
| Cards/sections rise in on scroll | `onScroll` + `stagger`, grouped per container |
| Stat numbers count up | `animate` on a plain object + `onUpdate` |
| Invalid form shakes | keyframed `x` animation |

All motion is disabled under `prefers-reduced-motion: reduce`.

## Deploying

Plain static files. Drag the folder onto **Netlify Drop**, **Cloudflare Pages**, or push to
**GitHub Pages**. Exclude `node_modules/`.
