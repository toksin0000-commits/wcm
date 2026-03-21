import conflicts from "@/data/conflicts.json";

export async function GET() {
  return Response.json(conflicts);
}
