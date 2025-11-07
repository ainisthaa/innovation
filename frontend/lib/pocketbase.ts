// lib/pocketbase.ts
import PocketBase from "pocketbase";

// ⚙️ PocketBase Configuration
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://rsa-db.bobyed.com";

// ✅ สร้าง PocketBase instance
const pb = new PocketBase(POCKETBASE_URL);

// ✅ Configure settings
pb.autoCancellation(false);

// ✅ โหลด auth state จาก cookie (client-side only)
if (typeof window !== "undefined") {
  pb.authStore.loadFromCookie(document.cookie);

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
        pb.authStore.clear();
      });
    }
  }, 10 * 60 * 1000);
}

export default pb;

// 📊 TypeScript Type Definitions

/**
 * Posts Collection - กิจกรรมทั้งหมด
 */
export interface Post {
  id: string;
  collectionId: string;
  collectionName: "Posts";
  created: string;
  updated: string;
  
  // Main Info
  Topic: string;
  ViewDescription: string;
  AllDescription: string;
  Type: string;
  
  // Location & Time
  Place: string;
  Period: string;
  
  // Requirements
  Requirement: string;
  
  // Organization
  Organized: string;
  Contact: string;
  Owner: string;
  
  // Registration
  OpenRegister: string;
  CloseRegister: string;
  MaxRegister: number;
  RegisterLink: string;
  
  // Media
  Poster: string;
  
  // Status & Metrics
  ViewCount: number;
  Status: string;
  Verify: boolean;
  Notify: boolean;
  
  // Relations
  Faculty?: string;
  Department?: string;
  
  // Expanded relations
  expand?: {
    Type?: TypeRecord;
    Faculty?: Faculty;
    Department?: Department;
  };
}

/**
 * Type Collection - ประเภทกิจกรรม
 */
export interface TypeRecord {
  id: string;
  collectionId: string;
  collectionName: "Type";
  created: string;
  updated: string;
  TypeName: string;
}

/**
 * Faculty Collection - คณะ
 */
export interface Faculty {
  id: string;
  collectionId: string;
  collectionName: "Faculty";
  created: string;
  updated: string;
  FacultyName: string;
}

/**
 * Department Collection - สาขาวิชา
 */
export interface Department {
  id: string;
  collectionId: string;
  collectionName: "Department";
  created: string;
  updated: string;
  DepartmentName: string;
  Faculty?: string;
}

/**
 * Favorites Collection - รายการโปรดของผู้ใช้
 */
export interface Favorite {
  id: string;
  collectionId: string;
  collectionName: "Favorites";
  created: string;
  updated: string;
  
  UserID: string;
  PostID: string;
  Notify: boolean;
  
  expand?: {
    UserID?: User;
    PostID?: Post;
  };
}

/**
 * Users Collection - ข้อมูลผู้ใช้
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
  
  NotifyEnabled?: boolean;
}

// 🛠️ Helper Types
export type PostStatus = "upcoming" | "open" | "closed";

export interface PostWithStatus extends Post {
  status: PostStatus;
}

// 🔧 Utility Functions

/**
 * ✅ แปลง Status จาก PocketBase เป็น PostStatus
 */
export function calculatePostStatus(post: Post): PostStatus {
  const status = post.Status?.toLowerCase() || "";
  
  switch (status) {
    case "open":
      return "open";
    case "close":
      return "closed";
    case "comingsoon":
      return "upcoming";
    default:
      return post.Verify ? "open" : "closed";
  }
}

/**
 * ✅ สร้าง URL สำหรับรูปภาพจาก PocketBase (แก้ไขเป็น getURL)
 */
export function getImageUrl(
  record: { id: string; collectionId: string; collectionName: string },
  filename?: string,
  thumb?: string
): string {
  if (!filename || filename === "N/A" || filename === "") {
    return "/images/activity.png";
  }
  
  try {
    // ✅ FIXED: เปลี่ยนจาก getUrl() เป็น getURL()
    return pb.files.getURL(record, filename, { thumb });
  } catch (error) {
    console.error("❌ Error generating image URL:", error);
    return "/images/activity.png";
  }
}

/**
 * ✅ สร้าง URL สำหรับ Avatar (แก้ไขเป็น getURL)
 */
