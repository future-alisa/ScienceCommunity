"use client";
import { useParams } from "next/navigation";
import styles from "./my-commnity.module.css";
import { CommunityRouteParams } from "@/model/MyRouteParams";
import { useEffect, useState } from "react";
import CommunityService from "@/services/CommunityService";
import { Community } from "@/model/Community";

export default function Page() {
  const { communityId } = useParams<CommunityRouteParams>();
  const [commnity, setCommunity] = useState<Community>();
  console.log("community id: ", communityId);

  useEffect(() => {
    const fetchData = async () => {
      const data = await CommunityService.getCommunityById(communityId);
      setCommunity(data);
      console.log("加载社区信息：", data);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.grid}>
      <p>{commnity?.communityDescription}</p>
    </div>
  );
}
