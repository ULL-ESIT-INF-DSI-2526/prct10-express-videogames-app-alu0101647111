const BASE_URL = 'https://rickandmortyapi.com/api/character';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
}

export function findCharacter(
  name?: string,
  status?: string,
  species?: string,
  gender?: string
): Promise<Character[]> {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();

    if (name) params.append('name', name);
    if (status) params.append('status', status);
    if (species) params.append('species', species);
    if (gender) params.append('gender', gender);

    fetch(`${BASE_URL}?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la petición HTTP');
        }

        return response.json();
      })
      .then((data) => {
        if (!data.results || data.results.length === 0) {
          reject(new Error('No se encontraron personajes'));
          return;
        }

        resolve(data.results);
      })
      .catch((error) => reject(error));
  });
}