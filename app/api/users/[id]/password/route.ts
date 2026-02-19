import { auth } from "@/auth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

const API_URL = process.env.API_URL;

// PUT /api/users/[id]/password
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const { data } = await axios.put(`${API_URL}/users/${id}/password`, body, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Error del backend:", error.response?.data);
      return NextResponse.json(
        error.response?.data || { error: "Error al actualizar password" },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
