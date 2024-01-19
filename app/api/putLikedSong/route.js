import { connectMongoDB } from "@/lib/mongodb";
import LikedSong from "@/models/LikedSong";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        console.log("Please login first");
        return [];
    }
    const { song_id } = await req.json();
    const user_email = session?.user?.email;
    try {
        await connectMongoDB();
        const data = await LikedSong.create({ user_email, song_id });

        return Response.json({ message: "created" });
    } catch (error) {
        return Response.json({ error: error.message })
    }
}
