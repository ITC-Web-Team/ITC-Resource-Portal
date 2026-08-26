# PostgreSQL setup

The Django server is configured to use PostgreSQL.

## 1. Fill the database password

Open `server/.env` and set:

```env
POSTGRES_DB=itc_resource_portal
POSTGRES_USER=postgres
POSTGRES_PASSWORD=DM@952122
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
```

## 2. Make sure the database exists

Create a PostgreSQL database named `itc_resource_portal`.

## 3. Run migrations

From `server/`:

```powershell
.\venv\Scripts\python.exe manage.py migrate
```

## 4. Verify the connection

```powershell
.\venv\Scripts\python.exe manage.py showmigrations
.\venv\Scripts\python.exe manage.py check
```

If migration succeeds, the backend is fully using PostgreSQL instead of SQLite.
