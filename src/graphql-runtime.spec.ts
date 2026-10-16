describe('GraphQL runtime dependencies', () => {
  it('can resolve the Express 5 adapter required by Nest Apollo', () => {
    expect(() => require.resolve('@as-integrations/express5')).not.toThrow();
  });
});
