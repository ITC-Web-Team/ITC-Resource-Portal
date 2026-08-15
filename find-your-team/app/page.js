import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import IdeaCard from "@/components/IdeaCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let ideas = [];
  let databaseReady = true;

  try {
    ideas = await prisma.idea.findMany({
      where: { isPrivate: false },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    databaseReady = false;
    console.error("Failed to load ideas:", error);
  }

  const normalizedIdeas = ideas.map((idea) => ({
    ...idea,
    id: String(idea.id),
  }));

  return (
    <>
      <Navbar />

      <div className="p-6">
        {!databaseReady ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
            Database is not configured yet. Add `DATABASE_URL` in `.env.local`,
            then run `npx prisma db push`.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {normalizedIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
