// The combined fan email audience: the mailing list (EmailSubscriber) plus
// store customers who ticked the marketing opt-in at checkout, deduplicated
// by email. Everyone who asked for updates is included; nobody else is.

export async function collectFanEmailAudience(sr) {
  const [subscribers, customers] = await Promise.all([
    sr.entities.EmailSubscriber.list('', 500),
    sr.entities.StoreCustomer.filter({ marketing_opt_in: true }, '', 500),
  ]);

  const seen = new Set();
  const recipients = [];
  const addRecipient = (record, allowed) => {
    if (allowed !== true) return;
    const email = String(record?.email || '').trim().toLowerCase();
    if (!email || seen.has(email)) return;
    seen.add(email);
    recipients.push(email);
  };
  for (const record of subscribers || []) {
    addRecipient(record, record.unsubscribed !== true && record.consent_updates !== false);
  }
  for (const record of customers || []) {
    addRecipient(record, record.marketing_opt_in === true);
  }
  return recipients;
}