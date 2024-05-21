import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { colors } from '../../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/store';
import {useSelector,RootStateOrAny } from 'react-redux';
import { toggleTrackingLocation, updateCurrentLocation, updateLocation, updatePreviousLocation } from './trackingSlice';
import NetInfo from '@react-native-community/netinfo';
import { updateInternetConnectivity } from '../InternetSlice';

const LiveLocation = () => {


  const { isConnected  } = useSelector(
    (state: RootStateOrAny) => state.internet,
  );

  const { currentLocation,previousLocation,isTracking } = useSelector(
    (state: RootStateOrAny) => state.tracking,
  );

  const checkInternetConnectivity = () => {
    NetInfo.fetch().then(state => {
      const isConnected = state.isConnected;
      dispatch(updateInternetConnectivity(isConnected));
    });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(updateInternetConnectivity(state.isConnected));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);

  // {
  //   latitude,
  //   longitude,
  //   latitudeDelta: 0.01,
  //   longitudeDelta: 0.01,
  // }

  const { t } = useTranslation();

  const slideAnimation = new Animated.Value(0);
  const zoomLevel = 0.05;

  const dispatch = useAppDispatch();

  useEffect(() => {
    checkLocationPermission();
  }, []); 



  const updateMapRegion = (latitude, longitude) => {
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01, 
      longitudeDelta: 0.01,
    });
  };

  const checkLocationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.GRANTED) {
      startLocationUpdates();
    } else {
    requestLocationPermission();
    }
  };

  const requestLocationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.GRANTED) {
      startLocationUpdates();
    }
  };

  const startLocationUpdates = () => {
    setLoading(true); // Show loading indicator
  checkInternetConnectivity();

    Geolocation.watchPosition(
      (position) => {
        setLoading(false);
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        updateMapRegion(latitude, longitude);
      },
      (error) => {
        console.error(error)
        setLoading(false); 
      },
      { enableHighAccuracy: true, distanceFilter: 10 }

    );
  };


  const toggleTracking = () => {
    if (isTracking) {
      Geolocation.clearWatch();
     // setPreviousLocation(location);
      dispatch(updatePreviousLocation(location));
      slideAnimation.setValue(0); // Reset the animation value
    } else {
      startLocationUpdates();
      dispatch(updateCurrentLocation(location));
      dispatch(updateLocation(location));
      // Animate the slide from 0 to 1 (left to right)
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300, // Adjust the duration as needed
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
     // setIsTracking(!isTracking);
    dispatch(toggleTrackingLocation());
  };

  const toggleIconStyle = {
    transform: [
      {
        translateX: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 35],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
    {isTracking && !location && loading && ( 
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>{t('screens:loadingLocationMessage')}</Text>
      </View>
    )}
    <Text style={styles.header}>{t('screens:locationTracking')}</Text>
    <View style={styles.toggleBtn}>
      <Text style={{ padding: 3, fontSize: 18, marginRight: 10 }}>
        {t('screens:tracking')} {isTracking ? `${t('screens:on')}` : `${t('screens:off')}`}
      </Text>
      <TouchableOpacity onPress={toggleTracking}>
        <Icon
          name={isTracking ? 'toggle-switch-outline' : 'toggle-switch-off-outline'}
          color={colors.black}
          size={35}
        />
      </TouchableOpacity>
    </View>
    <Animated.View style={[toggleIconStyle, styles.toggleIcon]} />
    {location && region && isTracking  &&   (
      <MapView style={styles.map} region={region}>
        {location && (
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title={t('screens:userLocation')} />
        )}
      </MapView>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  toggleBtn:{

  borderRadius:20,
  borderWidth:0.5,
  borderColor:colors.black,
  flexDirection:'row',
  justifyContent:'space-between',
  paddingHorizontal:10
 // backgroundColor:'blue'
  },
  toggleIcon: {
    position: 'absolute',
    left: 10, 
    top: 12, 
  },
  loadingContainer: {
    position: 'absolute',
    top: -200,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background
  },
});

export default LiveLocation;
