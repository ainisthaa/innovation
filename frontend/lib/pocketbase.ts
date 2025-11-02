// app/lib/pocketbase.ts
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090"); // URL ของ backend ที่รัน ./pocketbase serve
export default pb;
