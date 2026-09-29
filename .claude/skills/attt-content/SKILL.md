---
name: attt-content
description: Use whenever solving, checking, or writing practice/exam material for "Nhập môn Bảo đảm và An ninh Thông tin" (ATTT) in this repo — trắc nghiệm 40 câu gồm mã hoá cổ điển (Playfair, Caesar, Vigenère, Affine, hoán vị), DES/AES/RSA, chứng thực (MAC, hàm băm, chữ ký số, đọc biểu thức E(K, …)), thăm dò & quét mạng, nguy cơ trên hệ thống, mã độc, mạng không dây, bài lab & tình huống. Packages the real exam format, solved Đề mẫu, keyword→answer tables and a verified cipher checker so you don't re-read the scanned PDFs.
---

# ATTT domain knowledge

Skill **riêng của môn ATTT** (id gợi ý: `attt`). Môn **thuần trắc nghiệm, lý thuyết + vài câu tính
tay**. "Giải đề" = nhận diện từ khoá → chọn đáp án, và tính đúng các câu mã cổ điển / đọc biểu thức.

## Nguồn & mức tin cậy

| Nguồn (`docs/attt/`) | Là gì | Tin cậy |
|---|---|---|
| `Đề mẫu.pdf` | Đề 1 cuối kỳ HK2 2025-2026 (trích 7 câu + đoạn tình huống) | **Đề thật** |
| `Nội dung ôn tập.pdf` | Phạm vi thi chính thức theo từng bài | Thật |
| `Bài 1 … Bài 6 *.pdf` | Slide thầy (ThS. Tô Nguyễn Nhật Quang). Bài 3A/3B/4/5/6 phần lớn là ảnh → đã OCR | Thật |
| `Bài 1A`, `Bài 2 - Kiểm tra bảo mật…` | Hướng dẫn lab (CrypTool; lệnh Windows) | Thật |
| `OnTap_…docx`, `MeoTracNghiem_…docx`, `Phao ATTT 4 trang.html` | Ghi chú tổng hợp của sinh viên | Đã đối chiếu slide, khớp. Mục "Quản lý rủi ro", Event ID 4625/4740 **chỉ có trong ghi chú**, không có PDF gốc |
| `reference/ciphers.py` | Code kiểm chứng câu tính Playfair/Caesar/Vigenère/Affine/hoán vị | Chạy `python3 ciphers.py` → `OK` |
| `src/subjects/attt/data/exams/*.md` | Đề app đọc thẳng (module Luyện đề): `de-mau.md` = 7 câu **đề thật**; `de-luyen-*.md` = đề **tự soạn** bám dạng Đề mẫu, KHÔNG phải đề thật. Định dạng: `src/subjects/attt/engine/quiz.ts` | Đáp án tính toán đã chạy qua `ciphers.py` |

PDF là ảnh/OCR: xem `memory/reference-pdf-ocr-on-this-mac.md` (Swift PDFKit + Vision).

## Cấu trúc đề thật

- **75 phút, 40 câu × 0.25đ**, chọn 1 trong a/b/c/d, đánh X vào bảng trả lời. Được mang **2 tờ A4 viết tay**.
- Các dạng thấy trong Đề mẫu: nhận biết khái niệm (Keylogger, Script kiddies), "biện pháp tốt nhất",
  **đọc biểu thức chứng thực** (câu 02), **Playfair** 2 câu dùng chung đề (câu 05–06: vị trí trong ma
  trận khoá, ký tự thứ k của bản mã), **đọc hình sơ đồ chứng thực** (câu 07), và **khối tình huống ~10
  câu** (doanh nghiệp Hybrid Working: tiến trình lạ 2 GB RAM, cổng 445/3389, Guest bật, mật khẩu
  "Company2025", Firewall Public tắt, nhiều event 4625, user bị thêm vào Administrators, hotspot
  WPA2 mật khẩu "12345678", Wi-Fi sân bay).

## Đề mẫu — lời giải

