// Safety hold: scheduled release publication is disabled.
//
// A release date and editable status fields are not enough evidence to publish,
// deliver to a distributor, or contact fans. Future public release requires a
// separate owner-approved workflow that records rights, master, delivery,
// public approval, and channel-specific approval evidence.
export default async function () {
  return Response.json({
    ok: true,
    checked: 0,
    published: [],
    skipped: 'Automatic release publication is disabled. Use the separate owner-approved publication workflow.',
  });
}
