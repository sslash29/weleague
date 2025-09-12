import Account from "@/components/Account";
import { getUser } from "@/services/server/services";
import { getUserData } from "@/services/services";

async function page() {
  const user = await getUser();
  console.log(user);
  const userData = await getUserData(user.id);
  return (
    <div className="w-full h-dvh flex items-center justify-center -translate-y-20">
      <Account userData={userData[0]} />
    </div>
  );
}

export default page;
