export default function Bets({ chosenBet }) {
  const bets = [1, 5, 10, 50, 100, 500, 1000];

  return (
    <div>
      {bets.map((bet) => (
        <button key={bet} onClick={() => chosenBet(bet)}>
          {bet}
        </button>
      ))}
    </div>
  );
}
