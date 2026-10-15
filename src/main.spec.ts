jest.mock('@nestjs/core', () => ({
  NestFactory: { create: jest.fn() },
}));

import { NestFactory } from '@nestjs/core';

describe('application shutdown', () => {
  it('enables Nest shutdown hooks before listening', async () => {
    const calls: string[] = [];
    let resolveListen!: () => void;
    const listening = new Promise<void>((resolve) => {
      resolveListen = resolve;
    });
    const app = {
      enableShutdownHooks: jest.fn(() => calls.push('shutdown')),
      listen: jest.fn(async () => {
        calls.push('listen');
        resolveListen();
      }),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(app);

    await jest.isolateModulesAsync(async () => {
      await import('./main');
    });
    await listening;

    expect(calls).toEqual(['shutdown', 'listen']);
  });
});
