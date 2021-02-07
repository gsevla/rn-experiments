import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import AnimatedCard from './src/components/AnimatedCard';
import { CARD_OBJECT } from './src/constants';

const CARD_AMOUNT = 8;

const App = () => {
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
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <View
        style={{
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          margin: 16,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            elevation: 8,
            borderRadius: 4,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
          }}
          onPress={() => {
            selectPrevCard();
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            elevation: 8,
            borderRadius: 4,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
          }}
          onPress={() => {
            selectNextCard();
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 14 }}>next</Text>
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
    </View>
  );
};

export default App;
