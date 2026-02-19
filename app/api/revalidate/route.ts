import { NextRequest, NextResponse } from "next/server";

const FRONT_URL = process.env.FRONT_URL ?? "http://localhost:5000";
const SECRET = process.env.SECRET_REVALIDATE;

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { error: "SECRET_REVALIDATE no configurado" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const res = await fetch(`${FRONT_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "secret-revalidate": SECRET,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Error en revalidación", details: text },
        { status: res.status }
      );
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Revalidate error:", error);
    return NextResponse.json(
      { error: "Error al llamar al front de revalidación" },
      { status: 500 }
    );
  }
}
