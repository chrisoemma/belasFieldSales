import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';
import { globalStyles } from '../styles/global';

const Search = ({ placeholder }: any) => {
  const [search, setSearch] = useState('');
  const stylesGlobal=globalStyles();


  return (
    <View style={stylesGlobal.searchContainer}>
      <TextInput
        style={stylesGlobal.input}
        value={search}
        onChangeText={(text) => {
          setSearch(text);
        }}
        placeholder={placeholder}
      />
    </View>
  );
};

export default Search;
