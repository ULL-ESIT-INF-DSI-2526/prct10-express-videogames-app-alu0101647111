/**
 * Enum para el tipo de plataforma de un videojuego. 
 */
export enum Plataforma {
  PC = "PC",
  PS5 = "PlayStation 5",
  Xbox = "Xbox Series X/S",
  Switch = "Nintendo Switch",
  SteamDeck = "Steam Deck"
}

/**
 * Enum para el género de un videojuego.
 */
export enum Genero {
  Accion = "Acción",
  Aventura = "Aventura",
  Rol = "Rol",
  Estrategia = "Estrategia",
  Deportes = "Deportes",
  Simulacion = "Simulación"
}

/**
 * Interfaz para un videojuego.
 */
export interface Videogame {
  id: number;
  nombre: string;
  descripcion: string;
  plataforma: Plataforma;
  genero: Genero;
  desarrolladora: string;
  lanzamiento: number;
  multijugador: boolean;
  horas: number;
  valor: number;
}

/**
 * Tipo para las peticiones que el cliente envía al servidor.
 */
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  id?: number;
  videogame?: Videogame;
}

/**
 * Tipo para las respuestas que el servidor envía al cliente.
 */
export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  message?: string;
  videogames?: Videogame[];
}