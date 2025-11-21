/*
export const environment = {
  production: true,
  //apiUrl: 'http://localhost:7150/api'  // URL de la API para prod
  apiUrl: 'https://bookshopbackendwebapp-prod-frfrb2g2bffghrdq.brazilsouth-01.azurewebsites.net/api'  // URL de la API para prod
};
*/

export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && window.env?.apiUrl)
      ? window.env.apiUrl
      : 'http://localhost:7150/api'  // Fallback para desarrollo local
};