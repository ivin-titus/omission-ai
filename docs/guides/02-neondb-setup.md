# NeonDB Setup Guide (Serverless Postgres)

This guide covers setting up your Neon Postgres database and applying the schema.

## 1. Project Creation
1. Go to [Neon.tech](https://console.neon.tech/) and sign in.
2. Click **New Project**.
3. **Name:** "Omission AI".
4. **Postgres Version:** Default (e.g., 16 or 15).
5. **Region:** Choose the region closest to you or your Vercel deployment (e.g., US East, EU Central).
6. Click **Create Project**.

## 2. Get the Connection String
1. Once created, you will see a dashboard with a **Connection String** box.
2. Make sure the checkbox for "Pooled connection" is checked if you plan to use it heavily, but for the hackathon, the direct connection works fine.
3. Copy the string. It will look like:
   `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`
4. Paste it into your `.env.local`:
   ```env
   DATABASE_URL=postgresql://...
   ```

## 3. Run the Database Schema
You don't need a complex migration tool for the MVP. We will run the raw SQL directly in the Neon Dashboard.
1. In the Neon sidebar, click on **SQL Editor**.
2. Paste the schema from the `METRO_SPRINT_SPEC.md`:

```sql
CREATE TABLE decisions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  original_decision TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'clarifying',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  decision_id INT REFERENCES decisions(id),
  review_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
3. Click the **Run** button.
4. Verify by checking the **Tables** tab in the sidebar. You should see `decisions` and `reviews`.

## 4. How to use in Code (Reference for Hackathon)
Use the tiny wrapper in `src/lib/db.ts`. It keeps DB access in one place and checks the connection once before the first query. The connection check fails after 10 seconds.

```typescript
import { db } from '@/lib/db';

export async function POST() {
  const rows = await db`
    INSERT INTO decisions (user_id, original_decision)
    VALUES (${userId}, 'Should I learn Rust?')
    RETURNING *
  `;

  return Response.json(rows[0]);
}
```

For an explicit smoke check, call:

```typescript
import { checkDatabaseConnection } from '@/lib/db';

await checkDatabaseConnection();
```

Keep feature queries close to the route or server action that needs them. Do not build a repository layer until there is repeated query logic worth extracting.
