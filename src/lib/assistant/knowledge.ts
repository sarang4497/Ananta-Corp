/**
 * Loads the assistant's knowledge from the editable Markdown files in
 * src/content/knowledge/*.md and concatenates them into one block for the system
 * prompt. Add or edit a .md file there and it's picked up automatically — no code
 * change. README.md is skipped (it's instructions for editors, not knowledge).
 */
import {readdir, readFile} from 'fs/promises';
import {join} from 'path';

const KNOWLEDGE_DIR = join(process.cwd(), 'src', 'content', 'knowledge');

export async function loadKnowledge(): Promise<string> {
  let files: string[];
  try {
    files = (await readdir(KNOWLEDGE_DIR)).filter(
      (f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md'
    );
  } catch {
    return '';
  }
  files.sort();
  const parts = await Promise.all(
    files.map(async (f) => (await readFile(join(KNOWLEDGE_DIR, f), 'utf8')).trim())
  );
  return parts.filter(Boolean).join('\n\n---\n\n');
}
