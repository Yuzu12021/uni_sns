"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";
import { updateApplicationStatus } from "../services/applicationService";
import { Application } from "../types/application";
import { UserProfile } from "../types/user";
import { upsertProjectChatRoom } from "../services/chatService";
import ProfileModal from "./ProfileModal";

type ApplicationListProps = {
  applications: Application[];
  postId:string;
  postTitle:string;
  ownerId:string;
};

export default function ApplicationList({
  applications,
  postId,
  postTitle,
  ownerId,
}: ApplicationListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    null
  );
  const [localApplications, setLocalApplications] =
    useState<Application[]>(applications);

  useEffect(() => {
    setLocalApplications(applications);
  }, [applications]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profileMap: Record<string, UserProfile> = {};

      for (const application of applications) {
        const profile = await getUserProfile(application.applicantId);

        if (profile) {
          profileMap[application.applicantId] = profile;
        }
      }

      setProfiles(profileMap);
    };

    if (applications.length > 0) {
      fetchProfiles();
    }
  }, [applications]);

  const handleStatusChange = async (
  application: Application,
  status: "accepted" | "rejected"
) => {
  await updateApplicationStatus(application.id, status);

  if (status === "accepted") {
    await upsertProjectChatRoom({
      postId,
      postTitle,
      ownerId,
      applicantId: application.applicantId,
    });
  }

  setLocalApplications((current) =>
    current.map((item) =>
      item.id === application.id ? { ...item, status } : item
    )
  );
};

  const statusLabel = {
    pending: "応募中",
    accepted: "承認済み",
    rejected: "辞退",
  };

  return (
    <section className="mb-8 rounded-2xl border bg-white p-5 text-slate-950">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            応募者一覧
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {applications.length}件の応募があります
          </p>
        </div>

        <span className="text-sm font-bold text-slate-600">
          {isOpen ? "閉じる" : "開く"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-5 space-y-3">
          {localApplications.length === 0 ? (
            <p className="text-sm font-medium text-slate-600">
              まだ応募はありません。
            </p>
          ) : (
            localApplications.map((application) => {
              const profile = profiles[application.applicantId];

              const displayName =
                profile?.nickname ||
                profile?.name ||
                application.applicantEmail;

              const iconUrl =
                profile?.iconUrl ||
                "https://placehold.jp/150x150.png";

              return (
                <div
                  key={application.id}
                  className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (profile) {
                        setSelectedProfile(profile);
                      }
                    }}
                    className="flex items-center gap-3 text-left"
                  >
                    <img
                      src={iconUrl}
                      alt="応募者アイコン"
                      className="h-12 w-12 rounded-full border bg-white object-cover"
                    />

                    <div>
                      <p className="font-bold text-slate-950">
                        {displayName}
                      </p>
                      <p
  className={`text-xs font-bold ${
    application.status === "accepted"
      ? "text-green-700"
      : application.status === "rejected"
      ? "text-red-700"
      : "text-slate-600"
  }`}
>
  {statusLabel[application.status]}
</p>
                    </div>
                  </button>

                  <div className="flex gap-2">
  {application.status === "pending" && (
    <>
      <button
        type="button"
        onClick={() =>
          handleStatusChange(application, "accepted")
        }
        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white"
      >
        承認
      </button>

      <button
        type="button"
        onClick={() =>
          handleStatusChange(application, "rejected")
        }
        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
      >
        辞退
      </button>
    </>
  )}

  {application.status === "accepted" && (
  <div className="flex gap-2">
    <span className="rounded-xl bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
      承認済み
    </span>

    <button
      type="button"
      onClick={() =>
        upsertProjectChatRoom({
          postId,
          postTitle,
          ownerId,
          applicantId: application.applicantId,
        })
      }
      className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white"
    >
      チャット作成
    </button>
  </div>
)}

  {application.status === "rejected" && (
    <span className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
      辞退済み
    </span>
  )}
</div>
                </div>
              );
            })
          )}
        </div>
      )}

      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </section>
  );
}