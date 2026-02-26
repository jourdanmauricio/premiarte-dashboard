import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { data } = await axios.post(`${API_URL}/auth/reset-password`, body);
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Error del backend:", error.response?.data);
      return NextResponse.json(
        error.response?.data || {
          error: "Error al resetear la contraseña",
        },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
