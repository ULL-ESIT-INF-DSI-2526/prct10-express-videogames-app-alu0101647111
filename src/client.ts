import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import net from 'net';
import chalk from 'chalk';
import { Genero, Plataforma, RequestType, ResponseType, Videogame } from './type.js';

/**
 * Función para formatear el valor de mercado de un videojuego con colores según su rango.
 * @param value - El valor de mercado del videojuego.
 * @returns La cadena formateada con colores.
 */
function formatValue(value: number): string {
  if (value < 20) return chalk.red(value.toString());
  if (value < 40) return chalk.yellow(value.toString());
  if (value < 60) return chalk.blue(value.toString());
  return chalk.green(value.toString());
}

/**
 * Funcion auxiliar para imprimir la información de un videojuego de forma legible en la consola.
 * @param game - El videojuego a imprimir.
 */
function printGame(game: Videogame) {
  console.log("--------------------------------");
  console.log(`ID: ${game.id}`);
  console.log(`Name: ${game.nombre}`);
  console.log(`Description: ${game.descripcion}`);
  console.log(`Platform: ${game.plataforma}`);
  console.log(`Genre: ${game.genero}`);
  console.log(`Developer: ${game.desarrolladora}`);
  console.log(`Year: ${game.lanzamiento}`);
  console.log(`Multiplayer: ${game.multijugador}`);
  console.log(`Estimated hours: ${game.horas}`);
  console.log(`Market value: ${formatValue(game.valor)}`);
}

/**
 * Función para ejecutar una petición del cliente al servidor. 
 * Se encarga de establecer la conexión, enviar la petición, recibir la respuesta y mostrarla formateada en la consola.
 * @param request - La petición a enviar al servidor, con el tipo correcto definido en RequestType.
 */
function executeRequest(request: RequestType) {
  const client = net.connect({ port: 3000 }); // Conectamos al servidor en el puerto 3000
  let wholeData = ''; // Variable para acumular los datos recibidos del servidor
  client.write(JSON.stringify(request)); // Enviamos la petición al servidor en formato JSON
  client.on('data', (dataChunk) => { // Acumulamos los datos recibidos en caso de que lleguen en varios fragmentos
    wholeData += dataChunk.toString();
  });
  // Cuando el servidor indique que ha terminado de enviar datos, procesamos la respuesta
  client.on('end', () => {
    try {
      const response: ResponseType = JSON.parse(wholeData); // Hacemos parse de la respuesta recibida del servidor cuando indique que acaba
      if (!response.success) {
        console.log(chalk.red(response.message || 'Error desconocido'));
      } else {
        if (response.message) console.log(chalk.green(response.message));
        if (response.videogames && response.videogames.length > 0) {
          if (request.type === 'list') {
            console.log(chalk.bold.blue(`${request.user} videogame collection`));
          }
          response.videogames.forEach(game => printGame(game));
        }
      }
    } catch (error) {
      console.log(chalk.red('Error parseando la respuesta del servidor.'));
    }
  });
  client.on('error', (err) => {
    console.log(chalk.red(`Error de conexión: No se pudo conectar con el servidor en el puerto 3000.`));
  });
}

// Configuración de yargs para definir el uso correcto de los comandos por parte del clientee
yargs(hideBin(process.argv))
  .command('add', 'Añadir un videojuego', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
    name: { type: 'string', demandOption: true },
    desc: { type: 'string', demandOption: true },
    platform: { type: 'string', demandOption: true },
    genre: { type: 'string', demandOption: true },
    developer: { type: 'string', demandOption: true },
    year: { type: 'number', demandOption: true },
    multiplayer: { type: 'boolean', demandOption: true },
    hours: { type: 'number', demandOption: true },
    value: { type: 'number', demandOption: true },
  }, (argv) => {
    executeRequest({
      type: 'add',
      user: argv.user,
      id: argv.id, 
      videogame: {
        id: argv.id,
        nombre: argv.name,
        descripcion: argv.desc,
        plataforma: argv.platform as Plataforma,
        genero: argv.genre as Genero,
        desarrolladora: argv.developer,
        lanzamiento: argv.year,
        multijugador: argv.multiplayer,
        horas: argv.hours,
        valor: argv.value
      }
    });
  })
  .command('update', 'Modificar un videojuego', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true },
    name: { type: 'string', demandOption: true },
    desc: { type: 'string', demandOption: true },
    platform: { type: 'string', demandOption: true },
    genre: { type: 'string', demandOption: true },
    developer: { type: 'string', demandOption: true },
    year: { type: 'number', demandOption: true },
    multiplayer: { type: 'boolean', demandOption: true },
    hours: { type: 'number', demandOption: true },
    value: { type: 'number', demandOption: true },
  }, (argv) => {
    executeRequest({
      type: 'update',
      user: argv.user,
      id: argv.id, 
      videogame: {
        id: argv.id,
        nombre: argv.name,
        descripcion: argv.desc,
        plataforma: argv.platform as Plataforma,
        genero: argv.genre as Genero,
        desarrolladora: argv.developer,
        lanzamiento: argv.year,
        multijugador: argv.multiplayer,
        horas: argv.hours,
        valor: argv.value
      }
    });
  })
  .command('list', 'Listar juegos', {
    user: { type: 'string', demandOption: true }
  }, (argv) => {
    executeRequest({ type: 'list', user: argv.user });
  })
  .command('read', 'Leer info de un juego', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true }
  }, (argv) => {
    executeRequest({ type: 'read', user: argv.user, id: argv.id });
  })
  .command('remove', 'Eliminar un juego', {
    user: { type: 'string', demandOption: true },
    id: { type: 'number', demandOption: true }
  }, (argv) => {
    executeRequest({ type: 'remove', user: argv.user, id: argv.id });
  })
  .help()
  .parse();