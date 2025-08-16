import Link from "next/link";

function ManageTeams({ teams }) {
  return (
    <div>
      <h2>Manage Teams </h2>
      <ul>
        {teams.length === 0 ? (
          <li>No teams found</li>
        ) : (
          teams.map((team) => <li key={team.id}>{team.name}</li>)
        )}
      </ul>
      <Link href="/moderator/create-team">Create Team</Link>
    </div>
  );
}

export default ManageTeams;
