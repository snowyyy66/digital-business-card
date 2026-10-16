const { getBuildSteps, normalizeDatabaseEnvironment } = require('./vercel-build.cjs');

describe('Vercel build setup', () => {
  it('migrates and seeds only production deployments', () => {
    expect(getBuildSteps({ VERCEL_ENV: 'production' })).toEqual([
      'generate',
      'migrate',
      'seed',
      'build',
    ]);
    expect(getBuildSteps({ VERCEL_ENV: 'preview' })).toEqual(['generate', 'build']);
    expect(getBuildSteps({})).toEqual(['generate', 'build']);
  });

  it('supports the custom STORAGE_URL prefix used by the Vercel integration', () => {
    const environment = { STORAGE_URL: 'postgres://database' };

    expect(normalizeDatabaseEnvironment(environment)).toEqual({
      STORAGE_URL: 'postgres://database',
      DATABASE_URL: 'postgres://database',
    });
  });
});
