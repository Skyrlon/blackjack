import { useEffect, useState } from "react";
import "./App.css";
import Deck from "./Deck";
import Dealer from "./Dealer";
import Player from "./Player";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isPlayerStoppedDrawCards, setIsPlayerStoppedDrawCards] =
    useState(false);
  const [stateOfGame, setStateOfGame] = useState("");
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [cards, setCards] = useState([]);

  const getDeck = () => {
    return [
      ...setSuit("clubs"),
      ...setSuit("diamonds"),
      ...setSuit("hearts"),
      ...setSuit("spades"),
    ];
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
    const suffledDeck = getDeck()
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

  const startGame = () => {
    setIsGameStarted(true);
    drawFirstCards();
  };

  const restartGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
    setIsPlayerTurn(false);
    setIsPlayerStoppedDrawCards(false);
    setStateOfGame("");
    playerHand.length = 0;
    dealerHand.length = 0;
    cards.length = 0;
    drawFirstCards();
  };

  const playerDrawCard = () => {
    let newPlayerHand = [...playerHand];
    newPlayerHand.push(cards[0]);
    setPlayerHand([...newPlayerHand]);
    setCards(cards.slice(1));
  };

  const playerStand = () => {
    setIsPlayerTurn(false);
    setIsPlayerStoppedDrawCards(true);
    if (getHandScore(dealerHand) > getHandScore(playerHand)) {
      setIsGameOver(true);
      setStateOfGame("Loose");
    } else if (
      getHandScore(playerHand) === 21 &&
      playerHand.length === 2 &&
      getHandScore(dealerHand) === 21 &&
      dealerHand.length === 2
    ) {
      setIsGameOver(true);
      setStateOfGame("Black Jack");
    } else if (
      getHandScore(playerHand) === 21 &&
      playerHand.length === 2
      
    ) {
      setIsGameOver(true);
      setStateOfGame("Black Jack");
    } else {
      dealerDrawCards();
    }
  };

  const dealerDrawCards = () => {
    let newDealerHand = [...dealerHand];
    let i = 0;
    while (getHandScore(newDealerHand) < 17) {
      newDealerHand.push(cards[i]);
      i++;
    }
    setDealerHand([...newDealerHand]);
    setCards(cards.slice(i));
  };

  const drawFirstCards = () => {
    const suffledDeck = shuffleCards();
    const newDealerCards = [suffledDeck[0], suffledDeck[2]];
    const newPlayerCards = [suffledDeck[1], suffledDeck[3]];
    setDealerHand([...dealerHand, ...newDealerCards]);
    setPlayerHand([...playerHand, ...newPlayerCards]);
    setIsPlayerTurn(true);
    setCards(suffledDeck.slice(4));
  };

  useEffect(() => {
    if (getHandScore(playerHand) > 21) {
      setIsGameOver(true);
      setStateOfGame("Busted");
    }
  }, [playerHand]);

  return (
    <div className="App">
      <Dealer
        hand={dealerHand}
        score={getHandScore(dealerHand)}
        showSecondCard={isPlayerStoppedDrawCards}
      />
      <Deck />
      <Player hand={playerHand} score={getHandScore(playerHand)} />
      {!isGameStarted && <button onClick={startGame}>Start</button>}
      {isGameOver && <button onClick={restartGame}>Restart</button>}
      {isGameStarted && !isGameOver && isPlayerTurn && (
        <>
          <button onClick={playerDrawCard}>Draw</button>
          <button onClick={playerStand}>Stand</button>
        </>
      )}
      {isGameOver && <span>{stateOfGame}</span>}
    </div>
  );
}

export default App;
