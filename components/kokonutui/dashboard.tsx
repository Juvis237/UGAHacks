"use client";

import { usePathname } from "next/navigation";
import Layout from "./layout";
import Content from "./content";
import LearnContent from "./learn-content";
import { useEffect, useState } from "react";
import ProfilePage from "../user-profile";

export default function Dashboard() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const getContent = () => {
    switch (pathname) {
      case "/learn":
        return <LearnContent />;
      default:
        return <ProfilePage />;
    }
  };

  return <Layout>{getContent()}</Layout>;
}
