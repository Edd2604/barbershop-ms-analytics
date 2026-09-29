# BarberShop · Microservicio de Analíticas

Las métricas del negocio: quiénes son los mejores clientes, qué barberos y qué
servicios se piden más, cuánto se facturó y cómo crece el registro de clientes.

**Es el único de los cinco que no tiene base de datos.** No hay carpeta
`prisma`, ni esquema, ni migraciones. No almacena nada.

## Por qué no tiene base de datos

Porque los datos ya existen, repartidos entre los otros cuatro servicios. Este
no los copia: los pide cuando se los preguntan y compone la respuesta.

```
                          ┌──▶ ms-users        (clientes y barberos)
Gateway ──▶ ms-analytics ─┼──▶ ms-appointments (top de citas)
                          ├──▶ ms-services     (porcentajes de catálogo)
                          └──▶ ms-payments     (facturación)
```

Es un **agregador**: expone una sola puerta para el panel de administración, y
por detrás abre cuatro conexiones TCP y junta las piezas.

**El compromiso.** Duplicar los datos en una base propia daría respuestas más
rápidas y sobreviviría a la caída de un vecino, a cambio de sincronización y de
que las cifras pudieran quedar desfasadas. Aquí se eligió lo contrario: los
números **siempre son los de ahora**, y el precio es que este servicio está
disponible solo mientras lo estén sus cuatro fuentes.

## El truco de los `*-by-ids`

Una consulta como «top 5 de barberos» vuelve del servicio de citas con ids y
conteos, no con nombres —el servicio de citas no sabe cómo se llama nadie—. Este
servicio toma esos ids y hace **una sola llamada** a `get-barbers-by-ids` para
resolver los cinco nombres de golpe.

Por eso existen `get-customers-by-ids`, `get-barbers-by-ids` y
`get-services-by-ids` en los otros servicios: sin ellos, un top de cinco serían
cinco llamadas TCP en lugar de una.

## Qué atiende

```
get-top-customers · get-top-barbers · get-top-services
get-customers-registered · get-customers-per-month
get-barbers-percentage · get-services-percentage
get-payments-analytics · get-payments-analytics-summary
```

Varios coinciden en nombre con los del servicio de origen. No es casualidad: en
esos casos este servicio actúa de fachada, reenvía la pregunta y enriquece la
respuesta con los nombres que le faltaban.

## Stack

NestJS · TypeScript · `@nestjs/microservices` (TCP) · class-validator y
class-transformer · Joi para validar el entorno

Sin ORM y sin base de datos: toda la persistencia vive en los servicios que
consulta.

## Cómo levantarlo

```bash
npm install
npm run start:dev
```

No necesita `DATABASE_URL`. Su `.env` es su puerto y la dirección de los cuatro
servicios de los que se alimenta:

```
PORT=
USERS_MS_HOST=         USERS_MS_PORT=
APPOINTMENTS_MS_HOST=  APPOINTMENTS_MS_PORT=
SERVICES_MS_HOST=      SERVICES_MS_PORT=
PAYMENTS_MS_HOST=      PAYMENTS_MS_PORT=
```

Otros comandos: `npm run build`, `npm run start:prod`, `npm run lint`,
`npm run format`, `npm test`.

## El resto del sistema

| Repositorio | Qué hace |
|---|---|
| [barbershop-frontend](https://github.com/Edd2604/barbershop-frontend) | Interfaz web en Next.js |
| [barbershop-gateway](https://github.com/Edd2604/barbershop-gateway) | Entrada única: autentica, valida y enruta |
| [barbershop-ms-users](https://github.com/Edd2604/barbershop-ms-users) | Usuarios y clientes |
| [barbershop-ms-appointments](https://github.com/Edd2604/barbershop-ms-appointments) | Citas y disponibilidad |
| [barbershop-ms-services](https://github.com/Edd2604/barbershop-ms-services) | Catálogo de servicios |
| [barbershop-ms-payments](https://github.com/Edd2604/barbershop-ms-payments) | Pagos |

---

