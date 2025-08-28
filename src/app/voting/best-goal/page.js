import BestGoalVoting from "@/components/Voting/BestGoalVoting";
import { getUser } from "@/services/server/services";
import { getBestAwards, getVote } from "@/services/services";

async function page() {
  const { bestGoal } = await getBestAwards();
  const user = await getUser();
  const { bestGoals: goalVote } = await getVote(user.id);
  console.log(goalVote);

  return (
    <div>
      <BestGoalVoting bestGoal={bestGoal} goalVote={goalVote} />
    </div>
  );
}

export default page;
