"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";
import { updateApplicationStatus } from "../services/applicationService";
import { Application } from "../types/application";
import { UserProfile } from "../types/user";
import ProfileModal from "./ProfileModal";

type ApplicationListProps = {
  applications: Application[];
};

export default function ApplicationList({
  applications,
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
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    await updateApplicationStatus(applicationId, status);

    setLocalApplications((current) =>
      current.map((application) =>
        application.id === applicationId
          ? { ...application, status }
          : application
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
                      <p className="text-xs font-medium text-slate-600">
                        {statusLabel[application.status]}
                      </p>
                    </div>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(application.id, "accepted")
                      }
                      disabled={application.status === "accepted"}
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
                    >
                      承認
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(application.id, "rejected")
                      }
                      disabled={application.status === "rejected"}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
                    >
                      辞退
                    </button>
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