import { auth } from "@/auth";
import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data } = await axios.get(`${API_URL}/orders`, {
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
  try {
    const { data } = await axios.post(`${API_URL}/orders`, body, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Error del backend:", error.response?.data);
      return NextResponse.json(
        error.response?.data || { error: "Error al crear pedido" },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
