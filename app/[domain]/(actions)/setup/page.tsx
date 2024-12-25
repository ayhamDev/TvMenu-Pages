import { GetSession } from "@/utils/GetSession";
import { IsPageOwner } from "@/utils/IsPageOwner";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IClientPageProps } from "../../(page)/page";

export async function generateMetadata({ params }: IClientPageProps) {
  const props = await params;

  return {
    title: `Create ${props.domain}`,
  };
}

const page = async ({ params }: IClientPageProps) => {
  const props = await params;

  // Session Means The User Has a Refresh Token HttpOnly Cookie.
  const cookieStore = await cookies();
  const user = await GetSession(cookieStore);

  // if There Was No Cookie Or Session Redirect to client page to authentiacte
  if (!user) return redirect(`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/client`);

  // The Page Owner else redirect to the /
  const IsOwenr = await IsPageOwner(user, props.domain);
  if (!IsOwenr) return redirect("/");

  return <div></div>;
};

export default page;
