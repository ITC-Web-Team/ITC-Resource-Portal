import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import IdeaCard from "@/components/IdeaCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const ideas = await prisma.idea.findMany({
    where: { isPrivate: false },
    orderBy: { createdAt: "desc" },
  });

  const normalizedIdeas = ideas.map((idea) => ({
    ...idea,
    id: String(idea.id),
  }));

  return (
    <>
      <Navbar />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {normalizedIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </div>
    </>
  );
}