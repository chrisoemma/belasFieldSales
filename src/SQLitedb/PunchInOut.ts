import { SQLiteDatabase } from 'react-native-sqlite-storage';


export const createPunchInOutTable = async (db: SQLiteDatabase) => {
    const query = `CREATE TABLE IF NOT EXISTS PunchInOut (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          punchInTime INTEGER NOT NULL,
          punchOutTime INTEGER,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL
      );`;
  
    await db.executeSql(query);
};
