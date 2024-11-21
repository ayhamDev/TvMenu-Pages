import EditPageButton from "@/components/EditPageButton";
import { IsAuthenticated } from "@/utils/IsAuthenticated";
import { cookies } from "next/headers";

export interface IClientPageProps {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata({ params }: IClientPageProps) {
  const props = await params;

  return {
    title: props.domain,
  };
}
const page = async ({ params }: IClientPageProps) => {
  const props = await params;
  const cookieStore = await cookies();
  const [user] = await IsAuthenticated(cookieStore);
  return (
    <div className="relative w-full h-screen">
      <h1>{props.domain} Web Page</h1>
      {user && <EditPageButton />}
    </div>
  );
};

export default page;
