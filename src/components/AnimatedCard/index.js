import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Animated, useWindowDimensions, Text } from 'react-native';
import { DEFAULT_CARD_SIZE } from '../../constants';

const ANIMATION_TIME = 400;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const AnimatedCard = forwardRef(({ selected = false, title }, ref) => {
  const prevProps = usePrevious({ selected });

  const dims = useWindowDimensions();
  const [cardLayout, setCardLayout] = useState({ ...DEFAULT_CARD_SIZE });

  const cardVerticalPosition = useRef(
    new Animated.Value(dims.height / 2 - DEFAULT_CARD_SIZE.height / 2),
  ).current;

  const cardHorizontalPosition = useRef(new Animated.Value(selected ? 1 : 0))
    .current;

  const cardHorizontalPositionToSelectedHorizontalPosition = cardHorizontalPosition.interpolate(
    {
      inputRange: [0, 1],
      outputRange: [dims.width, dims.width / 2 - DEFAULT_CARD_SIZE.width / 2],
    },
  );

  const cardHeight = useRef(new Animated.Value(DEFAULT_CARD_SIZE.height))
    .current;
  const cardWidth = useRef(new Animated.Value(DEFAULT_CARD_SIZE.width)).current;

  const animateVerticalPosIn = () =>
    Animated.timing(cardVerticalPosition, {
      toValue: dims.height + DEFAULT_CARD_SIZE.height / 2,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();

  const animateVerticalPosOut = () =>
    Animated.timing(cardVerticalPosition, {
      toValue: dims.height / 2 - DEFAULT_CARD_SIZE.height / 2,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();

  const animateHeightIn = () =>
    Animated.timing(cardHeight, {
      toValue: cardLayout.height - DEFAULT_CARD_SIZE.height,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();

  const animateHeightOut = () =>
    Animated.timing(cardHeight, {
      toValue: DEFAULT_CARD_SIZE.height,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();

  const animateWidthIn = () =>
    Animated.timing(cardWidth, {
      toValue: cardLayout.width - DEFAULT_CARD_SIZE.width,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();

  const animateWidthOut = () =>
    Animated.timing(cardWidth, {
      toValue: DEFAULT_CARD_SIZE.width,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();

  const animateRightToLeft = () =>
    Animated.timing(cardHorizontalPosition, {
      toValue: 1,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();

  const animateLeftToRight = () =>
    Animated.timing(cardHorizontalPosition, {
      toValue: 0,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();

  useImperativeHandle(ref, () => ({
    animateCardDown() {
      animateVerticalPosIn();
      animateHeightIn();
      animateWidthIn();
    },
    animateCardUp() {
      animateVerticalPosOut();
      animateHeightOut();
      animateWidthOut();
    },
    animateCardRightToLeft() {
      animateRightToLeft();
    },
  }));

  useEffect(() => {
    if (prevProps) {
      if (selected == true && prevProps.selected == false) {
        animateRightToLeft();
      } else if (selected == false && prevProps.selected == true) {
        animateLeftToRight();
      }
    }
  }, [selected]);

  return (
    <Animated.View
      onLayout={(e) => {
        setCardLayout(e.nativeEvent.layout);
      }}
      style={{
        width: cardWidth,
        height: cardHeight,
        top: cardVerticalPosition,
        left: cardHorizontalPositionToSelectedHorizontalPosition,
        backgroundColor: '#000',
        position: 'absolute',
        elevation: 16,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 48,
          color: '#fff',
        }}
      >
        {title}
      </Text>
    </Animated.View>
  );
});

export default AnimatedCard;
