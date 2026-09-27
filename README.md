# Site English — ติดตั้งเป็นแอปบนมือถือ (PWA)

ไฟล์ชุดนี้คือ "หน้าเปิดแอป" ที่วางบน GitHub Pages กดไอคอนแล้วจะพาไปเว็บแอป Google Apps Script ของคุณ
เว็บแอปยังตั้งเป็น **Only myself** เหมือนเดิม ต้องล็อกอินบัญชี Google ของคุณเท่านั้นถึงจะเปิดได้

## 1. หาลิงก์เว็บแอป
Apps Script › **Deploy › Manage deployments** › คัดลอก **Web app URL** (ลงท้ายด้วย `/exec`)

## 2. สร้างที่เก็บบน GitHub (ครั้งแรกครั้งเดียว)
1. เข้า github.com › ปุ่ม **New** (repository) › ตั้งชื่อ เช่น `site-english` › เลือก **Public** › Create
2. กด **Add file › Upload files** › ลากไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้นไป (`index.html`, `manifest.webmanifest`, `sw.js` และโฟลเดอร์ `icons`) › **Commit changes**
3. เปิดไฟล์ `index.html` ใน GitHub › ไอคอนดินสอ (Edit) › วางลิงก์จากข้อ 1 ในบรรทัด
   `var EXEC_URL = '';` ให้เป็น `var EXEC_URL = 'https://script.google.com/macros/s/..../exec';` › **Commit changes**
4. **Settings › Pages** › Source: **Deploy from a branch** › Branch: `main` / `(root)` › **Save**
5. รอ 1–2 นาที จะได้ลิงก์แอป เช่น `https://ชื่อบัญชี.github.io/site-english/`

> ⚠️ ถ้าอัปโหลด `index.html` ใหม่ทับ ต้องกรอก `EXEC_URL` ใหม่ทุกครั้ง
> ⚠️ แก้ไฟล์แล้วเครื่องยังเห็นของเก่า: เพิ่มเลขเวอร์ชันใน `sw.js` บรรทัด `var CACHE = 'site-english-shell-v1';` เป็น `v2`, `v3`…

## 3. ติดตั้งบนเครื่อง
| เครื่อง | วิธี |
|---|---|
| iPhone / iPad | เปิดลิงก์แอปใน **Safari** › ปุ่มแชร์ › **เพิ่มไปยังหน้าจอโฮม** |
| Android | เปิดใน **Chrome** › เมนู ⋮ › **ติดตั้งแอป** (หรือ เพิ่มลงในหน้าจอหลัก) |
| Mac | Safari › เมนู File › **Add to Dock** · หรือ Chrome › ไอคอนติดตั้งในแถบที่อยู่ |
| Windows | Chrome / Edge › ไอคอนติดตั้งในแถบที่อยู่ |

ครั้งแรกที่เปิดจากไอคอน Google จะให้ล็อกอิน 1 ครั้ง ครั้งต่อไปเข้าได้เลย

## 4. ให้ลิงก์ในข้อความ LINE เปิดแอปนี้
ชีต **Settings** › แถว `APP_LINK_URL` › ใส่ลิงก์แอปจากข้อ 2.5

## หมายเหตุ
- **โหมดเปิดแอป** ค่าเริ่มต้นคือ `redirect` (เปลี่ยนหน้าไปเว็บแอป) ใช้ได้ทุกเครื่อง
  โหมด `iframe` ให้ความรู้สึกเป็นแอปมากกว่า แต่ Safari บน iPhone มักบล็อกการล็อกอิน Google ในกรอบ และต้องแก้ `doGet` ให้อนุญาตการฝัง จึงไม่แนะนำ
- **ไมค์ในแอป** ยังใช้ไม่ได้ (ข้อจำกัดของ Google Apps Script) ใช้การพิมพ์ด้วยเสียงของเครื่องแทน: iPhone/Android แตะไมค์บนแป้นพิมพ์ · Mac กด Fn สองครั้ง · Windows กด Win+H
- ไม่มีเน็ต: แอปจะเปิดหน้าแจ้งให้ต่อเน็ต แล้วกด "ลองอีกครั้ง"
