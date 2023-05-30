import { useState } from "react";

export default function Bets({ bankRoll, chosenBet }) {
  const bets = [1, 5, 10, 50, 100, 500, 1000];

  const [currentBet, setCurrentBet] = useState(0);

  const [betsHistoric, setBetsHistoric] = useState([]);

  const onClickButton = (bet) => {
    setBetsHistoric((bets) => [...bets, currentBet]);
    setCurrentBet((v) => v + bet);
  };

  const revertBet = () => {
    const lastBet = betsHistoric[betsHistoric.length - 1];
    setCurrentBet(lastBet);
    setBetsHistoric((bets) => bets.filter((bet) => bet !== lastBet));
  };

  return (
    <div>
      <div>
        <button disabled={betsHistoric.length === 0} onClick={revertBet}>
          Revert
        </button>
        {bets.map((bet) => (
          <button
            key={bet}
            disabled={
              currentBet + bet > bankRoll ||
              currentBet === 1000 ||
              currentBet + bet > 1000
            }
            onClick={() => onClickButton(bet)}
          >
            {bet}
          </button>
        ))}
      </div>
      <div>{currentBet}</div>
      <button disabled={currentBet === 0} onClick={() => chosenBet(currentBet)}>
        OK
      </button>
    </div>
  );
}
