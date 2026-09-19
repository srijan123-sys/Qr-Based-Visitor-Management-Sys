**Role:** Act as an expert Full-Stack Developer specializing in MERN stack (React, Node.js, Express, MongoDB).

**Objective:** Build a complete "QR Code Management System". Do not just build a static generator; I need a system to manage, track, and edit dynamic QR codes. 

**Context & Rules:** 
I am providing my custom rules and workflows in the attached `skills.md` file. STRICTLY adhere to the coding standards, folder structure, and best practices mentioned in `skills.md`. 

**Core Features Required:**
1. **User Authentication:** Secure Signup/Login (JWT-based) so users can manage their own QR codes.
2. **Dynamic QR Generation:** Users should be able to create QRs for URLs, text, and vCards. The QR codes must be *dynamic* (the underlying destination URL can be changed later without changing the physical QR image).
3. **Analytics Tracking:** Every time a dynamic QR is scanned, log the scan data (Timestamp, Device OS, and basic location if possible) before redirecting to the actual destination.
4. **Dashboard:** A clean UI to view all generated QRs, their total scan counts, edit destination links, and delete/download the QR code image (PNG/SVG).

**Tech Stack Guidelines:**
- **Frontend:** React (Vite), Tailwind CSS for styling. Use a library like `qrcode.react` or `html5-qrcode`.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose schemas for Users, QRCodes, and ScanAnalytics).

**Step 1 Action:** 
Do not write all the code at once. First, output the exact database schema (Mongoose) and the proposed API route structure. Wait for my approval before proceeding to build the backend logic.