import { describe, test, expect } from 'vitest';
import { listEpisodes } from '../src/practicar2.js';

describe('listEpisodes', () => {
  test('debe obtener episodios', async () => {
    const episodes = await listEpisodes([1, 2]);

    expect(episodes.length).toBe(2);
  });

  test('debe rechazar con ids vacíos', async () => {
    await expect(listEpisodes([])).rejects.toThrow(
      'Debes proporcionar IDs'
    );
  });
});