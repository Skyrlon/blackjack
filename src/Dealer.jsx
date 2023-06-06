import styled from "styled-components";

const StyledDealer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  --img-ratio: calc(500 / 726);
  --card-width: calc(100vw / 13);
  height: calc(var(--card-width) / var(--img-ratio));

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
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.$imgPath});
`;

export default function Dealer({ hand, score, showSecondCard }) {
  const backCardPath = "/assets/card_back.png";

  return (
    <StyledDealer>
      {score > 0 && showSecondCard && <span>{score}</span>}
      <div className="cards">
        {hand.map((card, index) => (
          <StyledCard
            key={`${card.suitName} ${card.rank}`}
            $imgPath={!showSecondCard && index === 1 ? backCardPath : card.img}
          ></StyledCard>
        ))}
      </div>
    </StyledDealer>
  );
}
