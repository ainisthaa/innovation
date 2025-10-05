import { NextResponse } from "next/server";

let favorites: number[] = []; // mock data (จำลอง database)

export async function GET() {
  return NextResponse.json({ favorites });
}

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!favorites.includes(id)) {
    favorites.push(id);
  }
  return NextResponse.json({ success: true, favorites });
}
