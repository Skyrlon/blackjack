import { useEffect, useState } from "react";
import "./App.css";
import Deck from "./Deck";
import Dealer from "./Dealer";
import Player from "./Player";
import Bets from "./Bets";

function App() {
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

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isPlayerStoppedDrawCards, setIsPlayerStoppedDrawCards] =
    useState(false);
  const [stateOfGame, setStateOfGame] = useState("");
  const [maybeDealerGotBlackJack, setMaybeDealerGotBlackJack] = useState(false);
  const [isSpliting, setIsSpliting] = useState(false);

  const [bankRoll, setBankRoll] = useState(1000);
  const [currentBet, setCurrentBet] = useState(undefined);

  const [cards, setCards] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);

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
    let scoreWithoutAces = hand
      .filter((card) => card.rank !== "ace")
      .reduce(
        (accumulator, currentValue) =>
          accumulator +
          Number(
            ranksValues.find((x) => x.ranks.includes(currentValue.rank)).value
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

  const playerDrawCard = () => {
    let newPlayerHand = [...playerHand];
    newPlayerHand.push(cards[0]);
    setPlayerHand([...newPlayerHand]);
    setCards(cards.slice(1));
    if (getHandScore(newPlayerHand) > 21) {
      setIsGameOver(true);
      setStateOfGame("Busted");
    }
  };

  const playerDoubleDown = () => {
    setBankRoll(bankRoll - currentBet);
    setCurrentBet(currentBet * 2);
    let newPlayerHand = [...playerHand];
    newPlayerHand.push(cards[0]);
    setPlayerHand([...newPlayerHand]);
    setCards(cards.slice(1));
    if (getHandScore(newPlayerHand) > 21) {
      setIsGameOver(true);
      setStateOfGame("Busted");
    } else {
      dealerDrawCards();
    }
  };

  const playerStand = () => {
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
    } else if (getHandScore(playerHand) === 21 && playerHand.length === 2) {
      setIsGameOver(true);
      setStateOfGame("Black Jack");
    } else {
      dealerDrawCards();
    }
  };

  const dealerDrawCards = () => {
    setIsPlayerTurn(false);
    setIsPlayerStoppedDrawCards(true);
    let newDealerHand = [...dealerHand];
    let i = 0;
    while (getHandScore(newDealerHand) < 17) {
      newDealerHand.push(cards[i]);
      i++;
    }
    if (getHandScore(newDealerHand) > 21) {
      setIsGameOver(true);
      setStateOfGame("Win");
    } else if (getHandScore(newDealerHand) > getHandScore(playerHand)) {
      setIsGameOver(true);
      setStateOfGame("Loose");
    } else if (getHandScore(newDealerHand) === getHandScore(playerHand)) {
      setIsGameOver(true);
      setStateOfGame("Push");
    } else if (getHandScore(newDealerHand) < getHandScore(playerHand)) {
      setIsGameOver(true);
      setStateOfGame("Win");
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
    setMaybeDealerGotBlackJack(newDealerCards[0].rank === "ace");
    setCards(suffledDeck.slice(4));
  };

  const handleBetChosen = (bet) => {
    setCurrentBet(bet);
    setBankRoll(bankRoll - bet);
    setIsGameStarted(true);
    setIsGameOver(false);
    setIsPlayerTurn(false);
    setIsPlayerStoppedDrawCards(false);
    setIsSpliting(false);
    setStateOfGame("");
    playerHand.length = 0;
    dealerHand.length = 0;
    cards.length = 0;
    drawFirstCards();
  };

  const playerTakeAssurance = (takingAssurance) => {
    if (takingAssurance) {
      const insurance = currentBet / 2;
      if (getHandScore(dealerHand) === 21 && getHandScore(playerHand) !== 21) {
        isGameOver(true);
        setStateOfGame("Get double of your insurance");
        setBankRoll(bankRoll + insurance * 2);
      } else if (
        getHandScore(dealerHand) === 21 &&
        getHandScore(playerHand) === 21
      ) {
        isGameOver(true);
        setStateOfGame("Get double of your insurance and your bet back");
        setBankRoll(bankRoll + insurance * 2 + currentBet);
      } else {
        setIsPlayerTurn(true);
        setBankRoll(bankRoll - insurance);
      }
    } else {
      if (getHandScore(dealerHand) === 21 && getHandScore(playerHand) !== 21) {
        isGameOver(true);
        setStateOfGame("Loose");
      } else if (
        getHandScore(dealerHand) === 21 &&
        getHandScore(playerHand) === 21
      ) {
        isGameOver(true);
        setStateOfGame("Push");
      } else {
        setIsPlayerTurn(true);
      }
    }
    maybeDealerGotBlackJack(false);
  };

  const canPlayerSplit = () => {
    if (!isSpliting) {
      const firstCardValue =
        playerHand[0].rank === "ace"
          ? 1
          : ranksValues.find((x) => x.ranks.includes(playerHand[0].rank)).value;
      const secondCardValue =
        playerHand[1].rank === "ace"
          ? 1
          : ranksValues.find((x) => x.ranks.includes(playerHand[1].rank)).value;
      return playerHand.length === 2 && firstCardValue === secondCardValue;
    } else {
      return true;
    }
  };

  const playerSplit = () => {
    setIsSpliting(true);
    const firstSet = [playerHand[0], cards[0]];
    const secondSet = [playerHand[1], cards[1]];
    setPlayerHand([firstSet, secondSet]);
    setCards(cards.slice(2));
  };

  useEffect(
    () => {
      if (stateOfGame === "Win") {
        setBankRoll(bankRoll + currentBet * 2);
      }
      if (stateOfGame === "Busted" || stateOfGame === "Loose") {
        return;
      }
      if (stateOfGame === "Push") {
        setBankRoll(bankRoll + currentBet);
      }
      if (stateOfGame === "Black Jack") {
        setBankRoll(bankRoll + currentBet * 2.5);
      }
    },
    // eslint-disable-next-line
    [stateOfGame]
  );

  return (
    <div className="App">
      <div>{bankRoll}</div>
      <Dealer
        hand={dealerHand}
        score={getHandScore(dealerHand)}
        showSecondCard={isPlayerStoppedDrawCards}
      />
      <Deck />
      <Player
        isSpliting={isSpliting}
        hand={playerHand}
        score={
          isSpliting
            ? [getHandScore(playerHand[0]), getHandScore(playerHand[1])]
            : getHandScore(playerHand)
        }
      />
      {(!isGameStarted || isGameOver) && <Bets chosenBet={handleBetChosen} />}
      {isGameStarted && !isGameOver && isPlayerTurn && (
        <>
          {!maybeDealerGotBlackJack && (
            <>
              <button onClick={playerDrawCard}>Draw</button>
              <button onClick={playerStand}>Stand</button>
              <button onClick={playerDoubleDown}>Double Down</button>
            </>
          )}
          {maybeDealerGotBlackJack && (
            <>
              <button onClick={() => playerTakeAssurance(true)}>
                Assurance
              </button>
              <button onClick={() => playerTakeAssurance(false)}>
                No assurance
              </button>
            </>
          )}
          {canPlayerSplit() && !isSpliting && (
            <button onClick={playerSplit}>Split</button>
          )}
        </>
      )}
      {isGameOver && <span>{stateOfGame}</span>}
    </div>
  );
}

export default App;
