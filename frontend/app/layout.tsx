import { Footer } from "./components/layout/footer";
import { Navbar } from "./components/layout/navbar";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { LoginDialog } from "./components/auth/LoginDialog";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col bg-gray-50">
        {/* ✅ ครอบทั้งเว็บด้วย AuthProvider */}
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* ✅ Dialog login จะเปิดจาก context ได้ทุกหน้า */}
          <LoginDialog />
        </AuthProvider>
      </body>
    </html>
  );
}
