"use client";

import { addVote } from "@/services/services";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

function BestGoalVoting({ bestGoal, goalVote }) {
  goalVote;
  const [voteState, voteFormAction] = useActionState(addVote, {});
  useEffect(() => {
    if (voteState) {
      voteState.message;
    }
  }, [voteState]);
  return (
    <div className="relative w-full border h-[80vh] rounded-lg translate-y-15 flex flex-col">
      <div className="grid grid-cols-5 bg-[#F2F2F2] rounded-lg mb-3 px-4  py-3 items-center">
        <h2 className="text-4xl font-bold">Player</h2>
        <span className="text-2xl text-center">Player Team</span>
        <span className="text-2xl text-center">No. Votes</span>
        <span className="text-2xl text-center "></span>

        <h2 className="text-4xl font-bold text-center w-[400px]">No.</h2>
      </div>

      {/* Rows */}
      <div className="flex-1 flex flex-col gap-8 px-4 overflow-y-auto">
        {bestGoal.map((award, index) => {
          return (
            <div
              key={award.id}
              className="grid grid-cols-5 items-center w-full"
            >
              {/* Player column */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handlePlayerClick(award)}
                >
                  <Image
                    src={
                      award.player?.player_image || "/football-svgrepo-com.svg"
                    }
                    alt="Player Image"
                    width={80}
                    height={80}
                    className="w-[80px] h-[80px] rounded-full"
                  />
                  <h3 className="text-3xl font-semibold">
                    {award.player?.full_name}
                  </h3>
                </div>
              </div>

              {/* Team Name */}
              <p className="text-xl text-center">{award.player?.team?.name}</p>

              {/* Number of Votes */}
              <p className="text-xl text-center">{award.no_of_votes || 0}</p>

              <div className="w-full flex items-center justify-center">
                {/* Vote Button */}
                <form action={voteFormAction}>
                  <input
                    type="hidden"
                    name="awardId"
                    value={award.id}
                    readOnly
                  />
                  <input
                    type="hidden"
                    name="prevVote"
                    value={goalVote[0]?.id}
                  />
                  <input
                    type="hidden"
                    name="prevAwardId"
                    value={goalVote[0]?.award_id}
                  />
                  <VoteButton awardId={award.id} goalVote={goalVote} />
                </form>
              </div>

              {/* Index */}
              <p
                className="text-4xl text-center w-[400px]"
                style={{
                  fontFamily: "var(--font-instrument-sans), sans-serif",
                }}
              >
                {index + 1}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VoteButton({ awardId, goalVote }) {
  const { pending } = useFormStatus();

  // Check if the user has already voted on this award
  const hasVoted = goalVote?.some((vote) => vote.award_id === awardId);
  const isDisabled = pending || hasVoted;

  hasVoted;
  return (
    <>
      <button
        disabled={isDisabled}
        className="flex items-center gap-2 bg-violet-normal hover:bg-violet-normal-hover text-white px-10 py-1 rounded-lg transition-colors w-fit disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image
          src="/VoteArrow.svg"
          alt="Vote"
          width={8}
          height={14}
          className="w-2 h-[14px]"
        />
        <span className="text-md font-semibold">
          {hasVoted ? "Voted" : pending ? "Voting..." : "Vote"}
        </span>
      </button>
    </>
  );
}

export default BestGoalVoting;
