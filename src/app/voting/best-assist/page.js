import BestAssistVoting from "@/components/Voting/BestAssistVoting";
import { getUser } from "@/services/server/services";
import { getBestAwards, getVote } from "@/services/services";

async function page() {
  const { bestAssist } = await getBestAwards();
  const user = await getUser();
  const { bestAssists: assistVote } = await getVote(user.id);
  return (
    <div>
      <BestAssistVoting bestAssist={bestAssist} assistVote={assistVote} />
    </div>
  );
}

export default page;
