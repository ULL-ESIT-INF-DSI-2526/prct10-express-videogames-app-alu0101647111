const BASE_URL = 'https://rickandmortyapi.com/api/episode';

export interface Episode {
  name: string;
  air_date: string;
}


export function listEpisodes(ids: number[]): Promise<Episode[]> {
  return new Promise((resolve, reject) => {
    if (!ids || ids.length === 0) {
      reject(new Error('Debes proporcionar IDs'));
      return;
    }

    fetch(`${BASE_URL}/${ids.join(',')}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la petición HTTP');
        }

        return response.json();
      })
      .then((data) => {
        const episodes = Array.isArray(data) ? data : [data];

        if (episodes.length === 0) {
          reject(new Error('No se encontraron episodios'));
          return;
        }

        resolve(
          episodes.map((episode) => ({
            name: episode.name,
            air_date: episode.air_date
          }))
        );
      })
      .catch((error) => reject(error));
  });
}