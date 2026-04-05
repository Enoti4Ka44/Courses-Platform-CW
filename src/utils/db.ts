import { Pool, QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: "postgresql://postgres:root@localhost:5432/courses_db",
});

export const query = <T extends QueryResultRow>(text: string, params?: any[]) =>
  pool.query<T>(text, params);

export default pool;
