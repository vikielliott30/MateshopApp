import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.baseUrl = config.env.baseUrl || 'https://bookshopwebappqa-f5fue3gkfxcqefb4.brazilsouth-01.azurewebsites.net';
      return config;
    },
    pageLoadTimeout: 120000, // Espera hasta 2 minutos que cargue la página
    defaultCommandTimeout: 10000, // Espera hasta 10 segundos para cada comando
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'cypress/results/results-[hash].xml',
      toConsole: true,
      attachments: true,  // Para incluir screenshots
      testCaseSwitchClassnameAndName: false,
    },
    // Configuraciones adicionales útiles para CI/CD
    video: true,  // Graba videos de los tests
    screenshotOnRunFailure: true,  // Screenshots cuando fallan
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
  },
  experimentalStudio: true,
});