import styled from "styled-components";

const StyledPlayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  --img-ratio: calc(500 / 726);
  --card-width: calc(100vw / 13);
  height: calc(var(--card-width) / var(--img-ratio));

  & .bet {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border: 1px solid black;
    border-radius: 100%;
  }

  & .cards {
    display: flex;
    flex-direction: row;
  }
`;

const StyledCard = styled.div`
  --img-ratio: calc(500 / 726);
  --card-width: calc(100vw / 13);
  width: var(--card-width);
  height: calc(var(--card-width) / var(--img-ratio));
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.$imgPath});
`;

const StyledSet = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & .score {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-width: ${(props) => (props.$isActive ? "1px" : "0px")};
    border-style: solid;
    border-color: red;
    border-radius: 100%;
  }
`;

export default function Player({
  hand,
  currentBet,
  score,
  isSpliting,
  activeSet,
}) {
  return (
    <StyledPlayer>
      {!isSpliting && (
        <StyledSet>
          {score > 0 && <span className="score">{score}</span>}
          <div className="cards">
            {hand.map((card) => (
              <StyledCard
                key={`${card.suitName} ${card.rank}`}
                $imgPath={card.img}
              />
            ))}
          </div>
          {currentBet > 0 && <span className="bet">{currentBet}</span>}
        </StyledSet>
      )}
      {isSpliting && (
        <>
          {hand.map((set, index) => (
            <StyledSet key={set[0].suitName} $isActive={index === activeSet}>
              {<span className="score">{score[index]}</span>}
              <div className="cards">
                {set.map((card) => (
                  <StyledCard
                    key={`${card.suitName} ${card.rank}`}
                    $imgPath={card.img}
                  />
                ))}
              </div>
              {currentBet > 0 && <span className="bet">{currentBet}</span>}
            </StyledSet>
          ))}
        </>
      )}
    </StyledPlayer>
  );
}
