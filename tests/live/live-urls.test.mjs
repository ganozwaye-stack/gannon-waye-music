import test from 'node:test';
import assert from 'node:assert/strict';
import { safePublicUrl, safeEmbedUrl } from '../../src/lib/liveUrls.js';

test('public buttons reject off-platform and credential-bearing destinations', () => {
  assert.equal(safePublicUrl('https://www.tiktok.com/@gann0nwaye/live', ['tiktok.com']), 'https://www.tiktok.com/@gann0nwaye/live');
  for (const value of ['http://www.tiktok.com/@gann0nwaye', 'https://tiktok.com.evil.test/', 'https://evil.test/', 'https://secret@www.tiktok.com/', 'javascript:alert(1)']) {
    assert.equal(safePublicUrl(value, ['tiktok.com']), '', value);
  }
});

test('iframe sources accept public player and chat forms', () => {
  for (const value of [
    'https://www.youtube.com/embed/abc123',
    'https://www.youtube-nocookie.com/embed/abc123',
    'https://www.youtube.com/live_chat?v=abc123&embed_domain=gannonwaye.com',
    'https://player.vimeo.com/video/123456',
    'https://streamyard.com/watch/abc123',
    'https://player.restream.io/?token=public-player-id',
    'https://chat.restream.io/embed?token=public-chat-id',
    'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fgann0nwaye%2Fvideos%2F123456%2F',
  ]) assert.equal(safeEmbedUrl(value), new URL(value).toString(), value);
});

test('iframe sources reject dashboards, non-player pages and unsafe nested Facebook URLs', () => {
  for (const value of [
    'https://www.facebook.com/live/producer',
    'https://www.facebook.com/plugins/video.php',
    'https://www.facebook.com/plugins/video.php?href=https://evil.test/video',
    'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/live/producer',
    'https://secret@www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=123',
    'https://www.youtube.com/watch?v=abc123',
    'https://streamyard.com/dashboard',
    'https://app.restream.io/channel',
    'https://www.youtube.com.evil.test/embed/abc123',
    'rtmp://stream.example.test/key',
  ]) assert.equal(safeEmbedUrl(value), '', value);
});
