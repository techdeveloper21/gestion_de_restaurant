import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/services/userService";

export async function POST(req: Request) {
  try {
    const { username, email } = await req.json();

    let user = await getUserByEmail(email);
    console.log(user);
    if (!user || user.length <=0) {
      user = await createUser(username, email);
      console.log(user);
    }
    
    return NextResponse.json({ user_id: user.user_id }, { status: 200 });
  } catch (error) {
    console.error("Error processing cart:", error); // ✅ Log the error
    return NextResponse.json({ error: "Failed to process user" }, { status: 500 });
  }
}
