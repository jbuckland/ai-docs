# Database Guidelines & Migrations

Universal engineering guidelines for PostgreSQL schema design, migration management, and idempotent database seeding in Node.js applications.

---

## 1. Database Architecture & Standards

### Technology Stack
- **Database Engine:** PostgreSQL 16+
- **Connection Management:** Environment-driven connection pools (`pg.Pool`) with SSL enforced in staging and production environments.
- **Timezone Standard:** All databases, sessions, and timestamps MUST standardize on UTC:
  ```sql
  SET timezone = 'UTC';
  ```
- **Tracking Table:** `pgmigrations` table tracks applied migration filenames and execution timestamps to prevent duplicate runs.

### Schema Naming Conventions
- **Table Names:** Lowercase with underscores, plural form (e.g., `users`, `families`, `sessions`, `game_actions`).
- **Junction Tables:** Joined singular or plural names representing relationships (e.g., `family_members`, `session_participants`).
- **Column Names:** Lowercase `snake_case` (e.g., `first_name`, `is_active`, `last_login_at`).
- **Primary Keys:**
  - Standard/Relational entities: `id SERIAL PRIMARY KEY` or `id BIGSERIAL PRIMARY KEY`
  - Distributed/UUID entities: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- **Foreign Keys:** `<entity_singular>_id` with explicit foreign key constraint names and explicit `ON DELETE CASCADE` or `ON DELETE SET NULL` behavior.
- **Timestamps:** Every mutable or persistent table must track standard UTC timestamps:
  ```sql
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  ```

---

## 2. Migration Best Practices

### File Naming Convention
**Format:** `NNN_descriptive_name.sql`
- `NNN` = 3-digit zero-padded sequential number (`001`, `002`, `003`, etc.).
- Migrations execute strictly in alphabetical/numerical sort order.
- Examples:
  - `001_initial_schema.sql`
  - `002_add_sessions_table.sql`
  - `003_add_user_preferences.sql`

### Writing Safe, Idempotent Migrations
1. **Atomic Transactions:** Wrap each migration script in an explicit transaction block to prevent partial schema application on failure:
   ```sql
   BEGIN;

   -- Migration statements here

   COMMIT;
   ```
2. **Use Guard Clauses:**
   - Use `CREATE TABLE IF NOT EXISTS`
   - Use `CREATE INDEX IF NOT EXISTS`
   - Wrap `ALTER TABLE ADD CONSTRAINT` or triggers in idempotent `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN NULL; END $$;` blocks.
3. **One Logical Domain per Migration:** Avoid mixing unrelated table refactors into single migration scripts.
4. **Forward-Only in Production:** Once deployed to staging or production, historical migrations are immutable. Never edit applied migration files; create a new numbered migration to apply changes.
5. **Pre-launch Consolidation:** During early prototyping and pre-release phases, consolidate incremental evolutionary migrations into a clean baseline `001_initial_schema.sql` to eliminate schema drift and ensure instant local setup.

---

## 3. Seed Data Standards

### Idempotency
- Seed scripts must be safe to execute multiple times without producing duplicate rows or throwing unique constraint violations.
- Always use `ON CONFLICT` clauses:
  ```sql
  INSERT INTO users (id, email, first_name, last_name)
  VALUES (1, 'developer@example.com', 'Dev', 'Admin')
  ON CONFLICT (email) DO NOTHING;
  ```
- For seed records that should sync updated values during reseeding, use `ON CONFLICT (...) DO UPDATE`.
- **String Literals Warning:** If the migration runner or seed script splits statements naively on semicolons (`;`), avoid unescaped inline semicolons within string literals (e.g., text content); use hyphens, commas, or parameterized query inserts.

---

## 4. Environment & Tooling Workflows

- Provide CLI scripts for environment toggling (e.g., local PostgreSQL vs remote cloud/staging databases).
- Ensure developers and CI pipelines can verify migration status and run migrations with standard npm scripts:
  ```powershell
  npm run db:status
  npm run db:migrate
  ```
