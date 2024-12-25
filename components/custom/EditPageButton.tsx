import React from "react";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

const EditPageButton = () => {
  return (
    <Link
      className="dark absolute top-[10%] right-[-75px] opacity-50 hover:right-0 hover:opacity-100  hover:shadow-md transition-all duration-200 ease-out z-[100000]"
      href={"/edit"}
    >
      <Button variant={"secondary"}>
        <Edit />
        Edit Page
      </Button>
    </Link>
  );
};

export default EditPageButton;
