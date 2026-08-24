import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Folder, File, Image, Music, Video, FileText, Search, RefreshCw, ExternalLink, ChevronRight, Home } from 'lucide-react';

const ACCENT = '#D4AF37';

function getFileIcon(mimeType) {
  if (!mimeType) return <File size={16} />;
  if (mimeType.includes('folder')) return <Folder size={16} color={ACCENT} />;
  if (mimeType.includes('image')) return <Image size={16} color="#60a5fa" />;
  if (mimeType.includes('audio')) return <Music size={16} color="#a78bfa" />;
  if (mimeType.includes('video')) return <Video size={16} color="#f87171" />;
  if (mimeType.includes('document') || mimeType.includes('pdf') || mimeType.includes('text')) return <FileText size={16} color="#86efac" />;
  return <File size={16} color="#9ca3af" />;
}

function formatSize(bytes) {
  if (!bytes) return '—';
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function GoogleDriveCommand() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [folderStack, setFolderStack] = useState([{ id: 'root', name: 'My Drive' }]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);

  const currentFolder = folderStack[folderStack.length - 1];

  const fetchFiles = useCallback(async (opts = {}) => {
    setLoading(true);
    setError(null);
    const payload = {};
    if (opts.query) payload.query = opts.query;
    else payload.folderId = opts.folderId || currentFolder.id;
    if (opts.pageToken) payload.pageToken = opts.pageToken;

    try {
      const res = await base44.functions.invoke('listDriveFiles', payload);
      const data = res?.data || {};
      if (data.error) throw new Error(data.error);
      setFiles(opts.append ? prev => [...prev, ...(data.files || [])] : (data.files || []));
      setNextPageToken(data.nextPageToken || null);
    } catch (requestError) {
      const detail = requestError?.response?.data?.error || requestError?.message || 'Google Drive request failed';
      setError(detail);
      setFiles([]);
      setNextPageToken(null);
    } finally {
      setLoading(false);
    }
  }, [currentFolder.id]);

  useEffect(() => {
    if (!search) fetchFiles({ folderId: currentFolder.id });
    else fetchFiles({ query: search });
  }, [currentFolder.id, search]);

  useEffect(() => {
    base44.entities.DriveSync.list().then(records => {
      if (records.length > 0) setSyncStatus(records[0]);
    }).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setFolderStack([{ id: 'root', name: 'My Drive' }]);
  };

  const handleOpenFolder = (file) => {
    if (!file.mimeType?.includes('folder')) return;
    setFolderStack(prev => [...prev, { id: file.id, name: file.name }]);
    setSearch('');
    setSearchInput('');
  };

  const handleBreadcrumb = (index) => {
    setFolderStack(prev => prev.slice(0, index + 1));
    setSearch('');
    setSearchInput('');
  };

  const cell = { padding: '10px 14px', borderBottom: '1px solid rgba(212,175,55,0.07)', color: '#ccc', fontSize: '13px', whiteSpace: 'nowrap' };

  return (
    <div style={{ padding: '28px 24px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#f0e8d8', letterSpacing: '0.03em' }}>Google Drive</h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '13px' }}>Browse and manage your connected Drive</p>
        </div>
        {syncStatus && (
          <div style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)', fontSize: '12px', color: '#999' }}>
            Last synced: {formatDate(syncStatus.last_synced)} · {syncStatus.changes_detected || 0} changes
          </div>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search Drive files…"
            style={{ width: '100%', padding: '10px 12px 10px 34px', background: '#111', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 18px', background: `rgba(212,175,55,0.12)`, border: `1px solid rgba(212,175,55,0.3)`, borderRadius: '8px', color: ACCENT, cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Search</button>
        <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setFolderStack([{ id: 'root', name: 'My Drive' }]); }} style={{ padding: '10px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#777', cursor: 'pointer', fontSize: '13px' }}>
          <RefreshCw size={14} />
        </button>
      </form>

      {/* Breadcrumb */}
      {!search && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {folderStack.map((folder, i) => (
            <span key={folder.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {i > 0 && <ChevronRight size={12} color="#555" />}
              <button
                onClick={() => handleBreadcrumb(i)}
                style={{ background: 'none', border: 'none', color: i === folderStack.length - 1 ? '#f0e8d8' : '#888', cursor: i === folderStack.length - 1 ? 'default' : 'pointer', fontSize: '13px', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {i === 0 && <Home size={12} />}
                {folder.name}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* File table */}
      <div style={{ background: '#0d0d0d', border: '1px solid rgba(212,175,55,0.14)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(212,175,55,0.05)' }}>
              <th style={{ ...cell, color: ACCENT, fontWeight: 700, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'left' }}>Name</th>
              <th style={{ ...cell, color: ACCENT, fontWeight: 700, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'left', width: '120px' }}>Modified</th>
              <th style={{ ...cell, color: ACCENT, fontWeight: 700, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'right', width: '80px' }}>Size</th>
              <th style={{ ...cell, width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading && files.length === 0 ? (
              <tr><td colSpan={4} style={{ ...cell, textAlign: 'center', color: '#555', padding: '40px' }}>Loading…</td></tr>
            ) : error ? (
              <tr><td colSpan={4} style={{ ...cell, textAlign: 'center', color: '#e05555', padding: '40px' }}>{error}</td></tr>
            ) : files.length === 0 ? (
              <tr><td colSpan={4} style={{ ...cell, textAlign: 'center', color: '#555', padding: '40px' }}>No files found</td></tr>
            ) : (
              files.map(file => (
                <tr key={file.id}
                  onClick={() => handleOpenFolder(file)}
                  style={{ cursor: file.mimeType?.includes('folder') ? 'pointer' : 'default', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...cell, color: '#e0e0e0', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '200px' }}>
                    {getFileIcon(file.mimeType)}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>{file.name}</span>
                  </td>
                  <td style={{ ...cell }}>{formatDate(file.modifiedTime)}</td>
                  <td style={{ ...cell, textAlign: 'right' }}>{formatSize(file.size)}</td>
                  <td style={{ ...cell, textAlign: 'center' }}>
                    {file.webViewLink && (
                      <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        style={{ color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {nextPageToken && (
          <div style={{ textAlign: 'center', padding: '16px', borderTop: '1px solid rgba(212,175,55,0.07)' }}>
            <button
              onClick={() => fetchFiles({ folderId: currentFolder.id, pageToken: nextPageToken, append: true })}
              disabled={loading}
              style={{ padding: '8px 20px', background: 'transparent', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '6px', color: ACCENT, cursor: 'pointer', fontSize: '12px' }}
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}