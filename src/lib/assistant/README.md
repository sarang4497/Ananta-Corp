# Training the chat assistant (no code, no model training)

The assistant is "trained" purely by editing plain Markdown files. There is
**no model fine-tuning** and you do **not** need a developer for content
updates. The system prompt is assembled automatically at request time.

## What goes where

| Where | What it holds | Edit it to… |
| --- | --- | --- |
| `src/content/knowledge/*.md` | **Facts only** — company info, products, FAQs, page links. | Change *what* the assistant knows / says is true. |
| `config.ts` (this folder) | **Behaviour** — persona/system prompt, models, message cap, contact links. | Change *how* the assistant talks and converts. |
| `knowledge.ts` (this folder) | The loader that concatenates the knowledge `.md` files. | Rarely — only for developers. |

The assistant answers **only** from the knowledge files. If a fact is not in
there, it says it is not sure and offers to connect the visitor with the team —
by design. See `src/content/knowledge/README.md` for the editor guide.

## Current state (groundwork)

The SMI-era knowledge was removed. `src/content/knowledge/company.md` holds the
Ananta Corporation brand basics; add product/category knowledge files
(plywood, MDF, HDHMR, prelam boards, flush doors, smart locks) as the catalog
pages are built.
