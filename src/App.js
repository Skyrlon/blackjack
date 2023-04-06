import { useEffect, useState } from "react";
import "./App.css";
import Deck from "./Deck";
import Dealer from "./Dealer";
import Player from "./Player";

function App() {
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
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
    return suffledDeck;
  };

  useEffect(
    () => {
      setDeck();
    },
    // eslint-disable-next-line
    []
  );

  const startGame = () => {
    drawCard(["dealer", "player", "dealer", "player"], shuffleCards());
  };

  const drawCard = (drawers, deck) => {
    const newDealerCards = [];
    const newPlayerCards = [];
    drawers.forEach((drawer, index) => {
      if (drawer === "dealer") {
        newDealerCards.push(deck[index]);
      }
      if (drawer === "player") {
        newPlayerCards.push(deck[index]);
      }
    });
    setDealerHand([...dealerHand, ...newDealerCards]);
    setPlayerHand([...dealerHand, ...newPlayerCards]);
    setCards(deck.slice(drawers.length));
  };

  return (
    <div className="App">
      <Dealer hand={dealerHand} />
      <Deck />
      <Player hand={playerHand} />
      <button onClick={startGame}>Start</button>
    </div>
  );
}

export default App;
