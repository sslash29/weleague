import RulesPointsEditor from "@/components/Admin/RulePointEditor";
import { getRulePoints } from "@/services/rootAdminService";

async function page() {
  const rules = await getRulePoints();
  return (
    <div>
      <RulesPointsEditor rules={rules} />
    </div>
  );
}

export default page;
