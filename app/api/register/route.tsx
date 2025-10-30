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
  const { nombre, correo, password } = await req.json();

  if (!nombre?.trim() || !correo?.trim() || !password?.trim()) {
    return NextResponse.json(
      { message: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  const data: Usuario[] = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
    : [];

  const existe = data.some((u) => u.correo === correo);
  if (existe) {
    return NextResponse.json(
      { message: "El correo ya está registrado" },
      { status: 400 }
    );
  }

  const nuevoUsuario: Usuario = {
    id: Date.now(),
    nombre,
    correo,
    password,
  };

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  data.push(nuevoUsuario);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json({ message: "Usuario registrado con éxito" });
}
