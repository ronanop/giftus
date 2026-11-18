import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <div>
          <h1 className="font-display text-4xl text-ink">Profile</h1>
          <p className="mt-2 text-ink/65">
            Your account details for Shubh Sagan.
          </p>
        </div>
        <ProfileForm name={session.name} email={session.email} />
      </main>
    </div>
  );
}
