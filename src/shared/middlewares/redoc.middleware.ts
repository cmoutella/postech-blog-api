import redoc from 'redoc-express';

export function setupRedoc(app: any) {
  const redocOptions = {
    title: 'API for FIAP-POSTECH used to post in a blog',
    version: '1.0',
    specUrl: '/api-json',
  };
  app.use('/docs', redoc(redocOptions));
}
