# Editing the chatbot's knowledge (no coding needed)

The website chatbot answers **only** from the Markdown (`.md`) files in this folder.
To change what it knows, just edit these files — **no code changes required.**

## How it works
Every `.md` file in this folder (except this `README.md`) is automatically loaded
and given to the assistant as context on each message. The chatbot will then
answer using whatever is written here.

## The files
- **company.md** — who we are, offices, contact, how to book a call.
- **services.md** — the 7 services, their sub-services, and page URLs.
- **industries.md** — the 5 industries, what we do for each, and page URLs.
- **ai-products.md** — the 23 AI products, one-line value, prices, and `/ai-products` links.
- **case-studies.md** — real proof points (Dental, Lubi, Nisarg, HSTUS, app/platform builds) + overall stats, linking to `/case-studies`.
- **faqs.md** — common questions and short answers.

## To make a change
1. Open the relevant `.md` file (e.g. `services.md`) in any text editor.
2. Edit the text like a normal document. Keep the page links (e.g. `/contact`,
   `/ai-products#product-23`) accurate — the chatbot shares those with visitors.
3. Save. After the site is rebuilt/redeployed, the chatbot uses the new content.

## To add a whole new topic
Create a new file, e.g. `pricing.md`, write your content, and save it.
It's picked up automatically — you do **not** need to register it anywhere.

## Tips
- Write plainly; short bullet points work best.
- Always include the real page URL for anything you want the bot to link to.
- Don't put secrets or anything you wouldn't want a visitor to read here — the
  chatbot may surface any of it.

> Behaviour (tone, length, the system prompt) is separate — that lives in
> `src/lib/assistant/config.ts`, not here.
