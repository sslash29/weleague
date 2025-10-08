"use client";

import { deleteTeam } from "@/services/moderatorServices";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

function TeamDisplayer({ team, onDelete }) {
  function handleDelete(formData) {
    onDelete(team);
    startTransition(async () => {
      await deleteTeam({}, formData);
    });
  }
  console.log(team);
  const router = useRouter();
  return (
    <div className="flex flex-col border p-3 w-[calc(1260px/3)] gap-10 rounded-lg h-fit ">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-1 items-center">
          <Image
            src={
              team?.team_img &&
              typeof team.team_img === "string" &&
              team.team_img.trim() !== ""
                ? team.team_img
                : "/football-svgrepo-com.svg"
            }
            alt={team?.name ? `${team.name} logo` : "team-img"}
            width={80}
            height={80}
            className="rounded-full w-[80px] h-[80px] object-cover"
          />

          <h4 className="text-2xl font-semibold">{team.name}</h4>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-lg">class: {team.class || "2/2"}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/teams/${team.id}`)}
            className="px-4 py-2 text-white rounded-md bg-[#333333] font-semibold hover:bg-violet-normal-hover transition-all cursor-pointer hover:scale-90 "
          >
            View Team
          </button>
          <form action={handleDelete}>
            <input type="hidden" name="teamId" value={team.id} />
            <button className="font-semibold px-4 py-2 text-white rounded-md bg-red-normal hover:bg-red-normal-hover transition-all cursor-pointer hover:scale-90">
              Delete Team
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeamDisplayer;
