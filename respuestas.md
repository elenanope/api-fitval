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