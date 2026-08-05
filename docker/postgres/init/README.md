# PostgreSQL Local Development Environment

This directory contains initialization scripts (`.sql` or `.sh` files) that run automatically when the PostgreSQL container is booted for the first time.

---

## Quick Start Commands

Run these commands from the `docker/` directory (or specify `-f docker/docker-compose.yml` from the workspace root):

### Start Docker

```bash
docker compose up -d
```

### Stop Docker

```bash
docker compose down
```

### Restart Docker

```bash
docker compose restart
```

### View PostgreSQL Logs

```bash
docker compose logs -f postgres
```

### Connect with Interactive psql Session

```bash
docker exec -it samud-postgres psql -U postgres
```

---

## Connection Details

### PostgreSQL (Local Application / Driver Access)

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `samud_shabkat`
- **User**: `postgres`
- **Password**: `postgres`
- **Connection String**: `postgres://postgres:postgres@localhost:5432/samud_shabkat`

### pgAdmin 4 (Web Interface)

- **URL**: http://localhost:5050
- **Login Email**: `admin@samud.local`
- **Login Password**: `admin123`

---

## Connecting with UI Tools

### How to connect with DBeaver

1. Open DBeaver and click **New Database Connection**.
2. Select **PostgreSQL** and click **Next**.
3. Enter the following connection parameters:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `samud_shabkat`
   - **Username**: `postgres`
   - **Password**: `postgres`
4. Click **Test Connection** to ensure DBeaver can communicate with Docker, then click **Finish**.

### How to connect with pgAdmin

1. Navigate to http://localhost:5050 in your web browser.
2. Log in using `admin@samud.local` / `admin123`.
3. Right-click on **Servers** -> **Register** -> **Server...**
4. In the **General** tab, set **Name** to `Samud Shabkat Local`.
5. In the **Connection** tab, enter:
   - **Host name/address**: `postgres` _(or `samud-postgres`, via internal Docker network `samud-network`)_
   - **Port**: `5432`
   - **Maintenance database**: `samud_shabkat`
   - **Username**: `postgres`
   - **Password**: `postgres`
6. Check **Save password** and click **Save**.

---

## Verification Steps

### How to verify PostgreSQL is healthy

You can verify container health using Docker CLI:

```bash
docker inspect --format "{{.State.Health.Status}}" samud-postgres
```

Or check the real-time status in Docker Compose:

```bash
docker compose ps
```

Look for `(healthy)` next to `samud-postgres`.

### How to connect using psql

Execute into the running Postgres container directly:

```bash
docker exec -it samud-postgres psql -U postgres -d samud_shabkat
```

Once inside the prompt (`samud_shabkat=#`), you can run SQL commands such as `\dt` to list tables or `\conninfo` to view connection stats.

---

## Common Troubleshooting Tips

1. **Port 5432 is already allocated**:
   - Error: `Bind for 0.0.0.0:5432 failed: port is already allocated`.
   - Solution: Stop any existing local installation of PostgreSQL (or another container) running on port `5432`, or change the exposed host port in `docker-compose.yml` to `"5433:5432"` and update `DATABASE_PORT=5433` in `.env`.

2. **Database password authentication failed**:
   - Error: `FATAL: password authentication failed for user "postgres"`.
   - Solution: If you previously launched a container with different credentials on the same named volume (`postgres_data`), Postgres will retain the old password. Reset the volume by stopping the containers with `docker compose down -v` and running `docker compose up -d`.

3. **pgAdmin cannot connect to Postgres Server**:
   - When configuring the server in pgAdmin, do **not** use `localhost` or `127.0.0.1` as the Host name. Because pgAdmin runs inside a container, `localhost` points to the pgAdmin container itself. Use the Compose service name `postgres` or container name `samud-postgres`.

4. **Container remains in `(unhealthy)` state**:
   - Check the verbose initialization logs:
     ```bash
     docker compose logs postgres
     ```
   - Ensure adequate disk space is available for Docker volumes.
