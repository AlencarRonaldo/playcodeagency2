import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E
 * Otimizada para testes de fluxo de compra e integrações
 */
export default defineConfig({
  testDir: './tests',
  
  /* Execução em paralelo */
  fullyParallel: true,
  
  /* Falhar CI se você deixou test.only */
  forbidOnly: !!process.env.CI,
  
  /* Retry em CI apenas */
  retries: process.env.CI ? 2 : 0,
  
  /* Workers otimizados */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter para resultados */
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  /* Configurações globais */
  use: {
    /* URL base para testes */
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    
    /* Coletar traces on retry */
    trace: 'on-first-retry',
    
    /* Screenshots em falha */
    screenshot: 'only-on-failure',
    
    /* Videos em falha */
    video: 'retain-on-failure',
    
    /* Headers globais */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },

  /* Configuração dos projetos/browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    /* Testes mobile */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    /* Tablet */
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    }
  ],

  /* Servidor de desenvolvimento */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutos
  },
  
  /* Timeout configurações */
  timeout: 30 * 1000, // 30 segundos por teste
  expect: {
    timeout: 10 * 1000 // 10 segundos para assertions
  },
  
  /* Configurações específicas para diferentes ambientes */
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
});