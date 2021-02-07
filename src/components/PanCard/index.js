import React, { useRef, useEffect } from 'react';
import {
  Animated,
  View,
  useWindowDimensions,
  PanResponder,
} from 'react-native';
import { DEFAULT_CARD_SIZE } from '../../constants';

const PanCard = ({ customStyle, ...rest }) => {
  const dims = useWindowDimensions();

  const panY = useRef(new Animated.Value(0)).current;
  const cardHeight = useRef(new Animated.Value(DEFAULT_CARD_SIZE.height))
    .current;
  const cardWidth = useRef(new Animated.Value(DEFAULT_CARD_SIZE.width)).current;

  const DRAG_THRESHOLD = dims.height * 0.1;
  const DRAG_LIMIT = dims.height / 2 - DEFAULT_CARD_SIZE.height / 2;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panY.setOffset(panY._value);
      },
      onPanResponderMove: (e, gestureState) => {
        // console.log('e', e.nativeEvent.locationy, e.nativeEvent.pageY);
        // if (Math.abs(gestureState.dy) < DRAG_LIMIT) {
        return Animated.event([null, { dy: panY }], {
          useNativeDriver: false,
          listener: (evt) => {
            console.log('evt', evt.nativeEvent);
          },
        })(e, gestureState);
        // }
      },
      onPanResponderRelease: () => {
        panY.flattenOffset();
      },
    }),
  ).current;

  return (
    <>
      <Animated.View
        onLayout={(e) => {
          console.log(
            'h',
            e.nativeEvent.layout.height,
            'w',
            e.nativeEvent.layout.width,
          );
          console.log('x', e.nativeEvent.layout.x, 'y', e.nativeEvent.layout.y);
        }}
        style={[
          {
            width: cardWidth,
            height: cardHeight,
            top: dims.height / 2 - DEFAULT_CARD_SIZE.height / 2,
            left: dims.width / 2 - DEFAULT_CARD_SIZE.width / 2,
            backgroundColor: '#fff',
            position: 'absolute',
            elevation: 8,
          },
          customStyle,
          {
            // transform: [
            //   {
            //     translateY: panY.interpolate({
            //       inputRange: [0, DEFAULT_CARD_SIZE.height / 2],
            //       outputRange: [0, DEFAULT_CARD_SIZE.height / 2],
            //       extrapolate: 'clamp',
            //     }),
            //   },
            // ],
          },
          { transform: [{ translateY: panY }] },
        ]}
        {...rest}
        {...panResponder.panHandlers}
      />
      <View
        style={{
          position: 'absolute',
          width: 25,
          height: 25,
          backgroundColor: 'red',
          top: DRAG_LIMIT,
          left: 0,
        }}
      />
    </>
  );
};

export default PanCard;
