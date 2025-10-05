import { NextResponse } from "next/server";

let favorites: number[] = []; // ต้องใช้ global เดียวกับไฟล์บนจริง ๆ ถ้าจะ persist ได้

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const favId = parseInt(params.id);
  favorites = favorites.filter((f) => f !== favId);
  return NextResponse.json({ success: true, favorites });
}
