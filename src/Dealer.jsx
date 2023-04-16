import styled from "styled-components";

const StyledDealer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  --img-ratio: calc(500 / 726);
  --card-width: calc(100vw / 13);
  height: calc(var(--card-width) / var(--img-ratio));
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

export default function Dealer({ hand, score, showSecondCard }) {
  const backCardPath = "/assets/card_back.png";

  return (
    <StyledDealer>
      {hand.map((card, index) => (
        <StyledCard
          key={`${card.suitName} ${card.rank}`}
          $imgPath={!showSecondCard && index === 1 ? backCardPath : card.img}
        ></StyledCard>
      ))}
      {score > 0 && showSecondCard && <span>{score}</span>}
    </StyledDealer>
  );
}
