import Account from "@/components/Account";
import { getUser } from "@/services/server/services";
import { getUserData } from "@/services/services";

async function page() {
  const user = await getUser();
  const userData = await getUserData(user.id);
  return (
    <div className="w-full h-[90dvh] mt-20 flex items-center justify-center -translate-y-20">
      <Account userData={userData[0]} userId={user.id} />
    </div>
  );
}

export default page;
