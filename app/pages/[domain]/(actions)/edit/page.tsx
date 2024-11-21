import PageEditor from "@/components/other/PageEditor";
import { HasSession } from "@/utils/HasSession";
import { IsPageOwner } from "@/utils/IsPageOwner";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { IClientPageProps } from "../../page";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: IClientPageProps): Promise<Metadata> {
  const props = await params;

  return {
    title: `Edit ${props.domain}`,
  };
}

const page = async ({ params }: IClientPageProps) => {
  const props = await params;
  // Session Means The User Has a Refresh Token HttpOnly Cookie.
  const cookieStore = await cookies();
  const user = await HasSession(cookieStore);

  // if There Was No Cookie Or Session Redirect to client page to authentiacte
  if (!user) return redirect(`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/client`);

  // The Page Owner else redirect to the /
  const IsOwenr = await IsPageOwner(user, props.domain);
  if (!IsOwenr) return redirect("/");

  console.log(user.id);
  return <PageEditor user={user} />;
};

export default page;
