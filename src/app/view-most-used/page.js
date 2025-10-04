import { viewMostUsedPlayer } from "@/services/rootAdminService";

async function page() {
  const mostUsed = await viewMostUsedPlayer();
  console.log(mostUsed);
  return <div></div>;
}

export default page;