| Câu | Đáp án | Vì sao |
|---|---|---|
| 01 | a | Keylogger = ghi lại phím gõ |
| 02 | b | E(K, [M ‖ E(PRa, H(M))]): K bọc ngoài → bảo mật; PRa ký H(M) → chứng thực + chữ ký số |
| 03 | b | Slide Bài 1: không ngăn được nghe trộm trên mạng công cộng → **mã hoá dữ liệu trước khi truyền** |
| 04 | b | Định nghĩa nguyên văn slide: dùng công cụ của hacker mũ đen = Script kiddies |
| 05 | b | Ma trận BAOMAT: `BAOMT / CDEFG / HIKLN / PQRSU / VWXYZ` → hàng 3 cột 3 = **K** |
| 06 | c | THANHPHOHOCHIMINH → cặp TH: T(1,5), H(3,1) khác hàng/cột → B, N → ký tự thứ 2 = **N** |
| 07 | b | Hình: M nối S → H, gửi M ‖ H(M ‖ S); bên nhận nối S, băm, so sánh |

## Cách làm từng dạng

### 1. Playfair (luôn có, ~60 giây)
1. Viết khoá, bỏ chữ trùng, **I ≡ J**, điền tiếp A→Z còn thiếu → ma trận 5×5 (hàng 1 = đầu khoá).
2. Bản rõ bỏ dấu cách, tách cặp; **dư 1 ký tự → thêm X** cuối.
3. Cùng hàng → lấy ký tự **bên phải** (vòng về đầu). Cùng cột → **bên dưới** (vòng lên đầu).
   Khác hàng & cột → góc còn lại của hình chữ nhật, **giữ hàng của ký tự gốc**.
4. Câu hỏi "ký tự thứ k" chỉ cần mã cặp chứa vị trí k — không cần mã hết.
5. Slide **không** nêu luật cặp trùng chữ (VD "EE"); đề thật tránh trường hợp này. Khi ra đề, tránh luôn
   (`ciphers.py` sẽ `assert`).

### 2. Mã cổ điển khác (nhận diện + tính nhanh, A=0…Z=25)
| Thấy | Là | Công thức / số liệu |
|---|---|---|
| khoá = hoán vị 26 chữ | Thay thế đơn giản | 26! ≈ 4·10²⁶ khoá |
| chia khối d, đổi chỗ theo h | Hoán vị bậc d | Slide: d=5, h=(4 1 3 2 5), "JOHN IS A GOOD ACTOR" → "NJHO AI S DGOO OATCR" (dấu cách tính là ký tự) |
| cộng 1 số cố định | Caesar (= Vigenère d=1) | CRYPTOGRAPHY +5 → HWDUYTLWFUMD |
| khoá chuỗi d ký tự lặp | Vigenère | CHIFFRE / VIGENERE → XPOJSVVG |
| ax + b mod 26 | Affine | a=1 → mã dịch chuyển; giải mã x = a⁻¹(y−b) |
| ma trận 5×5, 2 ký tự/lần | Playfair | — |
| C = HP mod 26 | Hill | slide đánh số A=01…Z=26 |
| phá mã cổ điển | tần suất chữ cái, IC, Kasiski | IC tiếng Anh ≈ 0.066, ngẫu nhiên ≈ 0.0385 |

### 3. Mã hiện đại
| | DES | AES (Rijndael) | RSA |
|---|---|---|---|
| Loại | đối xứng, khối | đối xứng, khối | bất đối xứng (khoá công khai/bí mật) |
| Khoá | 56 bit | 128/192/256 | cặp khoá |
| Khối | 64 bit | 128 bit (ma trận trạng thái 4×4 byte) | — |
| Ghi nhớ | yếu trước vét cạn; 3DES an toàn hơn | 4 hàm: SubBytes, ShiftRows, MixColumns, AddRoundKey; tác giả Daemen & Rijmen (Bỉ) | chậm hơn DES hàng ngàn lần |

- Kết hợp thực tế: **DES mã hoá dữ liệu, RSA mã hoá khoá DES**.
- Phân loại đối xứng: block cipher (DES, 3DES, AES, IDEA…) và stream cipher (**RC4**).
- Mốc: DES công bố 17.03.1975; AES thành chuẩn thay DES 26.05.2002 (slide cũng ghi "2001" ở phần lịch sử →
  tránh ra câu hỏi năm AES).
- Vét cạn khoá 56 bit: 2⁵⁶ ≈ 7.2·10¹⁶ khoá.

