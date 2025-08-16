import Link from "next/link";

function ManagePlayers({ players }) {
  return (
    <div>
      <h2>Manage Players</h2>
      <ul>
        {players.length === 0 ? (
          <li>No players found</li>
        ) : (
          players.map((player) => <li key={player.id}>{player.name}</li>)
        )}
      </ul>
      <Link href="/moderator/create-player">Create Player</Link>
    </div>
  );
}

export default ManagePlayers;
