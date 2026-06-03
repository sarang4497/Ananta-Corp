# Training the chat assistant (no code, no model training)

The assistant is "trained" purely by editing the files in this folder. There is
**no model fine-tuning** and you do **not** need a developer for content updates.
The system prompt is assembled automatically from these files at request time.

## What goes where

| File | What it holds | Edit it to… |
| --- | --- | --- |
| `knowledge.ts` | **Facts only** — services, AI products, FAQs, pricing notes, page links. | Change *what* the assistant knows / says is true. |
| `method.ts` | **Behaviour** — voice, qualifying questions per industry, how to handle pricing, when to recommend a product or push to contact. | Change *how* the assistant talks and sells. |
| `config.ts` | Model + message-count thresholds. | Switch model or tune how many free answers a visitor gets. |

The assistant answers **only** from `knowledge.ts`. If a fact is not in there, it
will say it is not sure and offer to connect the visitor with the team — by design.

## How to add or change knowledge (most common task)

Open `knowledge.ts` and copy an existing entry in the `knowledge` array. Each
entry looks like this:

```ts
{
  id: 'service-landing-pages',   // unique, lowercase-with-dashes — don't reuse
  type: 'service',               // service | product | faq | pricing | page | company
  title: 'Landing Pages',        // short human title
  tags: ['landing page', 'conversion'],  // words a visitor might type
  body: 'Fast, conversion-focused landing pages…',  // the actual fact, kept true & short
  url: '/services'               // optional: page to link to
}
```

- Paste real material into `body`. Keep it accurate and concise.
- Add `tags` for words people might actually type — this is how the right entry
  gets surfaced.
- Replace every `[PLACEHOLDER]` and `TODO(content)` marker with real content.
- Don't reuse an `id`.

## How to change behaviour / sales method

Open `method.ts`:

- `persona` — the voice/tone (plain sentences).
- `guardrails` — hard rules it must never break.
- `pricing` — how to handle "how much?" questions.
- `industries` — qualifying questions and recommended items per industry
  (dental / restaurant / engineering). Add a new industry by copying a block.
- `recommendation` — when to recommend a product or nudge to contact.

## Scaling later (for developers)

Knowledge is addressed by `id` and read through the `retrieve()` interface in
`retrieval.ts`. Today a simple keyword retriever returns everything inline. When
the knowledge base outgrows the prompt, swap `retriever` for a vector/RAG
implementation of the same interface — the chat route and UI do not change.