### 4. Đọc biểu thức chứng thực (hay ra nhất — nhìn **khoá nào**, ở **đâu**)
- **K bọc ngoài cùng** / **PUb** → Bảo mật.
- **PRa** (khoá riêng người gửi) → Chứng thực + **chữ ký số**.
- **C(K, M)** (MAC) hoặc **H(M ‖ S)** → Chứng thực (không bảo mật, không chữ ký).

| Biểu thức | Chức năng (theo slide Bài 2B) |
|---|---|
| E(K, M) | Bảo mật + chứng thực, **không** chữ ký |
| E(PUb, M) | Chỉ bảo mật |
| E(PRa, M) | Chứng thực + chữ ký số |
| E(PUb, E(PRa, M)) | Bảo mật + chứng thực + chữ ký số |
| M ‖ C(K, M) | Chứng thực |
| E(K2, [M ‖ C(K1, M)]) | Chứng thực + bảo mật (chứng thực gắn plaintext) |
| E(K2, M) ‖ C(K1, E(K2, M)) | Chứng thực + bảo mật (chứng thực gắn ciphertext) |
| E(K, [M ‖ H(M)]) | Bảo mật + chứng thực |
| M ‖ E(K, H(M)) | Chứng thực |
| M ‖ E(PRa, H(M)) | Chứng thực + chữ ký số |
| E(K, [M ‖ E(PRa, H(M))]) | Bảo mật + chứng thực + chữ ký số |
| M ‖ H(M ‖ S) | Chứng thực |
| E(K, [M ‖ H(M ‖ S)]) | Chứng thực + bảo mật |

**Đọc hình:** ô "E" có khoá đi vào → mã hoá; ô "H" → băm; "‖" → nối; "Compare" ở bên nhận → chứng thực.
Có S (giá trị bí mật) nối vào trước khi băm → dạng H(M ‖ S).

### 5. MAC / Hash / Chữ ký số
- **MAC = C(K, M)**: có khoá bí mật chung, đầu ra độ dài cố định (thường 32–96 bit). Khoá thường 56–160 bit.
  Số vòng vét cạn ≈ α nếu k = α·n (VD khoá 80 bit, MAC 32 bit → ~3 vòng: 2⁴⁸ → 2¹⁶ → 1).
- **Hash**: không khoá, độ dài bất kỳ → cố định = digest / fingerprint. Cần **một chiều + duy nhất
  (kháng đụng độ)**. Cấu trúc Merkle (1978), lõi là hàm nén. HMAC = hash + khoá.
- **MD5**: 128 bit (32 ký tự hex), Rivest 1991. **SHA-1**: 160 bit. **SHA-2**: 224/256/384/512. **SHA-3**: Keccak.
  Wang (2004–2005): MD5, SHA-1 không kháng đụng độ như kỳ vọng. SHA do NSA phát triển.
- **Ký**: băm M → digest → mã digest bằng **khoá riêng người gửi** (thường RSA) → gắn vào M.
  **Kiểm tra**: giải chữ ký bằng **khoá công khai người gửi**, băm lại M, so sánh.
- Chứng thực nhằm: xác nhận nguồn gốc + dữ liệu chưa bị sửa → bảo đảm **toàn vẹn** và **không thể từ chối**.

### 6. Câu lý thuyết "thấy là chọn" (Bài 1, 3–6)
Dùng bảng từ khoá trong `docs/attt/MeoTracNghiem_…docx` / `OnTap_…docx` (đã đối chiếu slide). Các mốc chốt:
- CIA; 4 yêu cầu dữ liệu: bí mật, toàn vẹn, không thể từ chối, sẵn sàng; 2 trạng thái: truyền / lưu trữ.
- 6 kỹ thuật tấn công cơ bản (Bài 1): Eavesdropping, Cryptanalysis, Password Pilfering, Identity Spoofing,
  Intrusion, DoS/DDoS. 5 nhóm attacker: Black-hat, Script kiddies, Cyber spies, Vicious employees,
  Cyber terrorists. Mô hình bảo mật 4 thành phần: Cryptosystem, Firewall, AMS, IDS.
