import { auth } from "@/auth";
import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data } = await axios.get(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { data } = await axios.post(`${API_URL}/categories`, body, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  return NextResponse.json(data);
}
