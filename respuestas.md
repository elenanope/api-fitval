## Ejercicio 0
Si intento hacer `git push` a main después de haber protegido la rama, da error, en el cual lo más importante es:

```bash
! [remote rejected] main -> main (push declined due to repository rule violations)
```

## Ejercicio 1 - Pregunta 1
Con PostgreSQL parado, si el cliente intenta acceder a /api/health recibirá el código 500 (Internal Server Error)
En la terminal veo el error que incluye la dirección y el puerto, siendo estos datos y otros, información que un hacker puede aprovechar. Así que gracias a que esto no lo ve el cliente, la API y su información está más protegida