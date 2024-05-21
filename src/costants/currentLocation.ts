import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// export const getCurrentLocation = () => {
//   return new Promise((resolve, reject) => {
//     check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
//       if (result === RESULTS.GRANTED) {
//         Geolocation.getCurrentPosition(
//           position => {
//             const { latitude, longitude } = position.coords;
//             resolve({ latitude, longitude });
//           },
//           error => {
//             console.error(error);
//             reject(error);
//           },
//           { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//         );
//       } else {
//         request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
//           if (result === RESULTS.GRANTED) {
//             getCurrentLocation().then(resolve).catch(reject);
//           } else {
//             reject('Location permission denied');
//           }
//         });
//       }
//     });
//   });
// };



export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    // Check location permission
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      if (result === RESULTS.GRANTED) {
        // If permission granted, attempt to get location
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          error => {
            console.error(error);
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      } else {
        // If permission not granted, request permission
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
          if (result === RESULTS.GRANTED) {
            // If permission granted after request, attempt to get location again
            getCurrentLocation().then(resolve).catch(reject);
          } else {
            // If permission denied, reject with an error
            reject('Location permission denied');
          }
        });
      }
    }).catch(error => {
      console.error(error);
      reject(error);
    });
  });
};
