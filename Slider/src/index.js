import React, { useRef } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  PanResponder,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';

const AnimatedSlideView = () => {};

const App = () => {
  const dims = useWindowDimensions();
  const panX = useRef(new Animated.Value(0)).current;
  const panXY = useRef(new Animated.ValueXY()).current;

  const SNAP_THRESHOLD = dims.width * 0.25;
  console.log('width', dims.width);

  // const snapFromRightToLeftInterpolation = panX.interpolate({
  //   inputRange: [0, -dims.width],
  //   outputRange: [0, -dims.width],
  // });

  const snapFromRightToLeft = () =>
    Animated.spring(panX, {
      toValue: -dims.width,
      bounciness: 0,
      useNativeDriver: false,
    }).start();

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
        console.log(gestureState, panX);
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
        // console.log(JSON.stringify(gestureState, null, 2));
        // console.log(gestureState);
        if (Math.abs(gestureState.dx) >= SNAP_THRESHOLD) {
          console.log('will snap');
          console.log(gestureState);
          Animated.spring(panX, {
            toValue: -dims.width,
            bounciness: 0,
            useNativeDriver: false,
            velocity: gestureState.vx,
          }).start();
        } else {
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: false,
            bounciness: 0,
          }).start();
        }
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
                  // translateX: panX,
                  translateX: panX,
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}>
          <Text>3</Text>
        </Animated.View>
        <TouchableOpacity
          onPress={() => {
            snapFromRightToLeft();
          }}
          style={{
            padding: 24,
            borderRadius: 4,
            backgroundColor: '#000',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#fff' }}>test</Text>
        </TouchableOpacity>
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
