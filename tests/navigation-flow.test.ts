import { test, expect } from '@playwright/test';

test.describe('PlayCode Agency - Navigation Flow Tests', () => {
  const baseURL = 'http://localhost:3006';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Main Navigation', () => {
    test('should navigate through all main menu items', async ({ page }) => {
      const navigationItems = [
        { name: 'Início', href: '/', selector: 'text=Início' },
        { name: 'Sobre', href: '/sobre', selector: 'text=Sobre' },
        { name: 'Serviços', href: '/servicos', selector: 'text=Serviços' },
        { name: 'Portfólio', href: '/portfolio', selector: 'text=Portfólio' },
        { name: 'Planos', href: '/planos', selector: 'text=Planos' },
        { name: 'Combos', href: '/combos', selector: 'text=Combos' },
        { name: 'Admin', href: '/admin', selector: 'nav >> text=Admin' },
        { name: 'Contato', href: '/contato', selector: 'nav >> text=Contato' }
      ];

      for (const item of navigationItems) {
        // Click on navigation item
        await page.click(item.selector);
        
        // Wait for navigation
        await page.waitForURL(`${baseURL}${item.href}`);
        
        // Verify URL
        expect(page.url()).toBe(`${baseURL}${item.href}`);
        
        // Check for 404 errors
        const pageTitle = await page.title();
        expect(pageTitle).not.toContain('404');
        expect(pageTitle).not.toContain('Not Found');
        
        // Log success
        console.log(`✅ Navigation to ${item.name} (${item.href}) successful`);
      }
    });

    test('should test header CTA button', async ({ page }) => {
      // Click on "INICIAR PROJETO" button
      await page.click('text=INICIAR PROJETO');
      
      // Should navigate to contact page
      await page.waitForURL(`${baseURL}/contato`);
      expect(page.url()).toBe(`${baseURL}/contato`);
      
      console.log('✅ Header CTA button navigation successful');
    });

    test('should test logo navigation', async ({ page }) => {
      // Navigate to a different page first
      await page.goto(`${baseURL}/servicos`);
      
      // Click on logo to go back to home
      await page.click('header a[href="/"]');
      
      // Should navigate to home page
      await page.waitForURL(baseURL + '/');
      expect(page.url()).toBe(baseURL + '/');
      
      console.log('✅ Logo navigation to home successful');
    });
  });

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should test mobile menu toggle and navigation', async ({ page }) => {
      // Click hamburger menu
      await page.click('button:has(svg[class*="lucide-menu"])');
      
      // Check if mobile menu is visible
      await expect(page.locator('nav >> text=REDES SOCIAIS')).toBeVisible();
      
      // Test navigation through mobile menu
      const mobileNavItems = [
        { name: 'Serviços', href: '/servicos' },
        { name: 'Planos', href: '/planos' },
        { name: 'Contato', href: '/contato' }
      ];

      for (const item of mobileNavItems) {
        // Open menu if closed
        const menuButton = page.locator('button:has(svg[class*="lucide"])').first();
        await menuButton.click();
        
        // Click navigation item
        await page.click(`nav >> text=${item.name}`);
        
        // Wait for navigation
        await page.waitForURL(`${baseURL}${item.href}`);
        expect(page.url()).toBe(`${baseURL}${item.href}`);
        
        console.log(`✅ Mobile navigation to ${item.name} successful`);
      }
    });
  });

  test.describe('Service Pages and CTAs', () => {
    test('should test service page buttons', async ({ page }) => {
      await page.goto(`${baseURL}/servicos`);
      
      // Test "Conhecer Planos" buttons if they exist
      const plansButtons = page.locator('text=Conhecer Planos');
      const plansCount = await plansButtons.count();
      
      if (plansCount > 0) {
        await plansButtons.first().click();
        await page.waitForURL(`${baseURL}/planos`);
        expect(page.url()).toBe(`${baseURL}/planos`);
        console.log('✅ Service page "Conhecer Planos" button works');
      }
      
      // Test "Fale Conosco" buttons
      await page.goto(`${baseURL}/servicos`);
      const contactButtons = page.locator('text=Fale Conosco');
      const contactCount = await contactButtons.count();
      
      if (contactCount > 0) {
        await contactButtons.first().click();
        await page.waitForURL(`${baseURL}/contato`);
        expect(page.url()).toBe(`${baseURL}/contato`);
        console.log('✅ Service page "Fale Conosco" button works');
      }
    });
  });

  test.describe('Combo/Package Pages', () => {
    test('should test combo selection and purchase flow', async ({ page }) => {
      await page.goto(`${baseURL}/combos`);
      
      // Test "Escolher Combo" buttons
      const comboButtons = page.locator('button:has-text("Escolher")');
      const comboCount = await comboButtons.count();
      
      if (comboCount > 0) {
        // Get first combo button
        await comboButtons.first().click();
        
        // Check if it navigates or opens a modal
        await page.waitForTimeout(1000);
        
        // Check if we're on a new page or if a modal opened
        const currentUrl = page.url();
        if (currentUrl !== `${baseURL}/combos`) {
          console.log(`✅ Combo button navigated to: ${currentUrl}`);
        } else {
          // Check for modal
          const modal = page.locator('[role="dialog"], .modal, [class*="modal"]');
          if (await modal.isVisible()) {
            console.log('✅ Combo button opened a modal');
          }
        }
      }
    });
  });

  test.describe('Contact Forms', () => {
    test('should test contact form presence and fields', async ({ page }) => {
      await page.goto(`${baseURL}/contato`);
      
      // Check if form exists
      const form = page.locator('form');
      await expect(form).toBeVisible();
      
      // Check for common form fields
      const nameField = page.locator('input[name="name"], input[placeholder*="nome" i]');
      const emailField = page.locator('input[type="email"], input[name="email"]');
      const submitButton = page.locator('button[type="submit"], button:has-text("Enviar")');
      
      if (await nameField.isVisible()) {
        console.log('✅ Contact form has name field');
      }
      
      if (await emailField.isVisible()) {
        console.log('✅ Contact form has email field');
      }
      
      if (await submitButton.isVisible()) {
        console.log('✅ Contact form has submit button');
      }
    });
  });

  test.describe('Admin Dashboard', () => {
    test('should access admin dashboard and test navigation', async ({ page }) => {
      await page.goto(`${baseURL}/admin`);
      
      // Check if page loads without 404
      const pageTitle = await page.title();
      expect(pageTitle).not.toContain('404');
      
      // Look for admin navigation elements
      const dashboardElements = [
        { selector: 'text=Dashboard', name: 'Dashboard' },
        { selector: 'text=Onboarding', name: 'Onboarding' },
        { selector: 'text=Approval', name: 'Approval System' }
      ];
      
      for (const element of dashboardElements) {
        const el = page.locator(element.selector);
        if (await el.isVisible()) {
          console.log(`✅ Admin ${element.name} link found`);
          
          // Try clicking it
          await el.click();
          await page.waitForTimeout(1000);
          
          // Check URL changed
          const currentUrl = page.url();
          console.log(`   Navigated to: ${currentUrl}`);
        }
      }
    });

    test('should test onboarding admin interface', async ({ page }) => {
      await page.goto(`${baseURL}/admin/onboarding`);
      
      // Check page loads
      await page.waitForLoadState('networkidle');
      const pageTitle = await page.title();
      expect(pageTitle).not.toContain('404');
      
      // Look for onboarding specific elements
      const elements = ['Projects', 'New Project', 'Status', 'Actions'];
      
      for (const text of elements) {
        const element = page.locator(`text=${text}`);
        if (await element.isVisible()) {
          console.log(`✅ Onboarding admin has "${text}" element`);
        }
      }
    });

    test('should test approval system interface', async ({ page }) => {
      await page.goto(`${baseURL}/admin/approval`);
      
      // Check page loads
      await page.waitForLoadState('networkidle');
      const pageTitle = await page.title();
      expect(pageTitle).not.toContain('404');
      
      // Look for approval system elements
      const elements = ['Approval', 'Status', 'Pending', 'Approved', 'Actions'];
      
      for (const text of elements) {
        const element = page.locator(`text=${text}`);
        if (await element.isVisible()) {
          console.log(`✅ Approval system has "${text}" element`);
        }
      }
    });
  });

  test.describe('Footer Navigation', () => {
    test('should test footer links', async ({ page }) => {
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      // Test footer navigation links
      const footerLinks = [
        { text: 'Sobre', href: '/sobre' },
        { text: 'Serviços', href: '/servicos' },
        { text: 'Portfólio', href: '/portfolio' },
        { text: 'Contato', href: '/contato' }
      ];
      
      for (const link of footerLinks) {
        const footerLink = page.locator(`footer >> text=${link.text}`).first();
        if (await footerLink.isVisible()) {
          await footerLink.click();
          await page.waitForURL(`${baseURL}${link.href}`);
          expect(page.url()).toBe(`${baseURL}${link.href}`);
          console.log(`✅ Footer link "${link.text}" works`);
          
          // Go back to home for next test
          await page.goto(baseURL);
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('WhatsApp Float Button', () => {
    test('should test WhatsApp floating button', async ({ page }) => {
      // Look for WhatsApp button
      const whatsappButton = page.locator('[href*="whatsapp"], [href*="wa.me"], button:has-text("WhatsApp")');
      
      if (await whatsappButton.isVisible()) {
        const href = await whatsappButton.getAttribute('href');
        if (href) {
          expect(href).toContain('whatsapp');
          console.log(`✅ WhatsApp button found with link: ${href}`);
        }
      }
    });
  });

  test.describe('404 Error Handling', () => {
    test('should handle non-existent pages gracefully', async ({ page }) => {
      await page.goto(`${baseURL}/non-existent-page-12345`);
      
      // Check if 404 page is displayed properly
      const pageContent = await page.content();
      const hasError = pageContent.includes('404') || pageContent.includes('not found') || pageContent.includes('página não encontrada');
      
      if (hasError) {
        console.log('✅ 404 error page displayed correctly');
      } else {
        console.log('⚠️ No proper 404 page found');
      }
    });
  });
});

// Run specific workflow tests
test.describe('Complete User Workflows', () => {
  const baseURL = 'http://localhost:3006';

  test('should complete a full service inquiry workflow', async ({ page }) => {
    // 1. Start from home
    await page.goto(baseURL);
    
    // 2. Navigate to services
    await page.click('text=Serviços');
    await page.waitForURL(`${baseURL}/servicos`);
    
    // 3. Click on a service CTA
    const ctaButton = page.locator('button:has-text("Saiba mais"), a:has-text("Saiba mais")').first();
    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Service CTA clicked');
    }
    
    // 4. Navigate to contact
    await page.click('text=Contato');
    await page.waitForURL(`${baseURL}/contato`);
    
    console.log('✅ Complete service inquiry workflow successful');
  });

  test('should complete a plans selection workflow', async ({ page }) => {
    // 1. Start from home
    await page.goto(baseURL);
    
    // 2. Navigate to plans
    await page.click('text=Planos');
    await page.waitForURL(`${baseURL}/planos`);
    
    // 3. Look for plan selection buttons
    const planButtons = page.locator('button:has-text("Escolher"), button:has-text("Selecionar")');
    if (await planButtons.count() > 0) {
      await planButtons.first().click();
      await page.waitForTimeout(1000);
      console.log('✅ Plan selection workflow initiated');
    }
  });
});