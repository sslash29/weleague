import Image from "next/image";

function Player({ label }) {
  return (
    <div className="flex items-center justify-center flex-col ">
      <Image src="/player.png" alt="Player" width={100} height={100} />
      {label && <span className="text-md mr-2.5">{label}</span>}
    </div>
  );
}

export default Player;
