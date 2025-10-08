import EditPlayerPrice from "@/components/EditPlayerPriceForm";
import { getAllPlayers } from "@/services/moderatorServices";

async function page() {
  const players = await getAllPlayers();
  console.log(players);
  return (
    <div className="flex items-center h-dvh justify-center ">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-5xl font-bold w-[300px]">Edit Player Price</h2>
        <EditPlayerPrice players={players} />
      </div>
    </div>
  );
}

export default page;
