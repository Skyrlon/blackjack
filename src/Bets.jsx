import { useState } from "react";
import styled from "styled-components";

const StyledBets = styled.dialog`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  box-sizing: border-box;
  width: 25rem;
  height: 15rem;
  & .text {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    & span {
      padding-bottom: 1rem;
    }
  }
`;

export default function Bets({
  bankRoll,
  chosenBet,
  children,
  refillBankroll,
}) {
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
    <StyledBets open>
      <div className="text">{children}</div>
      {bankRoll > 0 && (
        <>
          <div>
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
          <span>Your current bet : {currentBet}</span>
          <div>
            <button
              disabled={currentBet === 0}
              onClick={() => chosenBet(currentBet)}
            >
              OK
            </button>
            <button disabled={betsHistoric.length === 0} onClick={revertBet}>
              Revert
            </button>
          </div>
        </>
      )}
      {bankRoll === 0 && (
        <>
          <span>Run off money</span>
          <button onClick={refillBankroll}>Refill</button>
        </>
      )}
    </StyledBets>
  );
}
