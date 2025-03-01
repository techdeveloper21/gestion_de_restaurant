import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "sql107.infinityfree.com",
  user: "if0_38424298",
  password: "",  // Ensure empty password works
  database: "if0_38424298_restaurant_management",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
