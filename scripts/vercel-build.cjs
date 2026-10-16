const { spawnSync } = require('node:child_process');
const path = require('node:path');

function getBuildSteps(environment) {
  return environment.VERCEL_ENV === 'production'
    ? ['generate', 'migrate', 'seed', 'build']
    : ['generate', 'build'];
}

function normalizeDatabaseEnvironment(environment) {
  if (!environment.DATABASE_URL && environment.STORAGE_URL) {
    environment.DATABASE_URL = environment.STORAGE_URL;
  }
  return environment;
}

const commands = {
  generate: ['prisma/build/index.js', ['generate']],
  migrate: ['prisma/build/index.js', ['migrate', 'deploy']],
  seed: ['tsx/dist/cli.mjs', ['prisma/seed.ts']],
  build: ['@nestjs/cli/bin/nest.js', ['build']],
};

function runBuild(environment = process.env) {
  normalizeDatabaseEnvironment(environment);

  for (const step of getBuildSteps(environment)) {
    if ((step === 'migrate' || step === 'seed') && !environment.DATABASE_URL) {
      throw new Error('DATABASE_URL is required to prepare the production database.');
    }

    const [entryPoint, args] = commands[step];
    const result = spawnSync(process.execPath, [path.join('node_modules', entryPoint), ...args], {
      env: environment,
      stdio: 'inherit',
    });

    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}

module.exports = { getBuildSteps, normalizeDatabaseEnvironment, runBuild };

if (require.main === module) runBuild();
