// Shared Google Sheets helpers for the backup and inventory tracker functions.

export async function ensureTabWithHeaders(accessToken, sheetId, tabName, headers, lastColumnLetter) {
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
  const authHeaders = { Authorization: `Bearer ${accessToken}` };

  const checkRes = await fetch(`${base}/values/${tabName}!A1:${lastColumnLetter}1`, { headers: authHeaders });
  if (checkRes.ok) {
    const checkData = await checkRes.json().catch(() => ({}));
    const existing = (checkData.values && checkData.values[0]) || [];
    if (existing.length >= headers.length) return true;
  } else {
    // The tab may not exist yet — create it, ignoring the error if it already does.
    await fetch(`${base}:batchUpdate`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tabName } } }] }),
    }).catch(() => {});
  }

  await fetch(`${base}/values/${tabName}!A1:${lastColumnLetter}1?valueInputOption=RAW`, {
    method: 'PUT',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [headers] }),
  });
  return true;
}

export async function findRowByValue(accessToken, sheetId, tabName, columnLetter, value) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabName}!${columnLetter}:${columnLetter}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json().catch(() => ({}));
  const rows = (data && data.values) || [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i] && rows[i][0] === value) return i + 1;
  }
  return 0;
}

// Upsert one row keyed by an exact value in column A. Creates the tab with
// headers when missing, updates the existing row when the key is found,
// appends a new row otherwise.
export async function upsertRow(accessToken, sheetId, tabName, headers, lastColumnLetter, key, row) {
  await ensureTabWithHeaders(accessToken, sheetId, tabName, headers, lastColumnLetter);
  const existingRow = await findRowByValue(accessToken, sheetId, tabName, 'A', key);
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
  const authHeaders = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
  if (existingRow > 1) {
    await fetch(`${base}/values/${tabName}!A${existingRow}:${lastColumnLetter}${existingRow}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ values: [row] }),
    });
    return existingRow;
  }
  await fetch(`${base}/values/${tabName}!A:${lastColumnLetter}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ values: [row] }),
  });
  return 0;
}