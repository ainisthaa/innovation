// lib/pocketbase.ts
import PocketBase from "pocketbase";

// ⚙️ PocketBase Configuration
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

// ✅ สร้าง PocketBase instance
const pb = new PocketBase(POCKETBASE_URL);

// ✅ Configure settings
pb.autoCancellation(false); // ปิด auto-cancellation เพื่อป้องกัน race conditions

// ✅ โหลด auth state จาก cookie (client-side only)
if (typeof window !== "undefined") {
  // Load auth from cookie on init
  pb.authStore.loadFromCookie(document.cookie);

  // Save auth to cookie on every change
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({ 
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  });

  // ✅ Refresh token ก่อนหมดอายุ (every 10 minutes)
  setInterval(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      pb.collection("users").authRefresh().catch((err) => {
        console.warn("⚠️ Token refresh failed:", err);
        // Token หมดอายุแล้ว - ล็อกเอาท์อัตโนมัติ
        pb.authStore.clear();
      });
    }
  }, 10 * 60 * 1000); // 10 minutes
}

// ✅ Export PocketBase instance
export default pb;

// 📊 TypeScript Type Definitions
// ตาม Backend Schema ที่คุณมี

/**
 * Posts Collection
 * กิจกรรมทั้งหมด
 */
export interface Post {
  id: string;
  collectionId: string;
  collectionName: "Posts";
  created: string;
  updated: string;
  
  // Main Info
  Topic: string;                    // ชื่อกิจกรรม
  ViewDescription: string;          // คำอธิบายแบบสั้น
  AllDescription: string;           // คำอธิบายแบบเต็ม
  Type: string;                     // ประเภทกิจกรรม
  
  // Location & Time
  Place: string;                    // สถานที่
  Period: string;                   // ช่วงเวลา
  
  // Requirements
  Requirement: string;              // คุณสมบัติผู้เข้าร่วม
  
  // Organization
  Organized: string;                // หน่วยงานจัด
  Contact: string;                  // ช่องทางติดต่อ
  Owner: string;                    // เจ้าของโพสต์
  
  // Registration
  OpenRegister: string;             // วันเปิดรับสมัคร (ISO date)
  CloseRegister: string;            // วันปิดรับสมัคร (ISO date)
  MaxRegister: number;              // จำนวนรับสมัคร
  RegisterLink: string;             // ลิงก์ลงทะเบียน
  
  // Media
  Poster: string;                   // ไฟล์รูปภาพ
  
  // Status & Metrics
  ViewCount: number;                // จำนวนการเข้าชม
  Status: string;                   // สถานะ
  Verify: boolean;                  // อนุมัติหรือไม่
  Notify: boolean;                  // แจ้งเตือนหรือไม่
}

/**
 * Favorites Collection
 * รายการโปรดของผู้ใช้
 */
export interface Favorite {
  id: string;
  collectionId: string;
  collectionName: "Favorites";
  created: string;
  updated: string;
  
  UserID: string;                   // relation: users
  PostID: string;                   // relation: Posts
  Notify: boolean;                  // แจ้งเตือนหรือไม่
  
  // Expanded relations (optional)
  expand?: {
    UserID?: User;
    PostID?: Post;
  };
}

/**
 * Users Collection
 * ข้อมูลผู้ใช้
 */
export interface User {
  id: string;
  collectionId: string;
  collectionName: "users";
  created: string;
  updated: string;
  
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  avatar?: string;
  
  // Custom fields
  NotifyEnabled?: boolean;          // เปิดการแจ้งเตือนหรือไม่
}

// 🛠️ Helper Types
export type PostStatus = "upcoming" | "open" | "closed";

export interface PostWithStatus extends Post {
  status: PostStatus;
}

// 🔧 Utility Functions

/**
 * คำนวณสถานะกิจกรรมจาก dates
 */
export function calculatePostStatus(post: Post): PostStatus {
  if (!post.Verify) return "closed";
  
  const now = new Date();
  const openDate = post.OpenRegister ? new Date(post.OpenRegister) : null;
  const closeDate = post.CloseRegister ? new Date(post.CloseRegister) : null;
  
  if (openDate && openDate > now) {
    return "upcoming";
  } else if (closeDate && closeDate > now) {
    return "open";
  }
  
  return "closed";
}

/**
 * สร้าง URL สำหรับรูปภาพ
 */
export function getImageUrl(
  post: Post,
  filename?: string,
  thumb?: string
): string {
  if (!filename || filename === "N/A") {
    return "/images/activity.png";
  }
  
  const thumbParam = thumb ? `?thumb=${thumb}` : "";
  return `${pb.baseUrl}/api/files/${post.collectionId}/${post.id}/${filename}${thumbParam}`;
}

/**
 * ฟอร์แมตวันที่เป็นภาษาไทย
 */
export function formatThaiDate(dateString: string): string {
  if (!dateString || dateString === "-") return "-";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid && !!pb.authStore.model;
}

/**
 * ดึง User ID ปัจจุบัน
 */
export function getCurrentUserId(): string | null {
  return pb.authStore.model?.id || null;
}

/**
 * ดึงข้อมูล User ปัจจุบัน
 */
export function getCurrentUser(): User | null {
  return pb.authStore.model as User | null;
}

// 🔔 Real-time Subscriptions Helper
/**
 * Subscribe to collection changes
 * @example
 * const unsubscribe = subscribeToCollection("Posts", (e) => {
 *   console.log("Post updated:", e.record);
 * });
 */
export function subscribeToCollection<T = any>(
  collectionName: string,
  callback: (data: { action: string; record: T }) => void
) {
  return pb.collection(collectionName).subscribe("*", callback);
}

// 🚀 Export configured PocketBase with types
export type { PocketBase };
export { pb };