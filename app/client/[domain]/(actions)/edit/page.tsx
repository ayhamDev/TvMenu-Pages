import PageEditor from "@/components/PageEditor";
import { IsAuthenticated } from "@/utils/IsAuthenticated";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IClientPageProps } from "../../page";

export async function generateMetadata({ params }: IClientPageProps) {
  const props = await params;

  return {
    title: `Edit ${props.domain}`,
  };
}

const page = async () => {
  const cookieStore = await cookies();
  const [user, error] = await IsAuthenticated(cookieStore);
  const dashboard_url = process.env.NEXT_PUBLIC_DASHBOARD_URL as string;
  if (error || !user) return redirect(`${dashboard_url}/client`);

  return <PageEditor user={user} />;
};

export default page;
