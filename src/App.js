import { useEffect, useState } from "react";
import "./App.css";
import Deck from "./Deck";
import Dealer from "./Dealer";
import Player from "./Player";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [stateOfGame, setStateOfGame] = useState("");
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
      { ranks: ["two"], value: 2 },
      { ranks: ["three"], value: 3 },
      { ranks: ["four"], value: 4 },
      { ranks: ["five"], value: 5 },
      { ranks: ["six"], value: 6 },
      { ranks: ["seven"], value: 7 },
      { ranks: ["eight"], value: 8 },
      { ranks: ["nine"], value: 9 },
      { ranks: ["ten", "jack", "queen", "king"], value: 10 },
    ];
    let scoreWithoutAces = hand
      .filter((card) => card.rank !== "ace")
      .reduce(
        (accumulator, currentValue) =>
          accumulator +
          Number(
            ranksValues.find((x) =>
              x.ranks.some((y) => y === currentValue.rank)
            ).value
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

  useEffect(() => {
    if (getHandScore(playerHand) > 21) {
      setIsGameOver(true);
      setStateOfGame("Busted");
    }
  }, [playerHand]);

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
      {isGameStarted && !isGameOver && (
        <button onClick={playerDrawCard}>Draw</button>
      )}
      {isGameOver && <span>{stateOfGame}</span>}
    </div>
  );
}

export default App;
