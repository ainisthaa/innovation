import { Footer } from "./components/layout/footer";
import { Navbar } from "./components/layout/navbar";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { LoginDialog } from "./components/auth/LoginDialog";

export const metadata = {
  title: "R-SA Volunteer Platform",
  description: "ระบบกิจกรรมอาสา พระจอมเกล้าลาดกระบัง",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <LoginDialog />
        </AuthProvider>
      </body>
    </html>
  );
}