- Chuỗi giai đoạn tấn công: Thăm dò → Quét → Chiếm quyền → Duy trì → Xoá dấu vết.
- Thăm dò (footprinting) = thu thập thông tin công khai; Quét (scanning) = gửi gói tới mục tiêu tìm host,
  cổng, dịch vụ. Bản ghi DNS: A, MX, NS, CNAME, SOA, PTR…
- Mã độc: virus cần file chủ; worm tự lây qua mạng; trojan nguỵ trang, không tự nhân bản. Phân tích
  **tĩnh** = không chạy mẫu; **động** = chạy trong sandbox cô lập (snapshot, mạng giả lập, tắt shared
  folder/clipboard). Phát hiện: chữ ký (nhanh, sót biến thể) vs hành vi (bắt zero-day, dễ báo nhầm).
  Backup 3-2-1.
- Wi-Fi: SSID ≤ 32 ký tự, phân biệt hoa/thường. WEP < WPA (TKIP) < WPA2 (AES-CCMP) < WPA3.
  WEP yếu: IV 24 bit bị lặp, khoá tĩnh ngắn (40/104 bit), CRC-32 không bảo đảm toàn vẹn, không chống replay.
  Công cộng → Open/Captive portal; gia đình → WPA2/3 Personal; doanh nghiệp → WPA2/3 Enterprise + 802.1X/RADIUS/EAP.
  Chuẩn 802.11: a (1999, 54 Mbps, 5 GHz), b (1999, 11 Mbps, 2.4), g (2003, 54, 2.4), n/Wi-Fi 4 (2009, 600, MIMO),
  ac/Wi-Fi 5 (2014, 6.9 Gbps, 5 GHz, MU-MIMO), ax/Wi-Fi 6 (2019, 9.6 Gbps), be/Wi-Fi 7 (2024, 46 Gbps).

### 7. Tình huống / lab (Bài 2 lab)
| Dấu hiệu | Kết luận / biện pháp |
|---|---|
| `netstat -ano` | xem cổng + PID; LISTENING = cổng mở |
| cổng 445 mở | SMB — cần chặn nếu không dùng (từng bị WannaCry khai thác) |
| cổng 3389 mở | RDP — giới hạn truy cập, MFA, VPN |
| Guest bật | `net user guest /active:no` (hoặc lusrmgr.msc / secpol.msc) |
| nhiều event **4625** từ 1 IP | đăng nhập thất bại lặp lại → đang bị dò mật khẩu → bật Account Lockout Policy |
| user lạ vào Administrators | dấu hiệu leo thang đặc quyền → gỡ quyền, điều tra, least privilege |
| mật khẩu kiểu "Company2025", "12345678" | yếu → ≥ 8–12 ký tự trộn loại, không theo mẫu, + MFA |
| Firewall Public tắt | bật lại cả 3 profile Domain/Private/Public |
| Wi-Fi công cộng truy cập hệ thống công ty | dùng **VPN** |
| tiến trình lạ tốn RAM, nhiều bản trùng tên khác PID | nghi mã độc → cô lập máy, quét, phân tích |
| `net share` | ADMIN$, C$ là chia sẻ hệ thống; thư mục cá nhân đang share → rủi ro |

Rủi ro = Khả năng × Ảnh hưởng (ghi chú SV; xử lý: Avoid / Mitigate / Transfer / Accept).

## 4 quy tắc loại trừ
1. "luôn luôn / hoàn toàn / tuyệt đối" → thường sai.
2. "tốt nhất" → biện pháp gốc rễ (mã hoá, vá lỗi, mật khẩu mạnh + MFA), không phải biện pháp cực đoan
   ("không dùng Wi-Fi").
3. Hai đáp án gần giống → đáp án thường nằm trong hai câu đó; soi chữ khác.
4. "Đáp án khác" chỉ chọn khi đã tính ra và chắc 3 đáp án kia sai.

## Khi soạn đề luyện
- 40 câu, 4 lựa chọn, phân bố đáp án a/b/c/d cân bằng; có 2 câu Playfair dùng chung đề, 2–3 câu biểu
  thức/hình chứng thực, 1 khối tình huống 10 câu.
- Mọi câu tính phải chạy qua `reference/ciphers.py` trước khi ghi đáp án.
- Ghi rõ đầu file: "Đề luyện tập tự soạn, không phải đề thật".
