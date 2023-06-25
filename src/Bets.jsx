import { useState } from "react";
import styled from "styled-components";
import CustomModal from "./CustomModal";

const StyledBets = styled(CustomModal)`
  & .text {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    & span {
      padding-bottom: 1rem;
    }
  }

  & .button-bet {
    position: relative;
    width: 4rem;
    height: 4rem;
    border: 0px;
    background-color: transparent;

    & img {
      width: 100%;
    }
  }

  & .button-text {
    position: absolute;
    top: 50%;
    left: 50%;
    font-weight: bold;
    color: white;
    transform: translate(-50%, -50%);
  }
`;

export default function Bets({
  bankRoll,
  chosenBet,
  children,
  refillBankroll,
}) {
  const bets = [
    { value: 1, color: "brown" },
    { value: 5, color: "red" },
    { value: 10, color: "blue" },
    { value: 50, color: "green" },
    { value: 100, color: "black" },
    { value: 500, color: "purple" },
    { value: 1000, color: "orange" },
  ];

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
    <StyledBets>
      <div className="text">{children}</div>
      {bankRoll > 0 && (
        <>
          <span>Place your bet : </span>
          <div>
            {bets.map(
              (bet) =>
                !(
                  currentBet + bet.value > bankRoll ||
                  currentBet === 1000 ||
                  currentBet + bet.value > 1000
                ) && (
                  <button
                    className="button-bet"
                    key={bet.value}
                    onClick={() => onClickButton(bet.value)}
                  >
                    <img src={`/assets/token_${bet.color}.png`} alt="token" />
                    <span className="button-text">{bet.value}</span>
                  </button>
                )
            )}
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
