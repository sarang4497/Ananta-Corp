/**
 * Deterministic tests for the chat assistant's core logic — the parts that
 * drive bot/email gating and conversion gating, without external services.
 * Run with: node tests/chat-logic.test.ts
 */
process.env.SESSION_SECRET = 'test-secret-please-ignore-0123456789';

import assert from 'node:assert/strict';
import {
  FREE_VALUE_TURNS,
  HARD_CAP,
  phaseForTurn
} from '../src/lib/assistant/config';
import {checkCode, getTurns, incrementTurns, putCode} from '../src/lib/chat/store';
import {signToken, verifyToken, type SessionPayload} from '../src/lib/chat/session';
import {retrieve} from '../src/lib/assistant/retrieval';
import {buildDynamicSystem, buildStaticSystem} from '../src/lib/assistant/prompt';

let passed = 0;
function it(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve(fn()).then(
    () => {
      passed++;
      console.log(`  ✓ ${name}`);
    },
    (err) => {
      console.error(`  ✗ ${name}\n    ${err.message}`);
      process.exitCode = 1;
    }
  );
}

void (async () => {
  console.log('config / phase gating');
  await it('thresholds: HARD_CAP = FREE_VALUE_TURNS + 2 = 5', () => {
    assert.equal(FREE_VALUE_TURNS, 3);
    assert.equal(HARD_CAP, 5);
  });
  await it('phaseForTurn maps value/soft-push/gate', () => {
    assert.deepEqual([1, 2, 3].map(phaseForTurn), ['VALUE', 'VALUE', 'VALUE']);
    assert.deepEqual([4, 5].map(phaseForTurn), ['SOFT_PUSH', 'SOFT_PUSH']);
    assert.equal(phaseForTurn(6), 'GATE'); // beyond cap -> stop answering
  });

  console.log('verification code store');
  await it('correct code verifies once, then is consumed', () => {
    putCode('a@b.com', '123456');
    assert.deepEqual(checkCode('a@b.com', '123456'), {ok: true});
    assert.deepEqual(checkCode('a@b.com', '123456'), {ok: false, reason: 'not-found'});
  });
  await it('wrong code reports mismatch and locks out after 5 attempts', () => {
    putCode('c@d.com', '000000');
    for (let i = 0; i < 4; i++) {
      assert.deepEqual(checkCode('c@d.com', '999999'), {ok: false, reason: 'mismatch'});
    }
    // 5th wrong attempt hits the max and clears the record.
    assert.deepEqual(checkCode('c@d.com', '999999'), {ok: false, reason: 'mismatch'});
    assert.deepEqual(checkCode('c@d.com', '000000'), {ok: false, reason: 'not-found'});
  });
  await it('email is normalised (case-insensitive)', () => {
    putCode('Mix@Case.COM', '424242');
    assert.deepEqual(checkCode('mix@case.com', '424242'), {ok: true});
  });

  console.log('per-visitor turn counter');
  await it('turns start at 0 and increment', () => {
    const vid = 'vid-1';
    assert.equal(getTurns(vid), 0);
    assert.equal(incrementTurns(vid), 1);
    assert.equal(incrementTurns(vid), 2);
    assert.equal(getTurns(vid), 2);
  });

  console.log('signed session cookies');
  await it('round-trips a payload', () => {
    const payload: SessionPayload = {vid: 'v1', email: 'x@y.com'};
    const token = signToken(payload);
    assert.deepEqual(verifyToken<SessionPayload>(token), payload);
  });
  await it('rejects a tampered token', () => {
    const token = signToken({vid: 'v1', email: 'x@y.com'});
    const tampered = token.slice(0, -2) + (token.endsWith('aa') ? 'bb' : 'aa');
    assert.equal(verifyToken(tampered), null);
  });
  await it('rejects a forged payload (re-encoded body, old sig)', () => {
    const token = signToken({vid: 'v1', email: 'attacker@evil.com'});
    const forgedBody = Buffer.from(JSON.stringify({vid: 'v1', email: 'admin@site.com'})).toString(
      'base64url'
    );
    const forged = `${forgedBody}.${token.split('.')[1]}`;
    assert.equal(verifyToken(forged), null);
  });

  console.log('knowledge retrieval');
  await it('pricing query surfaces the pricing entry', async () => {
    const ids = (await retrieve('how much does it cost')).map((i) => i.id);
    assert.ok(ids.includes('pricing-notes'), `got ${ids.join(',')}`);
  });
  await it('dental query surfaces dental/intake knowledge', async () => {
    const ids = (await retrieve('I run a dental clinic')).map((i) => i.id);
    assert.ok(
      ids.some((id) => id.includes('dental') || id.includes('intake') || id === 'faq-industries'),
      `got ${ids.join(',')}`
    );
  });

  console.log('prompt assembly');
  await it('static system embeds the knowledge base + guardrails', async () => {
    const items = await retrieve('services');
    const sys = buildStaticSystem(items);
    assert.ok(sys.includes('Knowledge base'));
    assert.ok(sys.includes('never break') || sys.includes('Hard rules'));
  });
  await it('dynamic system injects the turn + phase guidance', () => {
    const soft = buildDynamicSystem(4, 'SOFT_PUSH');
    assert.ok(soft.includes('turn 4'));
    assert.ok(soft.toLowerCase().includes('go deeper'));
    const gate = buildDynamicSystem(6, 'GATE');
    assert.ok(gate.toLowerCase().includes('lead form') || gate.toLowerCase().includes('team'));
  });

  console.log(`\n${passed} checks passed${process.exitCode ? ' (with failures)' : ''}`);
})();
