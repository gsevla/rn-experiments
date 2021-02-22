import React, { useRef } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  PanResponder,
  Animated,
  useWindowDimensions,
} from 'react-native';

const App = () => {
  const dims = useWindowDimensions();
  const panX = useRef(new Animated.Value(0)).current;
  const panXY = useRef(new Animated.ValueXY()).current;

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        panX.setOffset(panX._value);
        // panX.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        Animated.event(
          [
            null,
            {
              dx: panX,
            },
          ],
          {
            useNativeDriver: false,
          },
        )(evt, gestureState);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        panX.flattenOffset();
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#eee" />
      <View style={styles.content}>
        <Animated.View style={[styles.slide, { backgroundColor: 'red' }]}>
          <Text>1</Text>
        </Animated.View>
        <View style={[styles.slide, { backgroundColor: 'green' }]}>
          <Text>2</Text>
        </View>
        <Animated.View
          style={[
            styles.slide,
            {
              backgroundColor: 'blue',
              transform: [
                {
                  translateX: panX,
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}>
          <Text>3</Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
  },
  slide: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
