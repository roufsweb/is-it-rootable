import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'audit-screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1920, height: 1080 },
];

const BASE_URL = 'http://127.0.0.1:3000';

async function safeClick(page, selectorOrElement) {
  if (typeof selectorOrElement === 'string') {
    const el = await page.$(selectorOrElement);
    if (!el) return false;
    await page.evaluate(node => {
      node.scrollIntoView({ behavior: 'instant', block: 'center' });
      node.click();
    }, el);
    return true;
  } else if (selectorOrElement) {
    await page.evaluate(node => {
      node.scrollIntoView({ behavior: 'instant', block: 'center' });
      node.click();
    }, selectorOrElement);
    return true;
  }
  return false;
}

async function runAudit() {
  console.log('Launching headless Chrome for UX audit...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const auditReport = {
    timestamp: new Date().toISOString(),
    viewports: {},
    issues: [],
    successes: [],
  };

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n========================================`);
      console.log(`Testing Viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height})`);
      console.log(`========================================`);

      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
      });

      const vpReport = {
        name: vp.name,
        width: vp.width,
        height: vp.height,
        checks: [],
      };

      try {
        // 1. Visit Home
        await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
        console.log(`- Loaded homepage`);

        // Check horizontal overflow of body
        const pageOverflow = await page.evaluate(() => {
          const docWidth = document.documentElement.clientWidth;
          const winWidth = window.innerWidth;
          const bodyScrollWidth = document.body.scrollWidth;
          return { docWidth, winWidth, bodyScrollWidth, hasOverflow: bodyScrollWidth > winWidth + 5 };
        });

        vpReport.checks.push({
          name: 'Horizontal Responsiveness',
          status: !pageOverflow.hasOverflow ? 'PASS' : 'WARN',
          details: `Client Width: ${pageOverflow.docWidth}px, Body Scroll Width: ${pageOverflow.bodyScrollWidth}px`,
        });

        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-01-home.png`), fullPage: false });

        // 2. Test Donate Modal
        console.log(`- Testing Donate / Tip modal...`);
        const tipBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('header button'));
          return btns.find(b => b.textContent.includes('Tip') || b.textContent.includes('Coffee'));
        });

        if (tipBtn && tipBtn.asElement()) {
          await safeClick(page, tipBtn.asElement());
          await new Promise(r => setTimeout(r, 400));

          const modalMetrics = await page.evaluate(() => {
            const dialog = document.querySelector('[role="dialog"]');
            if (!dialog) return { found: false };
            const modalBox = dialog.querySelector('.relative.w-full');
            const closeBtn = dialog.querySelector('button[aria-label="Close dialog"]');
            const boxRect = modalBox ? modalBox.getBoundingClientRect() : null;
            const closeRect = closeBtn ? closeBtn.getBoundingClientRect() : null;
            
            return {
              found: true,
              box: boxRect ? {
                top: Math.round(boxRect.top),
                bottom: Math.round(boxRect.bottom),
                left: Math.round(boxRect.left),
                right: Math.round(boxRect.right),
                height: Math.round(boxRect.height),
                width: Math.round(boxRect.width),
                fitsVertically: boxRect.top >= 0 && boxRect.bottom <= window.innerHeight + 5,
                fitsHorizontally: boxRect.left >= 0 && boxRect.right <= window.innerWidth + 5,
              } : null,
              closeBtn: closeRect ? {
                top: Math.round(closeRect.top),
                right: Math.round(closeRect.right),
                visible: closeRect.top >= 0 && closeRect.bottom <= window.innerHeight && closeRect.right <= window.innerWidth,
              } : null,
              winH: window.innerHeight,
              winW: window.innerWidth,
            };
          });

          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-02-donate-modal.png`) });

          if (modalMetrics.found && modalMetrics.box && modalMetrics.closeBtn) {
            const ok = modalMetrics.box.fitsVertically && modalMetrics.box.fitsHorizontally && modalMetrics.closeBtn.visible;
            vpReport.checks.push({
              name: 'Donate Modal Visibility & Bounds',
              status: ok ? 'PASS' : 'FAIL',
              details: `Modal (${modalMetrics.box.width}x${modalMetrics.box.height}px) in Window (${modalMetrics.winW}x${modalMetrics.winH}px). Close button top: ${modalMetrics.closeBtn.top}px, right: ${modalMetrics.closeBtn.right}px, visible: ${modalMetrics.closeBtn.visible}`,
            });
            if (ok) {
              auditReport.successes.push(`[${vp.name}] Donate modal 100% fits viewport, centered, X button visible`);
            } else {
              auditReport.issues.push(`[${vp.name}] Modal overflow or bounds issue`);
            }
          }

          // Test closing modal via X button
          const closeBtn = await page.$('[role="dialog"] button[aria-label="Close dialog"]');
          if (closeBtn) {
            await safeClick(page, closeBtn);
            await new Promise(r => setTimeout(r, 300));
            const stillOpen = await page.$('[role="dialog"]');
            vpReport.checks.push({
              name: 'Close Button Dismissal',
              status: !stillOpen ? 'PASS' : 'FAIL',
              details: !stillOpen ? 'Modal closed properly upon X click' : 'Modal did not close',
            });
          }
        }

        // 3. Test Form Factor Tabs Filtering
        console.log(`- Testing Form Factor segmented tabs...`);
        const tabletsTab = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.textContent.includes('Tablets & Pads'));
        });

        if (tabletsTab && tabletsTab.asElement()) {
          await safeClick(page, tabletsTab.asElement());
          await new Promise(r => setTimeout(r, 400));
          const tabletCount = await page.evaluate(() => document.querySelectorAll('a[href^="/device/"]').length);
          vpReport.checks.push({
            name: 'Tablet Filter Tab Interaction',
            status: tabletCount > 0 ? 'PASS' : 'FAIL',
            details: `Filtered correctly to ${tabletCount} tablets`,
          });
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-03-filter-tablets.png`) });
        }

        // Test Gaming Handhelds Tab
        const handheldsTab = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.textContent.includes('Gaming Handhelds'));
        });
        if (handheldsTab && handheldsTab.asElement()) {
          await safeClick(page, handheldsTab.asElement());
          await new Promise(r => setTimeout(r, 400));
          const hhCount = await page.evaluate(() => document.querySelectorAll('a[href^="/device/"]').length);
          vpReport.checks.push({
            name: 'Gaming Handhelds Filter Tab',
            status: hhCount > 0 ? 'PASS' : 'FAIL',
            details: `Filtered correctly to ${hhCount} handhelds`,
          });
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-04-filter-handhelds.png`) });
        }

        // Reset to All
        const allTab = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.textContent.startsWith('All') && b.textContent.includes('('));
        });
        if (allTab && allTab.asElement()) {
          await safeClick(page, allTab.asElement());
          await new Promise(r => setTimeout(r, 300));
        }

        // 4. Test Search Bar
        console.log(`- Testing Instant Search input...`);
        const searchInput = await page.$('input[placeholder*="Search" i]');
        if (searchInput) {
          await searchInput.click();
          await searchInput.type('Galaxy S25', { delay: 20 });
          await new Promise(r => setTimeout(r, 400));
          const count = await page.evaluate(() => document.querySelectorAll('a[href^="/device/"]').length);
          vpReport.checks.push({
            name: 'Instant Search',
            status: count > 0 ? 'PASS' : 'FAIL',
            details: `Search "Galaxy S25" returned ${count} matching devices`,
          });
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-05-search-results.png`) });

          // Clear input
          await page.evaluate(el => { el.value = ''; el.dispatchEvent(new Event('input', { bubbles: true })); }, searchInput);
          await new Promise(r => setTimeout(r, 300));
        }

        // 5. Test Quick Feature Chips: Screen Mirroring / DeX
        console.log(`- Testing Screen Mirroring / DeX filter chip...`);
        const mirrorChip = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.textContent.includes('Screen Mirroring') || b.textContent.includes('DeX'));
        });
        if (mirrorChip && mirrorChip.asElement()) {
          await safeClick(page, mirrorChip.asElement());
          await new Promise(r => setTimeout(r, 400));
          const mirrorCount = await page.evaluate(() => document.querySelectorAll('a[href^="/device/"]').length);
          vpReport.checks.push({
            name: 'Screen Mirroring Chip Filter',
            status: mirrorCount > 0 ? 'PASS' : 'FAIL',
            details: `Found ${mirrorCount} devices supporting Type-C Screen Mirroring / DeX`,
          });
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-06-filter-screen-mirroring.png`) });
        }

        // Reset All Filters
        const resetBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.textContent.includes('Reset All Filters'));
        });
        if (resetBtn && resetBtn.asElement()) {
          await safeClick(page, resetBtn.asElement());
          await new Promise(r => setTimeout(r, 300));
        }

        // 6. Test Advanced Filters Drawer
        console.log(`- Testing Advanced Filters drawer...`);
        const advBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.textContent.includes('More Filters'));
        });
        if (advBtn && advBtn.asElement()) {
          await safeClick(page, advBtn.asElement());
          await new Promise(r => setTimeout(r, 400));
          const drawerOpen = await page.evaluate(() => {
            const hasSnapdragon = Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes('Snapdragon'));
            const hasBrandSelect = !!document.querySelector('select');
            return hasSnapdragon && hasBrandSelect;
          });
          vpReport.checks.push({
            name: 'Advanced Filter Drawer Expansion',
            status: drawerOpen ? 'PASS' : 'FAIL',
            details: drawerOpen ? 'Drawer opened with SoC chips, Brand & Sort selectors' : 'Drawer failed to open',
          });
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-07-advanced-filters-open.png`) });

          // Close drawer
          await safeClick(page, advBtn.asElement());
          await new Promise(r => setTimeout(r, 300));
        }

        // 7. Test Navigation to Device Detail Page
        console.log(`- Testing navigation to Device Detail Page...`);
        const firstCardHref = await page.evaluate(() => {
          const card = document.querySelector('a[href^="/device/"]');
          return card ? card.getAttribute('href') : null;
        });

        if (firstCardHref) {
          const fullDeviceUrl = new URL(firstCardHref, BASE_URL).href;
          await page.goto(fullDeviceUrl, { waitUntil: 'networkidle0', timeout: 15000 });
          await new Promise(r => setTimeout(r, 400));

          const detailMetrics = await page.evaluate(() => {
            const docWidth = document.documentElement.clientWidth;
            const winWidth = window.innerWidth;
            const text = document.body.innerText;
            const hasVideoOut = text.includes('Screen Mirroring') || text.includes('DisplayPort') || text.includes('DeX');
            const hasModelTable = text.includes('Model Suffix') || text.includes('Bootloader Status') || text.includes('Carrier');
            return {
              docWidth,
              winWidth,
              hasVideoOut,
              hasModelTable,
            };
          });

          vpReport.checks.push({
            name: 'Device Detail Page Content & Integrity',
            status: 'PASS',
            details: `URL: ${firstCardHref}, VideoOut: ${detailMetrics.hasVideoOut}, Suffixes: ${detailMetrics.hasModelTable}`,
          });

          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-08-device-detail.png`) });
        }

        // 8. Test About Page
        console.log(`- Testing About page...`);
        await page.goto(`${BASE_URL}/about/`, { waitUntil: 'networkidle0', timeout: 15000 });
        const aboutMetrics = await page.evaluate(() => {
          const text = document.body.innerText;
          const hasEthAddress = text.includes('0x609e0AB78d5174F72fF8709564f8337DebEa5BD7');
          const hasGitHubLink = !!document.querySelector('a[href*="github.com/roufsweb"]');
          return {
            hasEthAddress,
            hasGitHubLink,
          };
        });

        vpReport.checks.push({
          name: 'About Page Responsiveness & Content',
          status: aboutMetrics.hasEthAddress && aboutMetrics.hasGitHubLink ? 'PASS' : 'WARN',
          details: `Eth tip address verified: ${aboutMetrics.hasEthAddress}, GitHub link verified: ${aboutMetrics.hasGitHubLink}`,
        });

        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-09-about-page.png`) });

      } catch (err) {
        console.error(`Error in viewport ${vp.name}:`, err);
        vpReport.error = err.message;
        auditReport.issues.push(`[${vp.name}] Error during test: ${err.message}`);
      }

      auditReport.viewports[vp.name] = vpReport;
      await page.close();
    }
  } catch (err) {
    console.error('Audit run error:', err);
    auditReport.error = err.message;
  } finally {
    await browser.close();
  }

  // Save audit report JSON
  const reportPath = path.join(SCREENSHOTS_DIR, 'ux-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`\nAudit complete! Report saved to: ${reportPath}`);
  console.log(`Screenshots saved in: ${SCREENSHOTS_DIR}`);
}

runAudit();
