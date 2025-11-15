import * as SQLite from "expo-sqlite"
import { useEffect, useState } from "react"
import { View, ActivityIndicator } from "react-native"

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
            <InitData>
                {children}
            </InitData>
        </SQLite.SQLiteProvider>
    );
}

export const InitData = ({ children }: RE) => {
    const { add, existAny, findAll } = useExpenseRepository()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            try {
                const hasData = await existAny();
                if (!hasData) {
                    for (const movie of data) {
                        await add(movie)
                    }
                }
                const result = await findAll()
                console.log(result)
            } catch (error) {
                console.error(error);
                throw error
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={"#bff007"} size={24} />
            </View>
        );
    }

    return (
        children
    );
}

export type Movie = {
    id: string;
    title: string,
    year: number,
    watched: number,
    rating?: number,
    created_at: Date
}

export const useExpenseRepository = () => {
    const db = SQLite.useSQLiteContext()

    const add = async (movie: Movie) => {
        try {
            if (movie.rating)
                await db.runAsync(
                    `insert into movies (id, title, year, watched, rating, created_at) values (?, ?, ?, ?, ?, ?)`,
                    [movie.id, movie.title, movie.year, movie.watched, movie.rating, movie.created_at.getTime()]
                )
            else
                await db.runAsync(
                    `insert into movies (id, title, year, watched, created_at) values (?, ?, ?, ?, ?)`,
                    [movie.id, movie.title, movie.year, movie.watched, movie.created_at.getTime()]
                )
        } catch (error) {
            console.error(error);
        }
    }

    const update = async (movie: Movie) => {
        try {
            if (movie.rating)
                await db.runAsync(
                    `update movies set title = ?, year = ?, watched = ?, rating = ?, created_at = ? where id = ?`,
                    [movie.title, movie.year, movie.watched, movie.rating, movie.created_at.getTime(), movie.id]
                )
            else
                await db.runAsync(
                    `update movies set title = ?, year = ?, watched = ?, created_at = ? where id = ?`,
                    [movie.title, movie.year, movie.watched, movie.created_at.getTime(), movie.id]
                )
        } catch (error) {
            console.error(error);
        }
    }

    const findAll = async () => {
        try {
            const e = await db.getAllAsync<Movie>(`select * from movies`)
            return e.map(i => ({
                id: i.id,
                title: i.title,
                year: i.year,
                watched: i.watched,
                rating: i.rating,
                created_at: new Date(i.created_at)
            } as Movie))
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    const findById = async (id: string) => {
        try {
            const e = await db.getFirstAsync<Movie>(`select * from movies where id = ?`, [id])
            if (!e) throw Error("Không tìm thấy movie này")
            return {
                id: e.id,
                title: e.title,
                year: e.year,
                watched: e.watched,
                rating: e.rating,
                created_at: new Date(e.created_at)
            } as Movie
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    const existAny = async () => {
        try {
            const e = await db.getFirstAsync<{ hasData: 1 | 0 }>(`select count(*) > 0 as hasData from movies`)
            if (!e) return false
            return e.hasData === 1
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    return { add, update, findAll, findById, existAny };
}

const data: Movie[] = [
    {
        id: "1",
        title: "Titanic",
        year: 1990,
        watched: 10000,
        rating: 4,
        created_at: new Date()
    },
    {
        id: "2",
        title: "Inception",
        year: 1991,
        watched: 20000,
        rating: 5,
        created_at: new Date()
    },
    {
        id: "3",
        title: "Interstellar",
        year: 1992,
        watched: 30000,
        rating: 3,
        created_at: new Date()
    }
]