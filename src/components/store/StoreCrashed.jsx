// The crash screen shown on every storefront route while STORE_CRASHED is
// true. Deliberately raw, pale and unstyled so it reads as a genuine
// platform failure rather than a designed page. Left aligned, house style.
export default function StoreCrashed() {
  const reload = () => window.location.reload();

  return (
    <div
      className="min-h-[75svh] px-6 py-16 md:px-10 max-w-3xl text-left"
      style={{ background: '#ffffff', color: '#111111' }}
      role="alert"
    >
      <p className="text-xs tracking-widest uppercase" style={{ color: '#9a9a9a', fontFamily: 'monospace' }}>
        gannonwaye.base44.app
      </p>
      <h1
        className="mt-6 text-2xl md:text-3xl font-bold"
        style={{ fontFamily: 'monospace' }}
      >
        500 — Internal Server Error
      </h1>
      <p className="mt-4 text-sm leading-relaxed" style={{ fontFamily: 'monospace', color: '#333333' }}>
        The server encountered an internal error and was unable to complete your request.
      </p>
      <pre
        className="mt-5 text-[11px] md:text-xs leading-relaxed whitespace-pre-wrap break-words"
        style={{ fontFamily: 'monospace', color: '#555555', background: '#f4f4f4', padding: '14px' }}
      >
{`Error: storefront worker failed to initialise
    at loadMerchProducts (store/index.js:1:1)
    at mountStorefront (chunk-8f2a91c.js:2:19)
    at process.Boot.<anonymous> (runtime/store:0:1)

Status: ERR_STORE_UNAVAILABLE
Request id: 8f2a91c-000443-9271`}
      </pre>
      <p className="mt-5 text-sm leading-relaxed" style={{ fontFamily: 'monospace', color: '#333333' }}>
        Our team has been notified and the store will be back online shortly. Any order you already placed is safe and unaffected.
      </p>
      <button
        type="button"
        onClick={reload}
        className="mt-6 px-4 py-2 text-xs uppercase tracking-wider border"
        style={{ fontFamily: 'monospace', color: '#111111', borderColor: '#111111', background: '#ffffff' }}
      >
        Try again
      </button>
    </div>
  );
}