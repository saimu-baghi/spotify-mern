import { connectToDB } from "@/app/lib/utils";
import { Users } from "@/app/lib/models";
import { NextResponse } from "next/server";
import { hash as bcryptHash } from "bcrypt";
import { generateId } from "lucia";
import { generateFromEmail, generateUsername } from "unique-username-generator";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcryptHash(password, 10);
    const userId = generateId(15);
    const username = generateFromEmail(email, 3);

    await connectToDB();
    await Users.create({
      _id: userId,
      username,
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user" },
      { status: 500 }
    );
  }
}
