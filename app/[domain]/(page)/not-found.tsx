import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Home } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function NotFound() {
  const header = await headers();
  const requestUrl = new URL(header.get("X-Url") || "");
  return (
    <div className="flex items-center justify-center min-h-screen bg-offbackground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">404</CardTitle>
          <CardDescription className="text-xl text-center">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="w-full flex flex-row gap-4">
          {requestUrl.pathname.includes("/edit") && (
            <Button className="w-full" variant={"secondary"} asChild>
              <Link href="/edit/menu">
                <Edit /> Return To Edit
              </Link>
            </Button>
          )}
          {requestUrl.pathname !== "/" && (
            <Button className="w-full" asChild>
              <Link href="/">
                <Home /> Return To Home
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
