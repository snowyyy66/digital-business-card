const endpoint = process.env.GRAPHQL_URL ?? 'http://127.0.0.1:3000/graphql';

const query = `
  query SmokeProfile {
    profile {
      name
      description
      links
      skills { name }
      experience { company position period achievements }
      projects { name description url }
    }
  }
`;

async function main() {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL HTTP ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (result.errors?.length) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  const profile = result.data?.profile;
  if (!profile) {
    throw new Error('GraphQL returned a null or missing profile');
  }

  for (const key of ['links', 'skills', 'experience', 'projects']) {
    if (!Array.isArray(profile[key])) {
      throw new Error(`GraphQL profile.${key} must be an array`);
    }
  }

  console.log(`Smoke check passed: ${profile.name}`);
}

main().catch((error) => {
  const reason = error.cause?.code ? `${error.message} (${error.cause.code})` : error.message;
  console.error(`Smoke check failed: ${reason}`);
  process.exitCode = 1;
});
