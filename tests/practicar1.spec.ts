import { describe, test, expect } from 'vitest';
import { findCharacter } from '../src/practicar1.js';

describe('findCharacter', () => {
  test('debe encontrar personajes', async () => {
    const characters = await findCharacter('Rick');

    expect(characters.length).toBeGreaterThan(0);
  });

  test('debe rechazar si no hay resultados', async () => {
    await expect(
      findCharacter('personaje-inexistente')
    ).rejects.toThrow('Error en la petición HTTP');
  });
});