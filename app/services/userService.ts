import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "@/types/user"; // Make sure this path is correct

// ✅ Fix: Use `User[] & RowDataPacket[]` instead of `any[]`
export async function getUserByEmail(email: string): Promise<User | null> {
  const [users] = await db.query<User[] & RowDataPacket[]>(
    "SELECT * FROM user WHERE email = ?", 
    [email]
  );

  console.log("Getting user using email:", users);

  return users.length > 0 ? users[0] : null; // Ensure proper check
}

export async function getUserById(user_id: number): Promise<User | null> {
  const [users] = await db.query<User[] & RowDataPacket[]>(
    "SELECT * FROM user WHERE user_id = ?", 
    [user_id]
  );

  return users.length > 0 ? users[0] : null;
}

export async function createUser(username: string, email: string): Promise<{ user_id: number }> {
  const hashedPassword = await bcrypt.hash("1234", 10); // Default password
  
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, 0)",
    [username, email, hashedPassword]
  );

  return { user_id: result.insertId };
}