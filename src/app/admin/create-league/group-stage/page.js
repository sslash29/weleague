import GroupStage from "@/components/GroupStage";
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
