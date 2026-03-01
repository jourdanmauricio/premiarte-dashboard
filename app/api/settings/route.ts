import { auth } from "@/auth";
import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { data } = await axios.get(`${API_URL}/settings`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return NextResponse.json(data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message =
        status === 401
          ? "Sesión expirada o sin permiso para ver configuraciones. Vuelve a iniciar sesión."
          : ((err.response?.data as { message?: string })?.message ??
            err.message);
      return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.json(
      { error: "Error al obtener configuraciones" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data } = await axios.post(`${API_URL}/settings`, body, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return NextResponse.json(data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message =
        (err.response?.data as { message?: string })?.message ?? err.message;
      return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.json(
      { error: "Error al crear configuración" },
      { status: 500 },
    );
  }
}
