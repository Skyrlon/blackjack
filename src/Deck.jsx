import styled from "styled-components";

const StyledDeck = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const StyledCard = styled.div`
  --img-ratio: calc(500 / 726);
  --card-width: calc(100vw / 13);
  width: var(--card-width);
  height: calc(var(--card-width) / var(--img-ratio));
  background-image: url("/assets/card_back.png");
  background-size: contain;
  background-repeat: no-repeat;
`;

export default function Deck() {
  return (
    <StyledDeck>
      <StyledCard />
    </StyledDeck>
  );
}
