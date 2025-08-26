import BestGoalVoting from "@/components/Voting/BestGoalVoting";
import { getBestAwards } from "@/services/services";

async function page() {
  const { bestGoal } = await getBestAwards();
  return (
    <div>
      <BestGoalVoting bestGoal={bestGoal} />
    </div>
  );
}

export default page;
