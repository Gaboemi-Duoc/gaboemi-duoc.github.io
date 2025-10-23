import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/data/users.json");

export async function POST(req: Request) {
  const { nombre, correo, password } = await req.json();

  // Validar campos básicos
  if (!nombre || !correo || !password) {
    return NextResponse.json(
      { message: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  // Leer archivo JSON
  const data = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
    : [];

  // Verificar si ya existe el correo
  // const existe = data.some((u: any) => u.correo === correo);
  // if (existe) {
  //   return NextResponse.json(
  //     { message: "El correo ya está registrado" },
  //     { status: 400 }
  //   );
  // }
  // Error en ANY

  // Crear nuevo usuario
  const nuevoUsuario = { id: Date.now(), nombre, correo, password };

  data.push(nuevoUsuario);

  // Guardar en el JSON
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return NextResponse.json({ message: "Usuario registrado con éxito" });
}
