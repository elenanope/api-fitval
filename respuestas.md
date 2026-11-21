## Ejercicio 0
Si intento hacer `git push` a main después de haber protegido la rama, da error, en el cual lo más importante es:

```bash
! [remote rejected] main -> main (push declined due to repository rule violations)
```

## Ejercicio 1 - Pregunta 1
Con PostgreSQL parado, si el cliente intenta acceder a /api/health recibirá el código 500 (Internal Server Error)
En la terminal veo el error que incluye la dirección y el puerto, siendo estos datos y otros, información que un hacker puede aprovechar. Así que gracias a que esto no lo ve el cliente, la API y su información está más protegida

## Ejercicio 3 - Pregunta 2
Con la versión `'%${activity}%'` nos aparecen todas las clases que hay (7), ya que escribe la consulta a la base de datos directamente:
```ts
... WHERE c.activity ILIKE '%zzz' OR 1=1 --%' ORDER BY c.starts_at

```

Al cerrar las comillas y comentar el final del ILIKE puede inyectar una orden para sacar información de la base de datos. De la otra manera no nos aparece ninguna clase, porque ese "nombre de actividad" no aparece en ninguna clase. Esto pasa ya que la consulta y el valor se envían por separado, el texto que sigue a `activity=` se interpreta como texto y ya, no como consulta

## Ejercicio 4.2 - Pregunta 3
En la API comprobamos que el monitor existe para asegurarnos de que la clase que creamos contiene una clave ajena válida. Si esta no existe, el error que se lanza (400) contiene más detalles. Si no lo hiciéramos el cliente recibiría un código 500 sin más explicación porque no se recogería el error en ningún sitio, aunque sí que se produce porque SQL no permite que guardes una clase con una clave ajena que no existe

## Ejercicio 4.2 - Pregunta 4
Borrar una clase con reservas es 409 y no 400 porque 409 indica que hay un conflicto. 400 indica que la solicitud no está bien formulada por así decirlo mientras que 409 confirma que la solicitud es correcta, pero no se puede llevar a cabo por otros factores momentáneos

## Parte 4 - Pregunta 5
El token de Ana lleva dentro los siguientes datos:
- sub: el id de Ana en la base de deatos
- iat: cuándo se ha emitido el token
- exp: cuándo caduca el token

No metemos el rol por varias razones:
- A Ana le pueden cambiar el rol, por lo que el token quedaría desactualizado
- Es información pública si tienes el token, por lo que lo más seguro es meter la mínima información posible

## Parte 5 - Pregunta 6
El token de recepción funciona aunque se creó cuando era member porque cada vez que se pasa el token (con el id del usuario) se consulta en la base de datos su rol. Si el rol fuera dentro del token aún sería member porque se comprobaría dentro del propio token y no se actualizaría aunque cambiaras el rol de recepción (hasta que el token caduque o vuelva a hacer login)

## Parte 6 - Pregunta 7
En el Ejercicio 6.4, el test no necesita PostgreSQL porque ClassesService recibe el Pool por inyección de dependencias, pasándole en el test un objeto falso. 
Con mockResolvedValue *simulas* lo que devuelve la base de datos

Un test con un Pool falso no puede comprobar lo siguiente:
- Que el SQL sea correcto (los errores de sintaxis o elementos mal escritos)
- Los tipos reales que devuelve PostgreSQL, todo llega como strings

## Parte 7 - Pregunta 8
El correo lleva Date.now() para que cada vez que se ejecute sea un correo distinto ya que el número se actualiza según la hora que es. 

Si ejecutaras los tests una segunda vez con un correo fijo algunos tests como los de register darían un 409, ya que ese correo ya estaría registrado

## Parte 8 - Pregunta 9
No es peligroso, ya que el texto que escribe el usuario primero pasa por ListClassesQueryDto, donde sort tiene @IsIn(['startsAt', 'activity', 'spots']), así que como DROP TABLE classes no está en ella, responde 400 antes de llegar al controlador.

En la parte 2, el texto del usuario se pegaba directamente dentro del SQL, así que podía meter cualquier cosa. Aquí ${...} solo puede contener valores que hemos elegido nosotros.

## Parte 9 - Pregunta 10
El login tiene un límite más duro que el resto de rutas porque un posible hacker intentará esa ruta una y otra vez, probando diferentes contraseñas. 

En Render sin `app.set('trust proxy', 1)` se bloquearían todas las peticiones al superar el límite por parte de cualquier usuario (si entre todos los usuarios se realizan en total 20): contaría como si viniera todo de la misma IP 

## Parte 10 - Pregunta 11
Sin la transacción cada consulta se guarda al ejecutarse: Óscar se guarda, la especialidad 5 también, pero como la especialidad 99 no existe, salta el error y esa no se guarda. Esto último es lo único que no se ha guardado.

Nuria no tiene el id 5 aunque hubiera solo 4 monitores porque al intentar [2, 99] en especialidades ya se ha generado el id 5. El rollback deshizo la fila pero el contador de generador de ids no vuelve atrás

## Parte 13 - Pregunta 12
`Access-Control-Allow-Origin` contiene las direcciones que están autorizadas, por lo que el navegador impide que por ejemplo `otra-web.com` los lea si esta no esta entre esas autorizadas. Postman sí puede porque no es un navegador ni aplica CORS

## Parte 13 - Pregunta 13
`/api/v1/health` en database devuelve `{"status":"ok","database":"postgres"}`, porque el nombre de la database se encuentra al final de la url: antes acababa en fitval y ahora en postgres.

No he tenido que cambiar nada del código porque la conexión se crea a partir del .env

## Parte 13 - Pregunta 14
La foto ya no existe y su dirección da 404. Pero `GET /api/v1/trainers/1` sigue devolviendo el mismo photoUrl, aunque ahora apunta a un archivo que no existe.

La foto se había guardado de forma temporal en Render, no en Supabase: en cada deploy Render crea un contenedor nuevo a partir del código del repositorio, y los archivos que se subieron después no están en el repositorio. El photoUrl sí se guarda porque está guardado en la base de datos de Supabase.

Se debería guardar en un servicio de almacenamiento de objetos externo al servidor, como Amazon S3

## Parte 13 - Pregunta 15
En el 13.8: la Direct connection de Supabase solo tiene una dirección IPv6, y Render no puede conectarse por IPv6. Por eso en los Logs sale ENETUNREACH, que significa que no hay forma de llegar a esa red. El Session pooler tiene una dirección IPv4, y a esa Render sí llega.

En el 13.9: recibo un 401 Unauthorized. El token de Ana se firmó con el secreto antiguo. Al comprobarlo con el nuevo, la firma no coincide y la API lo rechaza.
Cambiaría el secreto a propósito si se hubiera filtrado o una persona no autorizada tuviera acceso a él