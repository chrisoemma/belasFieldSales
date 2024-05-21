import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  try {
    const db = await openDatabase({ name: 'punchInOut.db', location: 'default' });
    console.log('database initialized',db)
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw new Error('Failed to open database');
  }
};
