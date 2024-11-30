import EditPageButton from "@/components/other/EditPageButton";
import { HasSession } from "@/utils/HasSession";
import { IsPageOwner } from "@/utils/IsPageOwner";
import { Metadata } from "next";
import { cookies } from "next/headers";

export interface IClientPageProps {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata({
  params,
}: IClientPageProps): Promise<Metadata> {
  const props = await params;

  return {
    title: props.domain,
  };
}
const page = async ({ params }: IClientPageProps) => {
  // Getting The User To Check If He Has Ownership Over The Webpage
  const props = await params;
  const cookieStore = await cookies();
  const user = await HasSession(cookieStore);
  const IsOwenr = await IsPageOwner(user, props.domain);

  return (
    <div className="relative w-full h-screen">
      <h1>{props.domain} Web Page</h1>
      {IsOwenr && <EditPageButton />}
    </div>
  );
};

export default page;
