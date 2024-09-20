"use client";
import { Base } from "./Base";

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

  return <Base data={data} />;
}
