import BestAssistVoting from "@/components/Voting/BestAssistVoting";
import { getBestAwards } from "@/services/services";

async function page() {
  const { bestAssist } = await getBestAwards();
  return (
    <div>
      <BestAssistVoting bestAssist={bestAssist} />
    </div>
  );
}

export default page;
