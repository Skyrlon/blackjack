import { useEffect, useState } from "react";

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
        img: `/src/assets/${suitName}_${rank}.png`,
      })
    );
    return suit;
  };

  useEffect(() => {
    setDeck();
  }, []);

  return (
    <div>
      {cards.length > 1 &&
        cards.map((card) => (
          <img
            key={`${card.suitName} ${card.rank}`}
            alt="card"
            src={card.img}
          />
        ))}
    </div>
  );
}
