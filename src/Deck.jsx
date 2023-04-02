import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledDeck = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

const StyledCard = styled.div`
  --img-ratio: calc(500 / 726);
  --card-width: calc(100vw / 13);
  width: var(--card-width);
  height: calc(var(--card-width) / var(--img-ratio));
  background-image: url(${(props) => props.imgPath});
  background-size: contain;
  background-repeat: no-repeat;
`;

export default function Deck() {
  const [cards, setCards] = useState([]);

  const setDeck = () => {
    setCards([
      ...setSuit("clubs"),
      ...setSuit("diamonds"),
      ...setSuit("hearts"),
      ...setSuit("spades"),
    ]);
  };

  const setSuit = (suitName) => {
    let suit = [];
    const ranks = [
      "ace",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "jack",
      "queen",
      "king",
    ];

    ranks.forEach((rank) =>
      suit.push({
        rank,
        suitName,
        img: `/assets/${suitName}_${rank}.png`,
      })
    );
    return suit;
  };

  const shuffleCards = () => {
    const suffledDeck = cards
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    setCards(suffledDeck);
  };

  useEffect(
    () => {
      setDeck();
    },
    // eslint-disable-next-line
    []
  );

  return (
    <StyledDeck>
      {cards.length > 1 &&
        cards.map((card) => (
          <StyledCard
            key={`${card.suitName} ${card.rank}`}
            imgPath={card.img}
          />
        ))}
      <StyledCard imgPath={`/assets/card_back.png`} />
      <button onClick={shuffleCards}>SHUFFLE</button>
    </StyledDeck>
  );
}
