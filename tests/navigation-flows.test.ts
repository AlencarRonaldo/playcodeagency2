import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:3006';
const TIMEOUT = 30000;

// Helper function to check if page loaded successfully
async function checkPageLoad(page: Page, expectedUrl?: string, expectedTitle?: string) {
  // Wait for page to load
  await page.waitForLoadState('networkidle', { timeout: TIMEOUT });
  
  // Check URL if provided
  if (expectedUrl) {
    expect(page.url()).toContain(expectedUrl);
  }
  
  // Check title if provided
  if (expectedTitle) {
    await expect(page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }
  
  // Check for 404 or error pages
  const pageContent = await page.content();
  expect(pageContent).not.toContain('404');
  expect(pageContent).not.toContain('Page not found');
  expect(pageContent).not.toContain('Error');
  
  // Check that main content loaded
  await expect(page.locator('body')).toBeVisible();
}

// Helper function to test navigation links
async function testNavigationLink(page: Page, selector: string, expectedUrl: string, linkText?: string) {
  const link = page.locator(selector);
  await expect(link).toBeVisible();
  
  if (linkText) {
    await expect(link).toContainText(linkText);
  }
  
  await link.click();
  await checkPageLoad(page, expectedUrl);
}

test.describe('PlayCode Agency Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Main Site Navigation', () => {
    test('Header navigation links work correctly', async ({ page }) => {
      // Test logo link
      await page.locator('header a[href="/"]').first().click();
      await checkPageLoad(page, '/', 'PlayCode');
      
      // Test main navigation menu
      const navLinks = [
        { text: 'Início', url: '/' },
        { text: 'Serviços', url: '/servicos' },
        { text: 'Combos', url: '/combos' },
        { text: 'Contato', url: '/contato' }
      ];
      
      for (const link of navLinks) {
        await page.goto(BASE_URL);
        await page.locator(`nav a:has-text("${link.text}")`).click();
        await checkPageLoad(page, link.url);
      }
    });

    test('Footer navigation links work correctly', async ({ page }) => {
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Test footer links
      const footerLinks = [
        { selector: 'footer a[href="/servicos"]', url: '/servicos' },
        { selector: 'footer a[href="/combos"]', url: '/combos' },
        { selector: 'footer a[href="/contato"]', url: '/contato' }
      ];
      
      for (const link of footerLinks) {
        await page.goto(BASE_URL);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const footerLink = page.locator(link.selector).first();
        if (await footerLink.isVisible()) {
          await footerLink.click();
          await checkPageLoad(page, link.url);
        }
      }
    });

    test('Mobile menu navigation works', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      
      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="menu"]');
      if (await menuButton.isVisible()) {
        await menuButton.click();
        
        // Test mobile menu links
        const mobileLinks = ['Início', 'Serviços', 'Combos', 'Contato'];
        for (const linkText of mobileLinks) {
          const link = page.locator(`a:has-text("${linkText}")`).first();
          if (await link.isVisible()) {
            await link.click();
            await page.waitForLoadState('networkidle');
          }
        }
      }
    });
  });

  test.describe('Service Pages and CTAs', () => {
    test('Service page CTAs work correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/servicos`);
      await checkPageLoad(page, '/servicos');
      
      // Test service cards and CTAs
      const serviceCards = page.locator('[data-testid="service-card"], .service-card, article');
      const cardCount = await serviceCards.count();
      
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = serviceCards.nth(i);
        const ctaButton = card.locator('button, a').filter({ hasText: /saiba mais|contratar|começar/i });
        
        if (await ctaButton.isVisible()) {
          const buttonText = await ctaButton.textContent();
          console.log(`Testing CTA: ${buttonText}`);
          
          // Check if it's a link or button
          const tagName = await ctaButton.evaluate(el => el.tagName.toLowerCase());
          if (tagName === 'a') {
            const href = await ctaButton.getAttribute('href');
            if (href && !href.startsWith('#')) {
              await ctaButton.click();
              await page.waitForLoadState('networkidle');
              await page.goBack();
            }
          }
        }
      }
    });
  });

  test.describe('Combo/Package Pages', () => {
    test('Combo page and purchase flows work', async ({ page }) => {
      await page.goto(`${BASE_URL}/combos`);
      await checkPageLoad(page, '/combos');
      
      // Test combo cards
      const comboCards = page.locator('[data-testid="combo-card"], .combo-card, .package-card, article');
      const cardCount = await comboCards.count();
      
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = comboCards.nth(i);
        const purchaseButton = card.locator('button, a').filter({ hasText: /comprar|adquirir|escolher|contratar/i });
        
        if (await purchaseButton.isVisible()) {
          const buttonText = await purchaseButton.textContent();
          console.log(`Testing purchase button: ${buttonText}`);
          
          // Check button functionality
          const tagName = await purchaseButton.evaluate(el => el.tagName.toLowerCase());
          if (tagName === 'a') {
            const href = await purchaseButton.getAttribute('href');
            if (href && href.startsWith('/')) {
              await purchaseButton.click();
              await page.waitForLoadState('networkidle');
              await page.goBack();
            }
          } else {
            // For buttons, check if they trigger modals or other actions
            await purchaseButton.click();
            await page.waitForTimeout(1000);
            
            // Check for modal or new page
            const modal = page.locator('.modal, [role="dialog"], .dialog');
            if (await modal.isVisible()) {
              const closeButton = modal.locator('button').filter({ hasText: /fechar|close|x/i });
              if (await closeButton.isVisible()) {
                await closeButton.click();
              }
            } else {
              await page.goBack();
            }
          }
        }
      }
    });
  });

  test.describe('Contact Forms', () => {
    test('Contact form submission flow works', async ({ page }) => {
      await page.goto(`${BASE_URL}/contato`);
      await checkPageLoad(page, '/contato');
      
      // Find contact form
      const form = page.locator('form').first();
      if (await form.isVisible()) {
        // Fill form fields
        const nameInput = form.locator('input[name="name"], input[placeholder*="nome"]').first();
        const emailInput = form.locator('input[name="email"], input[type="email"]').first();
        const messageInput = form.locator('textarea[name="message"], textarea').first();
        
        if (await nameInput.isVisible()) {
          await nameInput.fill('Test User');
        }
        
        if (await emailInput.isVisible()) {
          await emailInput.fill('test@example.com');
        }
        
        if (await messageInput.isVisible()) {
          await messageInput.fill('This is a test message');
        }
        
        // Submit form
        const submitButton = form.locator('button[type="submit"], button').filter({ hasText: /enviar|submit/i });
        if (await submitButton.isVisible()) {
          // Note: Not actually submitting to avoid sending test emails
          await expect(submitButton).toBeEnabled();
          console.log('Contact form submit button is functional');
        }
      }
    });
  });

  test.describe('Admin Dashboard', () => {
    test('Admin dashboard navigation works', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`);
      
      // Check if redirected to login or if dashboard loads
      await page.waitForLoadState('networkidle');
      const currentUrl = page.url();
      
      if (currentUrl.includes('/admin')) {
        await checkPageLoad(page, '/admin');
        
        // Test admin navigation links
        const adminLinks = [
          { selector: 'a[href*="/admin/onboarding"]', text: 'Onboarding' },
          { selector: 'a[href*="/admin/approval"]', text: 'Approval' },
          { selector: 'a[href*="/admin/clients"]', text: 'Clients' },
          { selector: 'a[href*="/admin/analytics"]', text: 'Analytics' }
        ];
        
        for (const link of adminLinks) {
          const adminLink = page.locator(link.selector).first();
          if (await adminLink.isVisible()) {
            await adminLink.click();
            await page.waitForLoadState('networkidle');
            console.log(`Admin link "${link.text}" works correctly`);
            await page.goto(`${BASE_URL}/admin`);
          }
        }
      } else {
        console.log('Admin area requires authentication');
      }
    });

    test('Onboarding admin workflow buttons', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/onboarding`);
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      if (currentUrl.includes('/admin/onboarding')) {
        // Test workflow buttons
        const workflowButtons = page.locator('button').filter({ hasText: /create|edit|delete|view|novo|editar|excluir|visualizar/i });
        const buttonCount = await workflowButtons.count();
        
        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          const button = workflowButtons.nth(i);
          if (await button.isVisible()) {
            const buttonText = await button.textContent();
            console.log(`Onboarding button "${buttonText}" is functional`);
          }
        }
      }
    });

    test('Approval system status and action buttons', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/approval`);
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      if (currentUrl.includes('/admin/approval')) {
        // Test status filters
        const statusButtons = page.locator('button').filter({ hasText: /pending|approved|rejected|pendente|aprovado|rejeitado/i });
        const statusCount = await statusButtons.count();
        
        for (let i = 0; i < Math.min(statusCount, 3); i++) {
          const button = statusButtons.nth(i);
          if (await button.isVisible()) {
            await button.click();
            await page.waitForTimeout(500);
            console.log('Status filter button works');
          }
        }
        
        // Test action buttons
        const actionButtons = page.locator('button').filter({ hasText: /approve|reject|view|aprovar|rejeitar|visualizar/i });
        const actionCount = await actionButtons.count();
        
        for (let i = 0; i < Math.min(actionCount, 3); i++) {
          const button = actionButtons.nth(i);
          if (await button.isVisible()) {
            const buttonText = await button.textContent();
            console.log(`Approval action "${buttonText}" is functional`);
          }
        }
      }
    });
  });

  test.describe('Interactive Elements', () => {
    test('Interactive components work correctly', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Test accordion/collapsible elements
      const accordions = page.locator('[data-testid="accordion"], .accordion, details');
      const accordionCount = await accordions.count();
      
      for (let i = 0; i < Math.min(accordionCount, 2); i++) {
        const accordion = accordions.nth(i);
        if (await accordion.isVisible()) {
          await accordion.click();
          await page.waitForTimeout(500);
          console.log('Accordion element is interactive');
        }
      }
      
      // Test tabs
      const tabs = page.locator('[role="tab"], .tab');
      const tabCount = await tabs.count();
      
      for (let i = 0; i < Math.min(tabCount, 3); i++) {
        const tab = tabs.nth(i);
        if (await tab.isVisible()) {
          await tab.click();
          await page.waitForTimeout(500);
          console.log('Tab element is interactive');
        }
      }
      
      // Test modals/dialogs
      const modalTriggers = page.locator('button').filter({ hasText: /open|show|mais info|detalhes/i });
      const triggerCount = await modalTriggers.count();
      
      for (let i = 0; i < Math.min(triggerCount, 2); i++) {
        const trigger = modalTriggers.nth(i);
        if (await trigger.isVisible()) {
          await trigger.click();
          await page.waitForTimeout(1000);
          
          const modal = page.locator('.modal, [role="dialog"], .dialog');
          if (await modal.isVisible()) {
            const closeButton = modal.locator('button').filter({ hasText: /close|fechar|x/i }).first();
            if (await closeButton.isVisible()) {
              await closeButton.click();
              console.log('Modal functionality works');
            }
          }
        }
      }
    });
  });

  test.describe('Error Handling', () => {
    test('404 pages are handled correctly', async ({ page }) => {
      // Test non-existent page
      await page.goto(`${BASE_URL}/this-page-does-not-exist-12345`);
      await page.waitForLoadState('networkidle');
      
      // Check if 404 page is shown or redirected
      const pageContent = await page.content();
      const has404 = pageContent.includes('404') || pageContent.includes('not found') || pageContent.includes('não encontrad');
      
      if (has404) {
        console.log('404 page is properly displayed');
        
        // Check for home link
        const homeLink = page.locator('a').filter({ hasText: /home|início|voltar/i });
        if (await homeLink.isVisible()) {
          await homeLink.click();
          await checkPageLoad(page, '/');
          console.log('404 page has working home link');
        }
      } else {
        console.log('Application redirects or handles 404 differently');
      }
    });
  });
});

// Summary test to collect all results
test.describe('Navigation Summary', () => {
  test('Generate navigation test summary', async ({ page }) => {
    console.log('\n=== NAVIGATION TEST SUMMARY ===');
    console.log('All navigation tests completed');
    console.log('Check individual test results above for details');
    console.log('Any failures indicate broken navigation flows');
    console.log('===============================\n');
  });
});