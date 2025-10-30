import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const filePath = path.join(process.cwd(), "app/data/users.json");

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  password: string;
}

export async function POST(req: Request) {
  const { correo, password } = await req.json();

  if (!correo?.trim() || !password?.trim()) {
    return NextResponse.json(
      { message: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { message: "No hay usuarios registrados" },
      { status: 404 }
    );
  }

  const data: Usuario[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const usuario = data.find((u) => u.correo === correo);

  if (!usuario) {
    return NextResponse.json(
      { message: "El correo no existe" },
      { status: 404 }
    );
  }

  if (usuario.password !== password) {
    return NextResponse.json(
      { message: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: `Bienvenido ${usuario.nombre}!`,
  });
}
