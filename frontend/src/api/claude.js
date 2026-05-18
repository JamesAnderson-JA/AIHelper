const BASE = 'http://localhost:3001';

export async function policyChat(messages) {
  const r = await fetch(`${BASE}/api/policy-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}

export async function caseChat(messages, caseData) {
  const r = await fetch(`${BASE}/api/case-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, caseData }),
  });
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}
