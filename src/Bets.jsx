import { useState } from "react";

export default function Bets({ chosenBet }) {
  const bets = [1, 5, 10, 50, 100, 500, 1000];

  const [currentBet, setCurrentBet] = useState(0);

  const onClickButton = (bet) => {
    setCurrentBet((v) => v + bet);
  };

  return (
    <div>
      <div>
        {bets.map((bet) => (
          <button key={bet} onClick={() => onClickButton(bet)}>
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
