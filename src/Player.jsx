import styled from "styled-components";

const StyledPlayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  --img-ratio: calc(500 / 726);
  --card-width: calc(100vw / 13);
  height: calc(var(--card-width) / var(--img-ratio));

  & .set {
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
border-width: ${(props) => (props.$isActive ? "1px" : "0px")};
border-style: solid;
border-color:red;

`;

export default function Player({ hand, score, isSpliting, activeSet }) {
  return (
    <StyledPlayer>
      {!isSpliting && (
        <>
          {hand.map((card) => (
            <StyledCard
              key={`${card.suitName} ${card.rank}`}
              $imgPath={card.img}
            ></StyledCard>
          ))}
          {score > 0 && <span>{score}</span>}
        </>
      )}
      {isSpliting && (
        <>
          {hand.map((set, index) => (
            <StyledSet
              key={set[0].suitName}
              className="set"
              $isActive={index === activeSet}
            >
              {set.map((card) => (
                <StyledCard
                  key={`${card.suitName} ${card.rank}`}
                  $imgPath={card.img}
                ></StyledCard>
              ))}
              {<span>{score[index]}</span>}
            </StyledSet>
          ))}
        </>
      )}
    </StyledPlayer>
  );
}
