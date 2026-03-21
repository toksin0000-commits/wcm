import Link from "next/link";
import conflicts from "@/data/conflicts.json";

export default function ConflictsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">Konflikty ve světě</h1>
      <p className="text-gray-600 mb-8">
        Vyberte konflikt ze seznamu nebo klikněte na mapu na hlavní stránce.
      </p>

      <div className="flex flex-col gap-4">
        {conflicts.map((conflict) => (
          <Link
            key={conflict.id}
            href={`/conflicts/${conflict.id}`}
            className="p-4 border rounded-lg hover:bg-gray-50 transition flex items-start gap-4"
          >
            <div className="text-3xl">
              {conflict.flag ?? "🌍"}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{conflict.name}</h2>
              <p className="text-gray-600 mt-1">{conflict.summary_short}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
