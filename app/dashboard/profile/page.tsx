import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Profile</h1>
      <div className="border rounded-lg overflow-hidden">
        <UserProfile path="/dashboard/profile" routing="path" />
      </div>
    </div>
  );
}