export function getAvatarUrl(
  record: { id: string; collectionId: string; collectionName: string },
  filename?: string
): string {
  if (!filename || filename === "") {
    return "/images/default-avatar.png";
  }
  
  try {
    // ✅ FIXED: เปลี่ยนจาก getUrl() เป็น getURL()
    return pb.files.getURL(record, filename, { thumb: "100x100" });
  } catch (error) {
    return "/images/default-avatar.png";
  }
}

/**
 * ฟอร์แมตวันที่เป็นภาษาไทย
 */
export function formatThaiDate(dateString: string): string {
  if (!dateString || dateString === "-" || dateString === "N/A") return "-";
  
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

// 🔍 Query Helper Functions

/**
 * ดึงรายการ Type ทั้งหมด
 */
export async function getAllTypes() {
  try {
    const records = await pb.collection("Type").getFullList<TypeRecord>({
      sort: "TypeName",
    });
    return { success: true, data: records };
  } catch (error: any) {
    console.error("❌ Get types error:", error);
    return { success: false, error: error?.message || "ไม่สามารถโหลดประเภทกิจกรรมได้" };
  }
}

/**
 * ดึงรายการ Faculty ทั้งหมด
 */
export async function getAllFaculties() {
  try {
    const records = await pb.collection("Faculty").getFullList<Faculty>({
      sort: "FacultyName",
    });
    return { success: true, data: records };
  } catch (error: any) {
    console.error("❌ Get faculties error:", error);
    return { success: false, error: error?.message || "ไม่สามารถโหลดรายการคณะได้" };
  }
}

/**
 * ดึงรายการ Department ทั้งหมด (หรือตามคณะ)
 */
export async function getAllDepartments(facultyId?: string) {
  try {
    const filter = facultyId ? `Faculty="${facultyId}"` : "";
    const records = await pb.collection("Department").getFullList<Department>({
      sort: "DepartmentName",
      filter,
      expand: "Faculty",
    });
    return { success: true, data: records };
  } catch (error: any) {
    console.error("❌ Get departments error:", error);
    return { success: false, error: error?.message || "ไม่สามารถโหลดรายการสาขาวิชาได้" };
  }
}

/**
 * ดึงข้อมูล Post พร้อม expand relations
 */
export async function getPostWithExpand(postId: string) {
  try {
    const post = await pb.collection("Posts").getOne<Post>(postId, {
      expand: "Type,Faculty,Department",
      requestKey: `post_expand_${postId}_${Date.now()}`,
    });
    return { success: true, data: post };
  } catch (error: any) {
    console.error("❌ Get post error:", error);
    return { success: false, error: error?.message || "ไม่พบกิจกรรมนี้" };
  }
}

/**
 * ค้นหา Posts ด้วย filters
 */
export async function searchPosts(params: {
  query?: string;
  type?: string;
  faculty?: string;
  department?: string;
  page?: number;
  perPage?: number;
}) {
  try {
    const { query = "", type = "", faculty = "", department = "", page = 1, perPage = 100 } = params;
    
    let filters: string[] = [];
    
    if (query) {
      filters.push(`(Topic ~ "${query}" || ViewDescription ~ "${query}" || AllDescription ~ "${query}")`);
    }
    
    if (type) {
      filters.push(`Type="${type}"`);
    }
    
    if (faculty) {
      filters.push(`Faculty="${faculty}"`);
    }
    
    if (department) {
      filters.push(`Department="${department}"`);
    }

    const filterString = filters.length > 0 ? filters.join(" && ") : "";

    const list = await pb.collection("Posts").getList<Post>(page, perPage, {
      sort: "-created",
      filter: filterString,
      expand: "Type,Faculty,Department",
      requestKey: `search_posts_${Date.now()}`,
    });

    return { success: true, data: list };
  } catch (error: any) {
    console.error("❌ Search posts error:", error);
    return { success: false, error: error?.message || "ไม่สามารถค้นหากิจกรรมได้" };
  }
}

// 🔔 Real-time Subscriptions Helper
export function subscribeToCollection<T = any>(
  collectionName: string,
  callback: (data: { action: string; record: T }) => void
) {
  return pb.collection(collectionName).subscribe("*", callback);
}

export type { PocketBase };
export { pb };