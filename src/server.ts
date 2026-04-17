import net from 'net';
import fs from 'fs';
import path from 'path';
import { RequestType, ResponseType, Videogame } from './type.js';

const DATA_DIR = './data';

// Aseguramos que el directorio de datos exista al iniciar el servidor
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Función para procesar una petición del cliente. Se encarga de manejar las operaciones de añadir, actualizar, eliminar, leer 
 * y listar videojuegos en función del tipo de petición recibida.
 * @param request - La petición recibida del cliente, con el tipo correcto definido en RequestType.
 * @param callback - Función de callback para enviar la respuesta al cliente una vez procesada la petición, con el tipo correcto definido en ResponseType.
 */
function processRequest(request: RequestType, callback: (response: ResponseType) => void) {
  const userDir = path.join(DATA_DIR, request.user);
  fs.mkdir(userDir, { recursive: true }, (err) => {
    if (err) return callback({ type: request.type, success: false, message: 'Error creando directorio del usuario.' });
    const gameId = request.id || request.videogame?.id;
    // Si no se proporciona un ID para las operaciones que lo requieren (add, update, remove, read), devolvemos un error
    if (request.type !== 'list' && !gameId) {
      return callback({ type: request.type, success: false, message: 'Error interno: Falta el ID del videojuego en la petición.' });
    }
    const filePath = gameId ? path.join(userDir, `${gameId}.json`) : '';
    // Procesamos la petición según su tipo y ejecutamos las operaciones asincrónicas correspondientes con el sistema de archivos
    switch (request.type) {
      case 'add':
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) return callback({ type: 'add', success: false, message: 'Videogame already exists at collection!' });
          fs.writeFile(filePath, JSON.stringify(request.videogame, null, 2), (err) => {
            if (err) return callback({ type: 'add', success: false, message: 'Error guardando el videojuego.' });
            callback({ type: 'add', success: true, message: 'New videogame added to collection!' });
          });
        });
        break;

      case 'update':
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) return callback({ type: 'update', success: false, message: 'Videogame not found at collection!' });
          fs.writeFile(filePath, JSON.stringify(request.videogame, null, 2), (err) => {
            if (err) return callback({ type: 'update', success: false, message: 'Error actualizando el videojuego.' });
            callback({ type: 'update', success: true, message: 'Videogame updated at collection!' });
          });
        });
        break;

      case 'remove':
        fs.unlink(filePath, (err) => {
          if (err) return callback({ type: 'remove', success: false, message: 'Videogame not found at collection!' });
          callback({ type: 'remove', success: true, message: 'Videogame removed from collection!' });
        });
        break;

      case 'read':
        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) return callback({ type: 'read', success: false, message: 'Videogame not found at collection!' });
          callback({ type: 'read', success: true, videogames: [JSON.parse(data)] });
        });
        break;

      case 'list':
        fs.readdir(userDir, (err, files) => {
          if (err || files.length === 0) return callback({ type: 'list', success: false, message: 'No videogames found.' });
          const games: Videogame[] = [];
          let filesRead = 0;
          files.forEach(file => {
            fs.readFile(path.join(userDir, file), 'utf-8', (err, data) => {
              if (!err) games.push(JSON.parse(data));
              filesRead++;
              if (filesRead === files.length) {
                callback({ type: 'list', success: true, videogames: games });
              }
            });
          });
        });
        break;
      // Si el tipo de petición no coincide con ninguno de los casos anteriores, devolvemos un error indicando que el comando no es valido
      default:
        callback({ type: request.type, success: false, message: 'Comando no reconocido.' });
    }
  });
}
// Creamos el servidor 
const server = net.createServer((connection) => {
  console.log('A client has connected.');
  // Escuchamos los datos enviados por el cliente, procesamos la petición y enviamos la respuesta formateada en formato JSON
  connection.on('data', (dataJSON) => {
    try {
      const request: RequestType = JSON.parse(dataJSON.toString());
      
      processRequest(request, (response) => {
        connection.write(JSON.stringify(response));
        connection.end(); 
      });
    } catch (error) {
      connection.write(JSON.stringify({ success: false, message: 'Error en el formato de la petición' }));
      connection.end();
    }
  });
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
});

// Iniciamos el servidor y lo dejamos a la espera de conexiones en el puerto 3000
server.listen(3000, () => {
  console.log('Waiting for clients to connect on port 3000...');
});