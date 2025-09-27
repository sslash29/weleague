"use client";
import { addLeagueData, addMatchDate } from "@/services/services";
import { useActionState, useEffect, useState } from "react";
import MatchItem from "./MatchItem";
import { supabase } from "@/utils/supabase/client";

export default function GroupStage({ groupStage }) {
  const { gameweeks } = groupStage;
  const [approveLeagueState, approveLeagueAction] = useActionState(
    addLeagueData,
    {}
  );
  const [addMatchDateState, addMatchDateAction] = useActionState(
    addMatchDate,
    {}
  );
  const [match, setMatch] = useState(groupStage);
  console.dir(match, { depth: 5 });

  // Helper function to merge database matches with gameweek structure
  const mergeMatchesWithDatabase = (originalGameweeks, databaseMatches) => {
    return originalGameweeks.map((gameweek) => ({
      ...gameweek,
      matches: gameweek.matches.map((originalMatch) => {
        // Find the corresponding database match
        const dbMatch = databaseMatches.find(
          (dbM) =>
            dbM.team1 === originalMatch.home.id &&
            dbM.team2 === originalMatch.away.id &&
            dbM.stage === originalMatch.group
        );

        return {
          ...originalMatch,
          // Add database ID and any other database fields
          database_id: dbMatch?.id,
          match_date: dbMatch?.match_date,
          gameweek_id: dbMatch?.gameweek_id,
          // Keep all original structure (home, away, group, etc.)
        };
      }),
    }));
  };

  useEffect(() => {
    const channel = supabase
      .channel("user-table-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match",
        },
        async () => {
          const { data, error } = await supabase.from("match").select("*");
          if (error) throw new Error(error.message);

          console.log("Original match structure:", match);
          console.log("Database matches:", data);

          // Update the match state while preserving structure
          setMatch((prevMatch) => ({
            ...prevMatch,
            gameweeks: mergeMatchesWithDatabase(prevMatch.gameweeks, data),
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Add empty dependency array to prevent infinite re-renders

  return (
    <div className="p-6 space-y-8">
      {match.gameweeks?.map((gw) => (
        <div
          key={gw.gameweek}
          className="border rounded-2xl shadow-md p-4 bg-white"
        >
          <h2 className="text-xl font-bold mb-4">Gameweek {gw.gameweek}</h2>
          <div className="space-y-4">
            {gw.matches.map((matchItem, i) => (
              <MatchItem
                key={`${matchItem.database_id || matchItem.id}-${i}`}
                match={matchItem}
                addMatchDateAction={addMatchDateAction}
              />
            ))}
          </div>
        </div>
      ))}
      <form>
        <input
          type="hidden"
          value={JSON.stringify(groupStage)}
          name="groupStage"
        />
        <button
          className="cursor-pointer hover:scale-110"
          formAction={approveLeagueAction}
          type="submit"
        >
          Approve
        </button>
      </form>
      {/* Show error or success messages */}
      {approveLeagueState.error ||
        (approveLeagueState.success === false && (
          <div className="text-red-500 p-2 bg-red-50 rounded">
            Error: {approveLeagueState.error || approveLeagueState.message}
          </div>
        ))}
      {approveLeagueState.success && (
        <div className="text-green-500 p-2 bg-green-50 rounded">
          {approveLeagueState.message}
        </div>
      )}
    </div>
  );
}
