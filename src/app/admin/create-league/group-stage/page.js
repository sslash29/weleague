import GroupStage from "@/components/league/GroupStage";
import { createGroupStage } from "@/services/services";

async function page() {
  const groupStage = await createGroupStage();
  return (
    <div>
      <GroupStage groupStage={groupStage} />
    </div>
  );
}

export default page;
