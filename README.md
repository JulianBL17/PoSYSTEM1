# POS — Spring Boot + Angular + PostgreSQL

```
backend/   Spring Boot 3 (API REST)  ·  puerto interno 8080
fronted/   Angular 22 (interfaz)     ·  nginx en Docker, puerto 4200
docker-compose.yml   levanta base de datos + backend + frontend
```

## Con Docker (servidor o PC)

```bash
docker compose up --build
```

Abre **http://localhost:4200** (en el servidor: `http://IP_DEL_SERVIDOR:4200`, con el puerto 4200 abierto).

Usuario inicial (se crea solo si la tabla de usuarios está vacía):

| Correo | Contraseña |
|---|---|
| `admin@pos.com` | `admin123` |

Cambia esa contraseña desde la pantalla *Usuarios* (al editar, dejar la contraseña vacía conserva la actual).

Cómo se conecta todo: el navegador llama a `/api/...` en el mismo origen y **nginx** (dentro del contenedor
del frontend) lo reenvía al backend. Por eso no hace falta CORS ni publicar el puerto 8080.

Para reiniciar la base de datos desde cero: `docker compose down -v`.

## Sin Docker (desarrollo)

Necesitas JDK 17+, Maven, Node 22+ y PostgreSQL con la base `posb` (usuario `posb`, clave `12345`,
puerto **5433** según `backend/src/main/resources/application.properties`).

```bash
# terminal 1
cd backend && mvn spring-boot:run

# terminal 2
cd fronted && npm install && npm start     # http://localhost:4200
```

`npm start` usa `fronted/proxy.conf.json`, que reenvía `/api` a `http://localhost:8080`.

## Endpoints

| Pantalla | Endpoints |
|---|---|
| Login | `POST /api/auth/login` |
| Productos | `GET/POST /api/productos` · `PUT/DELETE /api/productos/{id}` |
| Usuarios | `GET/POST /api/usuarios` · `PUT/DELETE /api/usuarios/{id}` |
| Ventas | `GET/POST /api/ventas` |

## Pendientes recomendados

- Las contraseñas se guardan en texto plano (`NoOpPasswordEncoder`): usar BCrypt antes de producción.
- La API no exige sesión (`permitAll`); el login de Angular solo protege las pantallas. La protección real
  requiere JWT o sesión del lado del servidor.
- Las ventas no descuentan stock del producto.
