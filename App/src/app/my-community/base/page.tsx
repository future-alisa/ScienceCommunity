"use client";

import { Base } from "@/components/base";
import { useRouter } from "next/navigation";

export default function Page() {
  const data = [
    {
      title: "1",
      id: "1",
      description: "description1",
    },
    {
      title: "2",
      id: "2",
      description: "description2",
    },
  ];
  const router = useRouter();

  return (
    <Base
      data={data}
      handleCardClick={() => router.push("/my-community/detail")}
    />
  );
}
