import AuthGuard from "../../components/AuthGuard";
import ProfileEditor from "../../components/ProfileEditor";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <ProfileEditor />
      </main>
    </AuthGuard>
  );
}