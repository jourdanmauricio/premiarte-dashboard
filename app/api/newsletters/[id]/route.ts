import { auth } from "@/auth";
import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const { data } = await axios.delete(`${API_URL}/newsletters/${id}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  return NextResponse.json(data);
}
