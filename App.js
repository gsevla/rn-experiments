import React from 'react';
import { View } from 'react-native';
import Carousel from './src/components/Carousel';

const App = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <Carousel />
    </View>
  );
};

export default App;
