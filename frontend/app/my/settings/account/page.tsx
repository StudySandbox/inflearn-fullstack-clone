import * as api from "@/lib/api";

import UI from "./ui";

const AccountSettingsPage = async () => {
  const profile = await api.getProfile();

  if (!profile.data || profile.error) {
    return <div>프로필이 존재하지 않습니다.</div>;
  }

  return <UI profile={profile.data} />;
};

export default AccountSettingsPage;
