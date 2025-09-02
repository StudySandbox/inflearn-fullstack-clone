import { Metadata } from "next";

import * as api from "@/lib/api";

import UI from "./ui";

export const metadata: Metadata = {
  title: "계정 설정 - 인프런",
  description: "인프런 계정 설정 페이지입니다.",
};

const AccountSettingsPage = async () => {
  const profile = await api.getProfile();

  if (!profile.data || profile.error) {
    return <div>프로필이 존재하지 않습니다.</div>;
  }

  return <UI profile={profile.data} />;
};

export default AccountSettingsPage;
