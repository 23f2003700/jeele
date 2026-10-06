# JEELE
## Less someday. More living.
A complete, responsive, static adventure-career field guide. Built for GitHub Pages, without a build step, API keys, external fonts, CDN libraries, accounts or a backend.

## Publish on GitHub Pages
1. Extract this ZIP.
2. Create a GitHub repository (for example `jeele`).
3. Upload **the contents** of the extracted folder into the repository root. `index.html` must be at the root, not inside another `JEELE` folder. Upload the folders too; do not upload only the HTML or the ZIP.
4. In the repository, open **Settings → Pages**.
5. Choose **Deploy from a branch**, then **main** and **/(root)**. Click Save.
6. Wait for GitHub's deployment to complete. Open the URL shown in Pages settings (usually `https://YOUR-USERNAME.github.io/jeele/`).

GitHub account eligibility and repository visibility can affect Pages availability. No deployment has been performed by the designer. All site asset links are relative, so a project-repository subpath works.

## Preview locally
Open `index.html` in a current browser. For a server preview:
```
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## What works
- Responsive landing page and mobile navigation.
- All 30 sport pathways, category filtering and live search.
- Detail dialogs with starting points, earning routes, cost caveats and source links.
- Save/unsave favourites; persistence in this browser using localStorage.
- Saved-list export as a text file, and clear-saves control.
- A three-choice starting-plan generator and downloadable text plan.
- Three ways-to-earn tabs with keyboard navigation.
- Six adventure-related career dialogs.
- Accessible FAQ accordions, source list and privacy notes.
- A public, anonymised 17-page PDF field guide.
- All images stored locally: original JPGs plus optimised WebP versions.

## Files
- `index.html` — page structure and copy.
- `assets/css/style.css` — full design and responsive styles.
- `assets/js/data.js` — sport catalogue and reference sources.
- `assets/js/app.js` — filters, saves, dialogs, tabs and plan logic.
- `assets/images/` — photography and SVG favicon.
- `assets/downloads/jeele-field-guide.pdf` — anonymised public guide.
- `.nojekyll` — skips GitHub Pages Jekyll processing.
- `IMAGE-CREDITS.md` — photograph origins and licence reference.
- `CONTENT-NOTES.md` — research limits and editing notes.

## Make it yours
Change the brand copy and navigation in `index.html`. Edit colours in the `:root` block of `style.css`. Edit the catalogue in `data.js`; keep IDs unique. Replace photography with your own licensed images if desired; preserve the filenames or update the HTML paths.

Before publishing:
- Review every public file. Do not upload credentials or personal records.
- Review course prices and regulations; research was checked in October 2026 and can become outdated.
- Replace the public PDF if you need a different guide.
- For rich social previews, add `og:image` and `og:url` with your final absolute public URLs.
- No domain or DNS configuration is included. No fake email forms or booking buttons have been added.

## Privacy
The package uses localStorage for saved sport IDs only. There is no analytics, advertising, account, tracking cookie, server form or backend. Saved lists do not sync between devices. If storage is blocked, saves work for the current visit only. Hosting providers and external source websites have their own logging and policies.

## Compatibility
Designed for current Chrome, Edge, Firefox and Safari. Uses native HTML dialog, details/summary and modern CSS Grid. Requires JavaScript for interactive features; the PDF remains accessible without it. Includes visible keyboard focus, semantic controls and reduced-motion support.

## Permissions
You may edit and publish the original JEELE HTML/CSS/JS and favicon delivered in this package. Third-party photographs remain subject to their own licence. Source organisations are independent and are not affiliated with JEELE.
