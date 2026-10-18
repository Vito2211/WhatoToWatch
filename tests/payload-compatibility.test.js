/**
 * What to Watch? - Payload Compatibility and Integrity Test Suite
 * 
 * Verifies compatibility between the Android application sharing implementation
 * (SharingService.kt, SharePayloadModels.kt) and the static website (share.js).
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const SHARE_JS_PATH = path.join(ROOT_DIR, 'js', 'share.js');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const STYLE_CSS_PATH = path.join(ROOT_DIR, 'css', 'style.css');

let passedTests = 0;
let totalTests = 0;

function it(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function itAsync(description, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

// Emulate browser environment needed by share.js ShareManager
function setupBrowserMock() {
  const listeners = {};
  global.window = {
    addEventListener: (event, cb) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
    location: {
      search: '',
      hash: ''
    },
    APP_CONFIG: {
      deepLinkScheme: 'whattowatch',
      deepLinkHost: 'share'
    },
    I18N: {
      currentLang: 'en',
      t: (key) => key
    }
  };

  // Mock DOM elements
  const mockElements = {
    'payload-title': { textContent: '' },
    'payload-type-badge': { textContent: '', className: '' },
    'payload-summary': { textContent: '' },
    'payload-items-list': { innerHTML: '', appendChild: () => {} },
    'payload-open-app-btn': { href: '' },
    'share-error': { textContent: '', style: { display: 'none' } },
    'share-preview-card': { style: { display: 'none' }, scrollIntoView: () => {} },
    'share-input-text': { value: '' }
  };

  global.document = {
    getElementById: (id) => mockElements[id] || null,
    createElement: (tag) => ({
      tagName: tag,
      className: '',
      textContent: '',
      style: {},
      appendChild: () => {},
      setAttribute: () => {}
    })
  };

  // Load share.js inside the mock environment
  const shareJsCode = fs.readFileSync(SHARE_JS_PATH, 'utf8');
  eval(shareJsCode);
  return global.window.wtwShareManager;
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log(' What to Watch? — Payload & Website Compatibility Tests');
  console.log('======================================================\n');

  const manager = setupBrowserMock();

  console.log('1. URL and Fragment Extraction Tests:');
  const samplePayload = 'H4sIAAAAAAAAE32RUWvCMBSF_0rIs9p1MoW-ieu2gG4P';

  it('Extracts payload from HTTPS hash with #share/<payload>', () => {
    const extracted = manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/#share/${samplePayload}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts payload from HTTPS hash with #/share/<payload>', () => {
    const extracted = manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/#/share/${samplePayload}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts payload from HTTPS hash with #data=<payload>', () => {
    const extracted = manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/#data=${samplePayload}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts payload from HTTPS hash with #share=<payload>', () => {
    const extracted = manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/#share=${samplePayload}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts payload from HTTPS query parameter ?data=<payload>', () => {
    const extracted = manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/?data=${samplePayload}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts payload from HTTPS query parameter ?share=<payload>', () => {
    const extracted = manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/?share=${samplePayload}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts payload from Android deep link whattowatch://share/<payload>', () => {
    const extracted = manager.extractPayload(`whattowatch://share/${samplePayload}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts payload from Android deep link with query: whattowatch://share?data=<payload>', () => {
    const extracted = manager.extractPayload(`whattowatch://share?data=${samplePayload}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts raw payload pasted directly without URLs', () => {
    const extracted = manager.extractPayload(`  ${samplePayload}  `);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Correctly strips percent-encoding (%2D, %5F, etc.)', () => {
    const encoded = encodeURIComponent(samplePayload);
    const extracted = manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/#share/${encoded}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts payload from GitHub Pages subpath pathname /WhatoToWatch/share/<payload>', () => {
    const extracted = manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/share/${samplePayload}`);
    assert.strictEqual(extracted, samplePayload);
  });

  it('Extracts payload from hash variations with hashbangs and query params', () => {
    assert.strictEqual(manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/#!/share/${samplePayload}`), samplePayload);
    assert.strictEqual(manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/#/?data=${samplePayload}`), samplePayload);
    assert.strictEqual(manager.extractPayload(`https://vito2211.github.io/WhatoToWatch/#/?share=${samplePayload}`), samplePayload);
  });

  it('Strips surrounding quotes and markdown backticks when pasted', () => {
    assert.strictEqual(manager.extractPayload(`\`${samplePayload}\``), samplePayload);
    assert.strictEqual(manager.extractPayload(`"${samplePayload}"`), samplePayload);
    assert.strictEqual(manager.extractPayload(`'${samplePayload}'`), samplePayload);
  });

  it('Sanitizes un-prefixed web URLs by adding https:// scheme', () => {
    assert.strictEqual(manager.sanitizeUrl('www.imdb.com/title/tt1375666/'), 'https://www.imdb.com/title/tt1375666/');
    assert.strictEqual(manager.sanitizeUrl('themoviedb.org/movie/123'), 'https://themoviedb.org/movie/123');
    assert.strictEqual(manager.sanitizeUrl('https://example.com'), 'https://example.com/');
    assert.strictEqual(manager.sanitizeUrl('javascript:alert(1)'), null);
  });

  console.log('\n2. Payload Decompression & Kotlin Schema Compatibility:');

  await itAsync('Decodes Android Single Item payload (English with notes & URL)', async () => {
    const payload = {
      version: 1,
      type: 'SINGLE_ITEM',
      title: 'Inception',
      contents: [{
        id: 'inc-1',
        title: 'Inception',
        contentType: 'MOVIE',
        watchStatus: 'WATCHED',
        externalUrl: 'https://www.imdb.com/title/tt1375666/',
        description: 'Mind-bending dream architecture.',
        createdAt: 1700000000000,
        updatedAt: 1700000000000
      }],
      categories: [{ id: 'cat-scifi', name: 'Sci-Fi', createdAt: 1700000000000 }],
      customLists: [],
      contentCategories: [{ contentId: 'inc-1', categoryId: 'cat-scifi' }],
      listItems: [],
      sharedAt: 1700000000000
    };

    const gzipped = zlib.gzipSync(Buffer.from(JSON.stringify(payload), 'utf8'));
    const base64Url = gzipped.toString('base64url'); // Unpadded URL-safe Base64 as generated by Android

    const decoded = await manager.decodeAndDecompress(base64Url);
    assert.strictEqual(decoded.version, 1);
    assert.strictEqual(decoded.type, 'SINGLE_ITEM');
    assert.strictEqual(decoded.title, 'Inception');
    assert.strictEqual(decoded.contents[0].watchStatus, 'WATCHED');
    assert.strictEqual(decoded.contents[0].contentType, 'MOVIE');
    assert.strictEqual(decoded.categories[0].name, 'Sci-Fi');
  });

  await itAsync('Decodes Russian Cyrillic & Unicode payload without mojibake', async () => {
    const payload = {
      version: 1,
      type: 'CUSTOM_LIST',
      title: 'Шедевры мирового кино 🎬 ★',
      contents: [
        {
          id: 'ru-1',
          title: 'Интерстеллар',
          contentType: 'MOVIE',
          watchStatus: 'WATCHED',
          description: 'Потрясающий фильм Кристофера Нолана о времени, любви и гравитации.',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: 'ru-2',
          title: 'Разделение',
          contentType: 'SERIES',
          watchStatus: 'WATCHING',
          description: 'Сериал о балансе между работой и личной жизнью.',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ],
      categories: [
        { id: 'c1', name: 'Фантастика', createdAt: Date.now() },
        { id: 'c2', name: 'Драма', createdAt: Date.now() }
      ],
      customLists: [{ id: 'l1', name: 'Шедевры мирового кино 🎬 ★', createdAt: Date.now(), updatedAt: Date.now() }],
      contentCategories: [
        { contentId: 'ru-1', categoryId: 'c1' },
        { contentId: 'ru-2', categoryId: 'c2' }
      ],
      listItems: [],
      sharedAt: Date.now()
    };

    const gzipped = zlib.gzipSync(Buffer.from(JSON.stringify(payload), 'utf8'));
    const base64Url = gzipped.toString('base64url');

    const decoded = await manager.decodeAndDecompress(base64Url);
    assert.strictEqual(decoded.title, 'Шедевры мирового кино 🎬 ★');
    assert.strictEqual(decoded.contents.length, 2);
    assert.strictEqual(decoded.contents[0].title, 'Интерстеллар');
    assert.strictEqual(decoded.contents[0].description, 'Потрясающий фильм Кристофера Нолана о времени, любви и гравитации.');
    assert.strictEqual(decoded.categories[0].name, 'Фантастика');
  });

  await itAsync('Handles padded standard Base64 gracefully', async () => {
    const payload = { version: 1, type: 'SINGLE_ITEM', title: 'Test' };
    const gzipped = zlib.gzipSync(Buffer.from(JSON.stringify(payload), 'utf8'));
    const paddedBase64 = gzipped.toString('base64'); // contains + / and ==

    const decoded = await manager.decodeAndDecompress(paddedBase64);
    assert.strictEqual(decoded.title, 'Test');
  });

  console.log('\n3. Malformed Input Rejection & Error Handling:');

  await itAsync('Rejects random non-base64 characters', async () => {
    await assert.rejects(async () => {
      await manager.decodeAndDecompress('invalid@@characters!!');
    });
  });

  await itAsync('Rejects valid base64 that is not gzipped', async () => {
    const rawText = Buffer.from('Just plain uncompressed text').toString('base64');
    await assert.rejects(async () => {
      await manager.decodeAndDecompress(rawText);
    });
  });

  await itAsync('Rejects gzipped data that is not JSON', async () => {
    const rawGzip = zlib.gzipSync('plain text inside gzip').toString('base64url');
    await assert.rejects(async () => {
      await manager.decodeAndDecompress(rawGzip);
    });
  });

  await itAsync('Rejects future unsupported payload versions (> 1)', async () => {
    const v99 = zlib.gzipSync(JSON.stringify({ version: 99, type: 'SINGLE_ITEM', title: 'Future' })).toString('base64url');
    await assert.rejects(async () => {
      await manager.decodeAndDecompress(v99);
    }, /Unsupported sharing version/);
  });

  console.log('\n4. "Open in App" Deep Link Construction:');

  it('Constructs whattowatch:// URI matching AndroidManifest and SharingService parser', async () => {
    const payload = { version: 1, type: 'SINGLE_ITEM', title: 'Dune' };
    const gzipped = zlib.gzipSync(Buffer.from(JSON.stringify(payload), 'utf8'));
    const base64Url = gzipped.toString('base64url');

    await manager.processEncodedString(base64Url, false);
    const directBtn = document.getElementById('payload-open-app-btn');

    assert.strictEqual(directBtn.href, `whattowatch://share/${base64Url}`);
    // Check compatibility with Android URI parsing
    assert.ok(directBtn.href.startsWith('whattowatch://share/'));
    const parsedPath = directBtn.href.replace('whattowatch://share/', '');
    assert.strictEqual(parsedPath, base64Url);
  });

  console.log('\n5. Privacy and Network Isolation Audit:');

  it('Verifies zero external network requests in index.html, style.css, and js files', () => {
    const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
    const css = fs.readFileSync(STYLE_CSS_PATH, 'utf8');
    const shareJs = fs.readFileSync(SHARE_JS_PATH, 'utf8');

    // Ensure no CDN or external script links
    assert.ok(!html.includes('http://'), 'index.html contains external unencrypted http links');
    // Ensure all script and link tags are local relative paths
    const externalLinks = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)].map(m => m[1]);
    for (const link of externalLinks) {
      assert.ok(
        link.startsWith('https://github.com/Vito2211/WhatoToWatch') || link.startsWith('https://vito2211.github.io/'),
        `Unexpected external URL found in HTML: ${link}`
      );
    }

    // Ensure style.css contains no external url(...) imports
    assert.ok(!css.includes('@import url('), 'style.css contains external imports');
    assert.ok(!css.includes('fonts.googleapis.com'), 'style.css calls Google Fonts');

    // Ensure share.js makes no fetch or XHR or beacon calls
    assert.ok(!shareJs.includes('fetch('), 'share.js calls fetch()');
    assert.ok(!shareJs.includes('XMLHttpRequest'), 'share.js calls XMLHttpRequest');
    assert.ok(!shareJs.includes('sendBeacon'), 'share.js calls sendBeacon');
  });

  console.log('\n6. Relative Paths Audit for GitHub Pages Subpath:');

  it('Verifies all relative asset and script paths resolve to existing files', () => {
    const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
    const relMatches = [...html.matchAll(/(?:href|src)="(\.[^"#?]*)/g)].map(m => m[1]);

    for (const rel of relMatches) {
      const resolved = path.resolve(ROOT_DIR, rel);
      assert.ok(fs.existsSync(resolved), `Referenced path does not exist on disk: ${rel}`);
    }
  });

  console.log('\n7. Real Android-Generated Payloads Compatibility Suite:');

  const fixturesPath = path.join(ROOT_DIR, 'tests', 'fixtures', 'android_generated_payloads.json');
  assert.ok(fs.existsSync(fixturesPath), `Android-generated fixtures file missing at ${fixturesPath}`);
  const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));

  await itAsync('Decodes real Android single_item_en fixture and verifies full structure', async () => {
    const fix = fixtures.single_item_en;
    assert.ok(fix, 'single_item_en fixture exists');
    const decoded = await manager.decodeAndDecompress(fix.encoded);
    assert.strictEqual(decoded.title, fix.expectedTitle);
    assert.strictEqual(decoded.type, fix.expectedType);
    assert.strictEqual(decoded.contents.length, fix.expectedContentsCount);
    assert.strictEqual(decoded.categories.length, fix.expectedCategoriesCount);
    assert.strictEqual(decoded.contents[0].title, 'Inception');
    assert.strictEqual(decoded.contents[0].watchStatus, 'WATCHED');
    assert.strictEqual(decoded.contents[0].contentType, 'MOVIE');
    assert.ok(decoded.contents[0].externalUrl.startsWith('https://www.imdb.com'));

    // Test DOM rendering
    await manager.processEncodedString(fix.encoded, false);
    assert.strictEqual(document.getElementById('payload-title').textContent, 'Inception');
  });

  await itAsync('Decodes real Android custom_list_multi fixture with multiple content types', async () => {
    const fix = fixtures.custom_list_multi;
    assert.ok(fix, 'custom_list_multi fixture exists');
    const decoded = await manager.decodeAndDecompress(fix.encoded);
    assert.strictEqual(decoded.title, fix.expectedTitle);
    assert.strictEqual(decoded.type, fix.expectedType);
    assert.strictEqual(decoded.contents.length, fix.expectedContentsCount);
    assert.strictEqual(decoded.categories.length, fix.expectedCategoriesCount);

    const types = decoded.contents.map(c => c.contentType);
    assert.ok(types.includes('SERIES'));
    assert.ok(types.includes('MOVIE'));
    assert.ok(types.includes('VIDEO'));

    await manager.processEncodedString(fix.encoded, false);
    assert.strictEqual(document.getElementById('payload-title').textContent, 'Weekend Watchlist 🎬');
  });

  await itAsync('Decodes real Android russian_unicode_emoji fixture with zero mojibake', async () => {
    const fix = fixtures.russian_unicode_emoji;
    assert.ok(fix, 'russian_unicode_emoji fixture exists');
    const decoded = await manager.decodeAndDecompress(fix.encoded);
    assert.strictEqual(decoded.title, fix.expectedTitle);
    assert.strictEqual(decoded.contents.length, fix.expectedContentsCount);
    assert.strictEqual(decoded.contents[0].title, 'Интерстеллар 🚀');
    assert.ok(decoded.contents[0].description.includes('продовольственному кризису'));
    assert.strictEqual(decoded.categories[0].name, 'Фантастика');
    assert.strictEqual(decoded.categories[1].name, 'Ужасы');

    // Test DOM rendering with Russian locale
    window.I18N.currentLang = 'ru';
    await manager.processEncodedString(fix.encoded, false);
    assert.strictEqual(document.getElementById('payload-title').textContent, 'Шедевры мирового кино 🍿 ★');
    window.I18N.currentLang = 'en'; // restore
  });

  await itAsync('Decodes real Android missing_optional_fields fixture without throwing', async () => {
    const fix = fixtures.missing_optional_fields;
    assert.ok(fix, 'missing_optional_fields fixture exists');
    const decoded = await manager.decodeAndDecompress(fix.encoded);
    assert.strictEqual(decoded.title, fix.expectedTitle);
    assert.strictEqual(decoded.contents[0].description, null);
    assert.strictEqual(decoded.contents[0].externalUrl, null);
    assert.strictEqual(decoded.categories.length, 0);

    // Verify rendering handles null descriptions and URLs cleanly
    await manager.processEncodedString(fix.encoded, false);
  });

  await itAsync('Decodes real Android empty_descriptions_and_links fixture cleanly', async () => {
    const fix = fixtures.empty_descriptions_and_links;
    assert.ok(fix, 'empty_descriptions_and_links fixture exists');
    const decoded = await manager.decodeAndDecompress(fix.encoded);
    assert.strictEqual(decoded.title, fix.expectedTitle);
    await manager.processEncodedString(fix.encoded, false);
  });

  await itAsync('Decodes real Android multilingual_japanese fixture with Kanji, Kana, and Dragon emoji', async () => {
    const fix = fixtures.multilingual_japanese;
    assert.ok(fix, 'multilingual_japanese fixture exists');
    const decoded = await manager.decodeAndDecompress(fix.encoded);
    assert.strictEqual(decoded.title, fix.expectedTitle);
    assert.strictEqual(decoded.contents[0].title, '千と千尋の神隠し (Spirited Away)');
    assert.ok(decoded.contents[0].description.includes('宮崎駿'));
    assert.strictEqual(decoded.categories[0].name, 'アニメ');
  });

  await itAsync('Rejects real Android unsupported_future_version fixture with clear error', async () => {
    const fix = fixtures.unsupported_future_version;
    assert.ok(fix, 'unsupported_future_version fixture exists');
    await assert.rejects(async () => {
      await manager.decodeAndDecompress(fix.encoded);
    }, /Unsupported sharing version 99/);
  });

  await itAsync('Decodes real uncompressed raw JSON payload fallback', async () => {
    const fix = fixtures.uncompressed_raw_json;
    assert.ok(fix, 'uncompressed_raw_json fixture exists');
    const decoded = await manager.decodeAndDecompress(fix.encoded);
    assert.strictEqual(decoded.title, fix.expectedTitle);
    assert.strictEqual(decoded.contents[0].title, 'Raw JSON Item');
  });

  await itAsync('Rejects real corrupted_base64 fixture with decoding error', async () => {
    const fix = fixtures.corrupted_base64;
    assert.ok(fix, 'corrupted_base64 fixture exists');
    await assert.rejects(async () => {
      await manager.decodeAndDecompress(fix.encoded);
    });
  });

  await itAsync('Rejects real corrupted_gzip fixture with decompression error', async () => {
    const fix = fixtures.corrupted_gzip;
    assert.ok(fix, 'corrupted_gzip fixture exists');
    await assert.rejects(async () => {
      await manager.decodeAndDecompress(fix.encoded);
    });
  });

  await itAsync('Decodes full Android-generated HTTPS share URL end-to-end and sets app deep link button', async () => {
    const fix = fixtures.single_item_en;
    assert.ok(fix, 'single_item_en fixture exists');
    const androidGeneratedHttpsUrl = `https://vito2211.github.io/WhatoToWatch/#share/${fix.encoded}`;

    // Extract payload from full Android HTTPS URL
    const extracted = manager.extractPayload(androidGeneratedHttpsUrl);
    assert.strictEqual(extracted, fix.encoded);

    // Process extracted string
    await manager.processEncodedString(extracted, false);

    // Verify preview card elements populated
    const titleEl = document.getElementById('payload-title');
    assert.strictEqual(titleEl.textContent, fix.expectedTitle);

    // Verify Open in App button points to whattowatch:// deep link
    const directBtn = document.getElementById('payload-open-app-btn');
    assert.strictEqual(directBtn.href, `whattowatch://share/${fix.encoded}`);
  });

  await itAsync('Decodes full legacy whattowatch:// deep link URL end-to-end', async () => {
    const fix = fixtures.single_item_en;
    const legacyUrl = `whattowatch://share/${fix.encoded}`;
    const extracted = manager.extractPayload(legacyUrl);
    assert.strictEqual(extracted, fix.encoded);

    await manager.processEncodedString(extracted, false);
    const titleEl = document.getElementById('payload-title');
    assert.strictEqual(titleEl.textContent, fix.expectedTitle);
  });

  console.log('\n------------------------------------------------------');
  console.log(` Results: ${passedTests}/${totalTests} tests passed successfully!`);
  console.log('------------------------------------------------------\n');
}

runAllTests().catch((err) => {
  console.error('\nTest suite failed:', err);
  process.exit(1);
});
