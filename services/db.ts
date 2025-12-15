import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

// Initialize the database
export const initDatabase = async () => {
  db = await SQLite.openDatabaseAsync('notes.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      folderId TEXT,
      tags TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (folderId) REFERENCES folders (id)
    );
  `);
};

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  tags: string; // JSON string
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
}

// Notes operations
export const getNotes = async (): Promise<Note[]> => {
  if (!db) await initDatabase();
  const allRows = await db.getAllAsync<Note>('SELECT * FROM notes ORDER BY updatedAt DESC');
  return allRows;
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  if (!db) await initDatabase();
  const row = await db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?', [id]);
  return row;
};

export const saveNote = async (id: string, title: string, content: string, folderId: string | null, tags: string[]) => {
  if (!db) await initDatabase();
  const now = Date.now();

  // Check if note exists
  const existing = await db.getFirstAsync('SELECT id FROM notes WHERE id = ?', [id]);

  if (existing) {
    await db.runAsync(
      'UPDATE notes SET title = ?, content = ?, folderId = ?, tags = ?, updatedAt = ? WHERE id = ?',
      [title, content, folderId, JSON.stringify(tags), now, id]
    );
  } else {
    await db.runAsync(
      'INSERT INTO notes (id, title, content, folderId, tags, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, title, content, folderId, JSON.stringify(tags), now, now]
    );
  }
};

export const deleteNote = async (id: string) => {
  if (!db) await initDatabase();
  await db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
};

// Folders operations
export const getFolders = async () => {
  if (!db) await initDatabase();
  return await db.getAllAsync('SELECT * FROM folders');
}

export const createFolder = async (id: string, name: string) => {
  if (!db) await initDatabase();
  await db.runAsync('INSERT INTO folders (id, name) VALUES (?, ?)', [id, name]);
}

export const deleteFolder = async (id: string) => {
  if (!db) await initDatabase();
  await db.runAsync('DELETE FROM folders WHERE id = ?', [id]);
}
