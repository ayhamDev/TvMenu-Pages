import EditPageButton from "@/components/custom/EditPageButton";
import RenderCode from "@/components/custom/RenderCode";
import RenderPage from "@/components/custom/RenderPage";
import { siteConfig } from "@/config/site";
import { IClientPageProps } from "@/interface/ClientPageProps.interface";
import { IPage } from "@/interface/Page.interface";
import { CleanPromise } from "@/utils/CleanPromise";
import { GetSession } from "@/utils/GetSession";
import { IsPageOwner } from "@/utils/IsPageOwner";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";

const GetPublished = async (domain: string) => {
  return await CleanPromise(
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/${domain}/publish`)
  );
};

export async function generateMetadata({
  params,
}: IClientPageProps): Promise<Metadata> {
  const props = await params;

  const [res, error] = await GetPublished(props.domain);
  if (error || !res || res?.status != 200) {
    return {
      title: props.domain,
      description: siteConfig.description,
      icons: {
        icon: "/s.png",
      },
    };
  } else {
    const data = await res?.json();

    return {
      title: {
        default: data.meta?.title || props.domain,
        template: `%s | ${data.meta?.title || props.domain}`,
      },
      description: data.meta?.description,
      icons: {
        icon: data.meta?.faviconId
          ? `${process.env.NEXT_PUBLIC_API_URL}/media/${data.meta.faviconId}/file`
          : data.meta?.faviconUrl || "",
      },
    };
  }
}
const page = async ({ params }: IClientPageProps) => {
  // Getting The User To Check If He Has Ownership Over The Webpage
  const props = await params;
  const cookieStore = await cookies();
  const user = await GetSession(cookieStore);
  const header = await headers();
  const IsOwenr = await IsPageOwner(user, props.domain);
  const [res, error] = await GetPublished(props.domain);
  const page = (await res?.json()) as Partial<IPage>;
  const requestUrl = new URL(header.get("X-Url") || "");

  if (error || !res || res.status != 200) return notFound();
  if (!page.public && !IsOwenr) return notFound();

  if (!page.themeId?.includes("@") && requestUrl.pathname !== "/")
    return notFound();
  return (
    <div className="relative w-full h-screen">
      <RenderPage page={page} />
      {IsOwenr && <EditPageButton />}
    </div>
  );
};

export default page;
