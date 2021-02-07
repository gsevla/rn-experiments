import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CARD_OBJECT } from '../../constants';
import AnimatedCard from '../AnimatedCard';

const CARD_AMOUNT = 8;

const Carousel = () => {
  const [cardState, setCardState] = useState(
    new Array(CARD_AMOUNT).fill(CARD_OBJECT).reduce((accu, item, index) => {
      const cardObj = {
        id: index, //number
        cardRef: useRef(), //react ref
        cardSelected: index != 0 ? false : true, //boolean
      };
      accu.push(cardObj);
      return accu;
    }, []),
  );

  const selectPrevCard = () => {
    if (cardState[0].cardSelected) {
      return;
    }
    setCardState((prev) => {
      const newCardState = [...prev];
      const [selectedCard] = newCardState.filter((item) => item.cardSelected);
      const selectedCardIndex = newCardState.findIndex(
        (item) => item == selectedCard,
      );

      newCardState[selectedCardIndex - 1].cardRef.current.animateCardUp();
      newCardState[selectedCardIndex].cardSelected = false;
      newCardState[selectedCardIndex - 1].cardSelected = true;

      return newCardState;
    });
  };

  const selectNextCard = () => {
    if (cardState[cardState.length - 1].cardSelected) {
      return;
    }
    setCardState((prev) => {
      const newCardState = [...prev];
      const [selectedCard] = newCardState.filter((item) => item.cardSelected);
      const selectedCardIndex = newCardState.findIndex(
        (item) => item == selectedCard,
      );

      newCardState[selectedCardIndex].cardRef.current.animateCardDown();
      newCardState[selectedCardIndex].cardSelected = false;
      newCardState[selectedCardIndex + 1].cardSelected = true;

      return newCardState;
    });
  };

  return (
    <>
      <View
        style={{
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          margin: 16,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={styles.common.button}
          onPress={() => {
            selectPrevCard();
          }}
        >
          <Text style={styles.common.text}>prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.common.button}
          onPress={() => {
            selectNextCard();
          }}
        >
          <Text style={styles.common.text}>next</Text>
        </TouchableOpacity>
      </View>
      {cardState.map((item) => {
        return (
          <AnimatedCard
            ref={item.cardRef}
            selected={item.cardSelected}
            title={item.id + 1}
            key={item.id.toString()}
          />
        );
      })}
    </>
  );
};

const styles = {
  common: StyleSheet.create({
    button: {
      elevation: 8,
      borderRadius: 4,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 14,
    },
  }),
};

export default Carousel;
