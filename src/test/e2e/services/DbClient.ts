import pg from 'pg';
import {Pool} from 'pg';

export class DbClient {
    private readonly config: pg.ConnectionConfig = {
        user: import.meta.env.VITE_USER,
        host: import.meta.env.VITE_HOST,
        database: import.meta.env.VITE_DATABASE,
        password: import.meta.env.VITE_PASSWORD,
        port: import.meta.env.VITE_PORT,
    }

    public async executeQuery(query: string): Promise<any> {
        const pool = new Pool(this.config);
        try {
            await pool.connect();
            const res = await pool.query(query);
            return res.rows;
        } finally {
            pool.end().catch(e => console.error(e));
        }
    }
}