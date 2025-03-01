import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { ResultSetHeader } from "mysql2";

// Define User type

export async function getUserByEmail(email: string) {
  const [user] = await db.query<any[]>("SELECT * FROM user WHERE email = ?", [email]);

  console.log('getting user using email');
  console.log(user);

  return user[0] || null;
}

export async function getUserById(user_id:any){
  
  const [user] = await db.query<any[]>("SELECT * FROM user WHERE user_id = ?", [user_id]);

  return user[0] || null;
}

export async function createUser(username: string, email: string) {
  const hashedPassword = await bcrypt.hash("1234", 10); // Default password
  const result = await db.query<ResultSetHeader>(
    "INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, 0)",
    [username, email, hashedPassword]
  );

  return { user_id: result[0].insertId };
}
