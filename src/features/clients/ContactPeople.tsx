import { View, Text } from 'react-native'
import React,{useEffect} from 'react'
import { globalStyles } from '../../styles/global'
import { getContactPeople } from './ClientSlice';
import { useAppDispatch } from '../../app/store';
import { useTranslation } from 'react-i18next';
import { useSelector,RootStateOrAny } from 'react-redux';

const ContactPeople = ({route,navigation}:any) => {

    const { t } = useTranslation();
    const dispatch = useAppDispatch();

  const  {clientId} = route.params;
    useEffect(() => {
        dispatch(getContactPeople({ clientId:clientId }));
    }, [])
    const { loading, contactPeople } = useSelector(
        (state: RootStateOrAny) => state.clients,
    );

    const stylesGlobal=globalStyles();

    console.log('contact people',contactPeople);
  return (
    <View style={stylesGlobal.scrollBg}>
       
    </View>
  )
}

export default ContactPeople