import PocketBase from "pocketbase";

// ✅ ตั้งค่า PocketBase URL (local dev)
const pb = new PocketBase("http://127.0.0.1:8090");

// ✅ โหลด token จาก cookie (เก็บสถานะล็อกอินไว้หลังรีเฟรช)
if (typeof document !== "undefined") {
  pb.authStore.loadFromCookie(document.cookie);
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie();
  });
}

// ✅ export ไปให้ทุกที่ใน frontend ใช้
export default pb;
