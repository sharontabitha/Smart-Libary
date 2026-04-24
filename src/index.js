import 'dotenv/config';
import http from 'http';
import { neon } from '@neondatabase/serverless';

// Inisialisasi koneksi Neon
const sql = neon('postgresql://neondb_owner:npg_YcA7PO4hLXCe@ep-raspy-term-anp59ll6-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require');

const requestHandler = async (req, res) => {
  // Path untuk mengambil data Top 3 Peminjam
  if (req.url === "/api/loans/top-borrowers" && req.method === "GET") {
    try {
      // Query SQL yang sudah diperbarui dengan full_name
      const result = await sql`
        SELECT 
          m.full_name, 
          m.email,
          COUNT(l.id)::INTEGER as total_pinjaman,
          (SELECT b.title FROM books b 
           JOIN loans l2 ON b.id = l2.book_id 
           WHERE l2.member_id = m.id 
           GROUP BY b.title 
           ORDER BY COUNT(l2.id) DESC LIMIT 1) as buku_favorit,
          MAX(l.loan_date) as pinjaman_terakhir
        FROM members m
        JOIN loans l ON m.id = l.member_id
        GROUP BY m.id, m.full_name, m.email
        ORDER BY total_pinjaman DESC
        LIMIT 3
      `;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));

    } catch (error) {
      console.error("Detail Error:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ 
        message: "Gagal mengambil data", 
        error: error.message 
      }));
    }
  } 
  // Jalur default (Pintu Depan)
  else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Smart Library API is Running... Akses ke http://localhost:3000/api/loans/top-borrowers");
  }
};

// Menjalankan Server
http.createServer(requestHandler).listen(3000, () => {
  console.log("🚀 Server jalan di http://localhost:3000");
});