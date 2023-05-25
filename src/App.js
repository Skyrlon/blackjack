import { useEffect, useState } from "react";
import "./App.css";
import Deck from "./Deck";
import Dealer from "./Dealer";
import Player from "./Player";
import Bets from "./Bets";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isPlayerStoppedDrawCards, setIsPlayerStoppedDrawCards] =
    useState(false);
  const [stateOfGame, setStateOfGame] = useState("");
  const [maybeDealerGotBlackJack, setMaybeDealerGotBlackJack] = useState(false);
  const [isSpliting, setIsSpliting] = useState(false);
  const [activeSplittingSet, setActiveSplittingSet] = useState(0);

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

    const ranksValues = [
      { rank: "ace", value: 1 },
      { rank: "two", value: 2 },
      { rank: "three", value: 3 },
      { rank: "four", value: 4 },
      { rank: "five", value: 5 },
      { rank: "six", value: 6 },
      { rank: "seven", value: 7 },
      { rank: "eight", value: 8 },
      { rank: "nine", value: 9 },
      { rank: "ten", value: 10 },
      { rank: "jack", value: 10 },
      { rank: "queen", value: 10 },
      { rank: "king", value: 10 },
    ];

    ranksValues.forEach((x) =>
      suit.push({
        rank: x.rank,
        suitName,
        img: `/assets/${suitName}_${x.rank}.png`,
        value: x.value,
      })
    );
    return suit;
  };

  const shuffleCards = () => {
    let suffledDeck = getDeck()
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    const valueOfPairs = 10;
    const pairsCards = suffledDeck
      .filter((card) => card.value === valueOfPairs)
      .slice(0, 2);
    suffledDeck = suffledDeck.filter(
      (card) =>
        !pairsCards.some(
          (x) => card.rank === x.rank && card.suitName === x.suitName
        )
    );
    suffledDeck.splice(0, 0, pairsCards[0]);
    suffledDeck.splice(2, 0, pairsCards[1]);
    return suffledDeck;
  };

  const getHandScore = (hand) => {
    let scoreWithoutAces = hand
      .filter((card) => card.rank !== "ace")
      .reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.value),
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
    if (isSpliting) {
      newPlayerHand[activeSplittingSet].push(cards[0]);
    } else {
      newPlayerHand.push(cards[0]);
    }
    setPlayerHand([...newPlayerHand]);
    setCards(cards.slice(1));
    if (getHandScore(newPlayerHand) > 21) {
      setIsGameOver(true);
      setStateOfGame("Busted");
    }
    if (
      isSpliting &&
      activeSplittingSet === 0 &&
      getHandScore(newPlayerHand[activeSplittingSet]) > 21
    ) {
      setActiveSplittingSet(1);
    }
    if (
      isSpliting &&
      activeSplittingSet === 1 &&
      getHandScore(newPlayerHand[activeSplittingSet]) > 21
    ) {
      if (getHandScore(newPlayerHand[0]) > 21) {
        setIsGameOver(true);
        setStateOfGame("Busted");
      } else {
        dealerDrawCards();
      }
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
    if (isSpliting && activeSplittingSet === 0) {
      setActiveSplittingSet(1);
    } else if (getHandScore(dealerHand) > getHandScore(playerHand)) {
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
    setIsGameOver(true);
    if (getHandScore(newDealerHand) > 21) {
      setStateOfGame("Win");
    } else if (getHandScore(newDealerHand) > getHandScore(playerHand)) {
      setStateOfGame("Loose");
    } else if (getHandScore(newDealerHand) === getHandScore(playerHand)) {
      setStateOfGame("Push");
    } else if (getHandScore(newDealerHand) < getHandScore(playerHand)) {
      setStateOfGame("Win");
    }
    setDealerHand([...newDealerHand]);
    setCards(cards.slice(i));
  };

  const drawFirstCards = () => {
    const suffledDeck = shuffleCards();
    const newDealerCards = [suffledDeck[1], suffledDeck[3]];
    const newPlayerCards = [suffledDeck[0], suffledDeck[2]];
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
    setMaybeDealerGotBlackJack(false);
  };

  const canPlayerSplit = () => {
    if (!isSpliting) {
      return (
        playerHand.length === 2 && playerHand[0].value === playerHand[1].value
      );
    } else {
      return true;
    }
  };

  const playerSplit = () => {
    setIsSpliting(true);
    setBankRoll(bankRoll - currentBet);
    setActiveSplittingSet(0);
    const firstSet = [playerHand[0], cards[0]];
    const secondSet = [playerHand[1], cards[1]];
    setPlayerHand([firstSet, secondSet]);
    setCards(cards.slice(2));
  };

  useEffect(
    () => {
      if (isSpliting) {
        const numberOfWinSets = playerHand.filter(
          (set) =>
            (getHandScore(set) > getHandScore(dealerHand) &&
              getHandScore(set) < 22) ||
            (getHandScore(dealerHand) > 21 && getHandScore(set) < 22)
        ).length;

        const numberOfDrawSets = playerHand.filter(
          (set) =>
            getHandScore(set) === getHandScore(dealerHand) &&
            getHandScore(set) < 22
        ).length;

        setBankRoll(
          bankRoll + currentBet * (numberOfWinSets * 2 + numberOfDrawSets)
        );
      } else if (stateOfGame === "Win") {
        setBankRoll(bankRoll + currentBet * 2);
      } else if (stateOfGame === "Busted" || stateOfGame === "Loose") {
        return;
      } else if (stateOfGame === "Push") {
        setBankRoll(bankRoll + currentBet);
      } else if (stateOfGame === "Black Jack") {
        setBankRoll(bankRoll + currentBet * 2.5);
      }
    },
    // eslint-disable-next-line
    [isGameOver]
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
        currentBet={currentBet}
        score={
          isSpliting
            ? [getHandScore(playerHand[0]), getHandScore(playerHand[1])]
            : getHandScore(playerHand)
        }
        activeSet={activeSplittingSet}
      />
      {(!isGameStarted || isGameOver) && <Bets chosenBet={handleBetChosen} />}
      {isGameStarted && !isGameOver && isPlayerTurn && (
        <>
          {!maybeDealerGotBlackJack && (
            <>
              <button onClick={playerDrawCard}>Draw</button>
              <button onClick={playerStand}>Stand</button>
              {!isSpliting && (
                <button onClick={playerDoubleDown}>Double Down</button>
              )}
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
          {!maybeDealerGotBlackJack && canPlayerSplit() && !isSpliting && (
            <button onClick={playerSplit}>Split</button>
          )}
        </>
      )}
      {isGameOver && <span>{stateOfGame}</span>}
    </div>
  );
}

export default App;
