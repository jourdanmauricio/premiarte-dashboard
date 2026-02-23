import { auth } from "@/auth";
import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data } = await axios.get(`${API_URL}/newsletters`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  return NextResponse.json(data);
}
