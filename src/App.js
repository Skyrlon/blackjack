import { useEffect, useState } from "react";
import "./App.css";
import Deck from "./Deck";
import Dealer from "./Dealer";

function App() {
  const [dealerHand, setDealerHand] = useState([]);

  const [cards, setCards] = useState([]);

  const setDeck = () => {
    setCards([
      ...setSuit("clubs"),
      ...setSuit("diamonds"),
      ...setSuit("hearts"),
      ...setSuit("spades"),
    ]);
  };

  const setSuit = (suitName) => {
    let suit = [];
    const ranks = [
      "ace",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "jack",
      "queen",
      "king",
    ];

    ranks.forEach((rank) =>
      suit.push({
        rank,
        suitName,
        img: `/assets/${suitName}_${rank}.png`,
      })
    );
    return suit;
  };

  const shuffleCards = () => {
    const suffledDeck = cards
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    setCards(suffledDeck);
  };

  useEffect(
    () => {
      setDeck();
    },
    // eslint-disable-next-line
    []
  );

  const startGame = () => {
    drawCard("dealer");
  };

  const drawCard = (player) => {
    const chosenCard = cards[0];
    if (player === "dealer") {
      setDealerHand([...dealerHand, chosenCard]);
      setCards(cards.filter((card) => card.img !== chosenCard.img));
    }
  };

  return (
    <div className="App">
      <Dealer hand={dealerHand} />
      <Deck />
      <button onClick={startGame}>Start</button>
    </div>
  );
}

export default App;
