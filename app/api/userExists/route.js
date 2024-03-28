import { connectToDB } from "@/app/lib/utils";
import { Users } from "@/app/lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();
    const { email } = await req.json();
    const user = await Users.findOne({ email }).select("_id");
    // console.log("user: ", user);
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}
