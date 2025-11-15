import * as SQLite from "expo-sqlite"

type RE = { children: React.ReactNode }

export const InitDb = ({ children }: RE) => {
    return (
        <SQLite.SQLiteProvider
            databaseName="expenseDatabase"
            onInit={async (db) => {
                await db.execAsync(`
                    create table if not exists movies(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        year INTEGER,
                        watched INTEGER DEFAULT 0,
                        rating INTEGER,
                        created_at INTEGER
                        );
                    pragma journal_model=wal;
                    `)
            }}
            options={{ useNewConnection: false }}
        >
                {children}
        </SQLite.SQLiteProvider>
    );
}

export type Movie = {
    id: string;
    title: string,
    year: number,
    watched: number,
    rating: number,
    created_at: number
}