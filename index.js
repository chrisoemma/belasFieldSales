import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getDBConnection } from './src/SQLitedb/SQLiteInitialization';
import { createPunchInOutTable } from './src/SQLitedb/PunchInOut';

navigator.geolocation = require('@react-native-community/geolocation');

const initializeDatabase = async () => {
  try {
    const db = await getDBConnection();
    await createPunchInOutTable(db);
  } catch (error) {
    console.error('Error initializing database:', error);
    // Handle error appropriately, such as displaying an error message to the user
  }
};

initializeDatabase();

AppRegistry.registerComponent(appName, () => App);
