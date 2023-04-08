import { useEffect, useState } from "react";
import "./App.css";
import Deck from "./Deck";
import Dealer from "./Dealer";
import Player from "./Player";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
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

  const getHandScore = (hand) => {
    const ranksValues = [
      { rank: ["ace"], values: [1, 11] },
      { rank: ["two"], values: [2] },
      { rank: ["three"], values: [3] },
      { rank: ["four"], values: [4] },
      { rank: ["five"], values: [5] },
      { rank: ["six"], values: [6] },
      { rank: ["seven"], values: [7] },
      { rank: ["eight"], values: [8] },
      { rank: ["nine"], values: [9] },
      { rank: ["ten", "jack", "queen", "king"], values: [10] },
    ];
    let scoreWithoutAces = hand
      .filter((card) => card.rank !== "ace")
      .reduce(
        (accumulator, currentValue) =>
          accumulator +
          Number(
            ranksValues.find((x) => x.rank.some((y) => y === currentValue.rank))
              .values[0]
          ),
        0
      );
    if (hand.some((card) => card.rank === "ace")) {
      const aces = hand.filter((card) => card.rank === "ace");
      aces.forEach((ace) => {
        if (scoreWithoutAces + 11 > 21) {
          scoreWithoutAces = scoreWithoutAces + 1;
        } else {
          scoreWithoutAces = scoreWithoutAces + 11;
        }
      });
    }
    return scoreWithoutAces;
  };

  useEffect(
    () => {
      setDeck();
    },
    // eslint-disable-next-line
    []
  );

  const startGame = () => {
    setIsGameStarted(true);
    drawCard(["dealer", "player", "dealer", "player"], shuffleCards());
  };

  const playerDrawCard = () => {
    drawCard(["player"], cards);
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
    setPlayerHand([...playerHand, ...newPlayerCards]);
    setCards(deck.slice(drawers.length));
  };

  return (
    <div className="App">
      <Dealer hand={dealerHand} score={getHandScore(dealerHand)} />
      <Deck />
      <Player hand={playerHand} score={getHandScore(playerHand)} />
      {!isGameStarted && <button onClick={startGame}>Start</button>}
      {isGameStarted && <button onClick={playerDrawCard}>Draw</button>}
    </div>
  );
}

export default App;
