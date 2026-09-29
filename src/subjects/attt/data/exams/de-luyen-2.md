# Đề luyện tập ATTT — Số 2

> **Đề tự soạn, KHÔNG phải đề thật.** Bám cấu trúc `Đề mẫu.pdf`: 40 câu × 0.25đ, 75 phút,
> chọn 1 đáp án. Khối tình huống (câu 31–40) dùng lại nguyên đoạn tình huống của Đề mẫu nhưng hỏi các
> dấu hiệu khác với Đề luyện 1.`

## PHẦN 1 (câu 01–30)

**01.** Tấn công từ chối dịch vụ được phát động đồng thời từ một đội quân máy tính zombie (botnet) được gọi là:
a. Smurf b. DDoS c. Teardrop d. Ping of death

**02.** Trong tấn công Smurf, kẻ tấn công:
a. Gửi nhiều gói ICMP echo đến nhiều máy, với địa chỉ IP nguồn được thay bằng IP của nạn nhân
b. Gửi các gói tin bị phân mảnh chồng lấn lên nhau đến nạn nhân
c. Chiếm đoạt một kết nối TCP đang hoạt động giữa hai máy
d. Thay đổi địa chỉ MAC trong bảng ARP của máy nạn nhân

**03.** Điểm khác biệt chính giữa Worm và Virus là:
a. Worm chỉ lây qua USB, virus chỉ lây qua mạng
b. Worm cần người dùng mở file mới hoạt động, virus thì không
c. Worm tự nhân bản và tự lây lan qua mạng mà không cần gắn vào file khác
d. Worm không gây hại, chỉ làm chậm máy

**04.** Đoạn mã độc được cài sẵn và chỉ kích hoạt khi một điều kiện xảy ra (VD: tài khoản của người cài bị xoá) là:
a. Backdoor b. Spyware c. Trojan horse d. Logic bomb

**05.** Trong mô hình phòng thủ theo chiều sâu (Defense in Depth), lớp trong cùng cần bảo vệ là:
a. Perimeter b. Physical c. Policies, Procedures & Awareness d. Data

_Dành cho các câu 06, 07:_ Cho m = "BAO MAT DU LIEU", k = "HOCVIEN", giải thuật mã hoá là PlayFair (ma trận 5×5, I ≡ J).

**06.** Trong ma trận khoá 5×5 xây dựng được từ k, ở hàng 3 cột 2 là ký tự:
a. K b. F c. G d. Đáp án khác

**07.** Trong chuỗi ciphertext (c) thu được sau khi mã hoá m với k, ký tự thứ ba và thứ tư của c lần lượt là:
a. I, G b. G, I c. O, M d. Đáp án khác

**08.** Mã hoá chuỗi "ATTACK" bằng mã Vigenère với khoá k = "LEMON" thu được:
a. LXFOPW b. LXFOPV c. MXGOPV d. Đáp án khác

**09.** Phương pháp phá mã cổ điển chủ yếu dựa vào:
a. Độ dài khoá của giải thuật DES
b. Tần suất xuất hiện của các chữ cái và đặc điểm ngôn ngữ
c. Tốc độ xử lý của máy chủ RSA
d. Giá trị băm MD5 của bản rõ

**10.** Giải thuật AES (Rijndael) được đề xuất bởi:
a. Ron Rivest (MIT) b. Cục An ninh quốc gia Mỹ (NSA)
c. Joan Daemen và Vincent Rijmen (Bỉ) d. Biham và Shamir

**11.** Kích thước khoá nào KHÔNG được AES hỗ trợ?
a. 128 bit b. 192 bit c. 256 bit d. 56 bit

**12.** Tấn công vét cạn (brute-force) khoá DES phải thử tối đa bao nhiêu khoá?
a. 2^56 b. 2^64 c. 2^128 d. 26!

**13.** Trong hệ mã hoá công khai RSA, khi dùng để giữ bí mật thông điệp gửi cho B:
a. Mã hoá bằng khoá bí mật của B, giải mã bằng khoá công khai của B
b. Mã hoá bằng khoá công khai của B, giải mã bằng khoá bí mật của B
c. Cả hai bên dùng chung một khoá bí mật
d. Mã hoá bằng khoá công khai của A, giải mã bằng khoá công khai của B

**14.** Xem biểu thức và chọn đáp án phù hợp: A ⇨ B: E(PR_A, M)
a. Chỉ bảo mật b. Bảo mật, chứng thực c. Chứng thực, chữ ký số d. Bảo mật, chứng thực, chữ ký số

**15.** Xem biểu thức và chọn đáp án phù hợp: A ⇨ B: E(K2, M) ‖ C(K1, E(K2, M))
a. Chỉ bảo mật b. Bảo mật, chứng thực c. Chứng thực, chữ ký số d. Chỉ chứng thực

**16.** Xem biểu thức và chọn đáp án phù hợp: A ⇨ B: M ‖ C(K, M)
a. Chỉ bảo mật b. Bảo mật, chứng thực c. Chứng thực, chữ ký số d. Chỉ chứng thực

**17.** Giải thuật SHA-1 trả về giá trị băm có độ dài:
a. 160 bit b. 128 bit c. 224 bit d. 512 bit

**18.** Để tạo được dấu vân tay kỹ thuật số tốt, hàm băm mật mã (CHF) cần có:
a. Khả năng giải ngược để lấy lại thông điệp gốc
b. Đầu ra có độ dài thay đổi theo đầu vào
c. Thuộc tính một chiều và thuộc tính duy nhất (kháng đụng độ)
d. Sử dụng khoá bí mật chung giữa hai bên

**19.** Khi tạo chữ ký số, sau khi băm thông điệp thành message digest, người gửi:
a. Mã hoá digest bằng khoá công khai của người nhận
b. Mã hoá digest bằng khoá bí mật chung K
c. Gửi digest ở dạng rõ, không mã hoá
d. Mã hoá digest bằng khoá riêng (private key) của mình

**20.** Nhược điểm của việc chứng thực bằng khoá bí mật chung K (hoặc MAC) so với chữ ký số là:
a. Không phát hiện được thông điệp bị sửa đổi
b. Người gửi có thể chối bỏ vì bên nhận cũng có cùng khoá K
c. Tốc độ chậm hơn RSA hàng ngàn lần
d. Không thể dùng cho thông điệp dài

**21.** Toán tử Google nào giới hạn kết quả tìm kiếm trong một tên miền cụ thể?
a. site: b. intitle: c. inurl: d. cache:

**22.** Kỹ thuật quét Stealth (Half-open) diễn ra theo trình tự:
a. SYN → SYN/ACK → ACK b. FIN → không phản hồi
c. SYN → SYN/ACK → RST d. ACK → RST

**23.** Xmas scan gửi gói TCP có bật các cờ:
a. Chỉ SYN b. Không bật cờ nào c. Chỉ ACK d. FIN, URG, PSH

**24.** Kẻ tấn công sử dụng proxy server chủ yếu nhằm:
a. Che giấu địa chỉ IP nguồn, khiến nạn nhân khó truy vết
b. Tăng tốc độ quét cổng
c. Mã hoá ổ cứng của nạn nhân
d. Bẻ khoá WEP nhanh hơn

**25.** Tấn công mật khẩu bằng cách so sánh hash bắt được với bảng hash đã tính sẵn gọi là:
a. Brute-force b. Rainbow attack c. Syllable attack d. Shoulder surfing

**26.** Shoulder surfing thuộc nhóm tấn công mật khẩu nào?
a. Passive online b. Active online c. Non-electronic d. Offline

**27.** Kỹ thuật leo thang đặc quyền Sticky Keys thay thế file nào bằng cmd.exe?
a. explorer.exe b. svchost.exe c. lsass.exe d. sethc.exe

**28.** Kỹ thuật nén hoặc mã hoá mã độc để làm khó phân tích và né phần mềm diệt virus gọi là:
a. Packing b. Persistence c. Lateral movement d. Exfiltration

**29.** Mã độc tạo khoá trong `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` nhằm mục đích:
a. Đánh cắp dữ liệu ra ngoài
b. Duy trì hiện diện (persistence), tự chạy lại sau khi khởi động máy
c. Phát hiện máy ảo
d. Mã hoá file của người dùng

**30.** Phát biểu nào đúng về SSID?
a. Tối đa 64 ký tự và không phân biệt hoa/thường
b. Mỗi Access Point chỉ phát được một SSID
c. Tối đa 32 ký tự và phân biệt chữ hoa/chữ thường
d. SSID ẩn (Hidden) giúp mạng an toàn tuyệt đối

## PHẦN 2 — Tình huống (câu 31–40)

Một doanh nghiệp vừa triển khai hệ thống làm việc kết hợp (Hybrid Working). Nhân viên có thể làm việc tại
văn phòng hoặc từ xa thông qua Internet. Trong một buổi kiểm tra định kỳ, bộ phận An toàn thông tin phát hiện:

- Một máy tính Windows có tiến trình lạ chiếm gần 2 GB RAM.
- Trong Task Manager xuất hiện nhiều tiến trình có tên tương tự nhau nhưng khác PID.
- Kết quả `netstat -ano` cho thấy cổng 445 và 3389 đang mở.
- Tài khoản Guest đang được kích hoạt.
- Một số nhân viên sử dụng mật khẩu đơn giản như "Company2025".
- Firewall bị tắt trên mạng Public.
- Security Log xuất hiện nhiều sự kiện 4625 từ cùng một địa chỉ IP.
- Một tài khoản nhân viên vừa được thêm vào nhóm Administrators.
- Một hotspot cá nhân được cấu hình WPA2 nhưng sử dụng mật khẩu "12345678".
- Một nhân viên thường xuyên sử dụng Wi-Fi miễn phí ở sân bay để truy cập hệ thống công ty.

**31.** Để xác minh tiến trình lạ chiếm gần 2 GB RAM, cách làm phù hợp nhất là:
a. Xoá ngay file thực thi trong thư mục System32
b. Khởi động lại máy nhiều lần cho đến khi tiến trình biến mất
c. Tắt Task Manager để tiết kiệm RAM
d. Dùng Process Explorer xem đường dẫn file, nhà phát hành, chữ ký số và đối chiếu VirusTotal

**32.** Trong số các tiến trình có tên tương tự nhau, dấu hiệu nào đáng ngờ nhất?
a. Tên gần giống tiến trình hệ thống nhưng sai chính tả (VD: svch0st.exe) và chạy từ thư mục Temp/AppData
b. Có nhiều tiến trình svchost.exe nằm trong C:\Windows\System32
c. Trình duyệt Chrome sinh ra nhiều tiến trình con
d. Tiến trình có chữ ký số hợp lệ của Microsoft

**33.** Cổng 445 đang mở tương ứng với dịch vụ nào và thường bị họ mã độc nào khai thác?
a. RDP — Brute-force
b. SMB — EternalBlue / WannaCry
c. HTTP — SQL Injection
d. SSH — Dò mật khẩu tự động

**34.** Firewall tắt trên profile Public nguy hiểm nhất vì:
a. Làm máy chạy chậm hơn khi ở văn phòng
b. Làm mất kết nối Internet
c. Profile Public được dùng khi kết nối Wi-Fi công cộng, máy bị lộ các dịch vụ đang mở ra mạng lạ
d. Khiến tài khoản Guest tự động bật

**35.** Lệnh nào kiểm tra trạng thái tường lửa trên cả 3 profile (Domain/Private/Public)?
a. ipconfig /all
b. net share
c. whoami /groups
d. netsh advfirewall show allprofiles state

**36.** Để kiểm tra những tài khoản nào đang thuộc nhóm Administrators, dùng lệnh:
a. net localgroup Administrators
b. net user guest /active:no
c. systeminfo
d. tasklist

**37.** Sự kiện Security Log nào ghi nhận một tài khoản đã bị khoá do nhập sai quá số lần cho phép?
a. 4624 b. 4740 c. 4625 d. 4720

**38.** Nếu đặt Account lockout threshold quá thấp (VD: 3 lần), rủi ro chính là:
a. Kẻ tấn công được thử mật khẩu không giới hạn
b. Security Log không ghi được sự kiện 4625
c. Người dùng hợp lệ dễ bị khoá, kẻ tấn công có thể cố tình gây khoá hàng loạt (từ chối dịch vụ)
d. Mật khẩu tự động bị đổi về mặc định

**39.** Cấu hình hotspot an toàn theo bài thực hành Wi-Fi là:
a. Security: Open, không đặt mật khẩu để dễ kết nối
b. Security: WEP, mật khẩu 8 số
c. Bật WPS để kết nối nhanh bằng mã PIN
d. Security: WPA2 hoặc WPA3, mật khẩu từ 12 ký tự trở lên

**40.** Sau khi kết nối laptop vào hotspot, lệnh nào hiển thị SSID, kiểu chứng thực và Cipher (VD: AES) đang dùng?
a. netsh wlan show interfaces
b. netstat -ano
c. net user
d. winver

---

## Đáp án & giải thích

| Câu | Đáp án | Giải thích (nguồn)                                                                                              |
| --- | ------ | --------------------------------------------------------------------------------------------------------------- |
| 01  | b      | DDoS dùng nhiều máy zombie (botnet) (Bài 1)                                                                     |
| 02  | a      | Smurf: ping hàng loạt với IP nguồn giả là IP nạn nhân → nạn nhân ngập ICMP reply (Bài 1)                        |
| 03  | c      | Worm tự nhân bản, tự lây qua mạng; virus phải gắn vào file (Bài 1)                                              |
| 04  | d      | Logic bomb kích hoạt theo điều kiện; ví dụ nhân viên bất mãn (Bài 1)                                            |
| 05  | d      | Các lớp: Policies → Physical → Perimeter → Internal Network → Host → Application → Data (Bài 1)                 |
| 06  | c      | Ma trận `HOCVI / ENABD / FGKLM / PQRST / UWXYZ` → hàng 3 cột 2 = G                                              |
| 07  | a      | Cặp: BA OM AT DU LI EU. OM: O(1,2) M(3,5) chéo → I, G. c đầy đủ: DBIGDREZMVFH → ký tự 3–4 = I, G                |
| 08  | b      | A+L=L, T+E=X, T+M=F, A+O=O, C+N=P, K+L=V → LXFOPV                                                               |
| 09  | b      | Phá mã cổ điển dựa vào đặc điểm ngôn ngữ và tần suất chữ cái (Bài 2A)                                           |
| 10  | c      | AES do Daemen và Rijmen (Bỉ) đề xuất (Bài 2A)                                                                   |
| 11  | d      | AES-128/192/256; 56 bit là khoá DES                                                                             |
| 12  | a      | Khoá 56 bit → 2^56 ≈ 7.2 × 10^16 khoá (bảng vét cạn Bài 2A)                                                     |
| 13  | b      | Khoá công khai để mã hoá, chỉ khoá bí mật tương ứng giải mã được (Bài 2A)                                       |
| 14  | c      | PR_A → chỉ A tạo được → chứng thực + chữ ký số; ai cũng giải được bằng PU_A → không bảo mật                     |
| 15  | b      | MAC dạng (c): K2 bảo mật, K1 chứng thực (Bài 2B)                                                                |
| 16  | d      | MAC dạng (a): M gửi rõ + MAC → chỉ chứng thực                                                                   |
| 17  | a      | SHA-1: 160 bit (Bài 2B)                                                                                         |
| 18  | c      | Một chiều + duy nhất → hàm băm mật mã CHF (Bài 2B)                                                              |
| 19  | d      | Ký: mã hoá digest bằng private key người gửi (thường RSA) (Bài 2B)                                              |
| 20  | b      | Ví dụ Alice–Bob: dùng chung K nên Alice có thể chối (Bài 2B)                                                    |
| 21  | a      | `site:` giới hạn trong tên miền (Bài 3A)                                                                        |
| 22  | c      | Half-open: SYN, nhận SYN/ACK, gửi RST trước khi hoàn tất kết nối (Bài 3B)                                       |
| 23  | d      | Xmas: FIN + URG + PSH; NULL: không cờ (Bài 3B)                                                                  |
| 24  | a      | Proxy giấu IP nguồn, log nạn nhân chỉ thấy IP proxy (Bài 3B)                                                    |
| 25  | b      | Rainbow = pre-computed hash (Bài 4)                                                                             |
| 26  | c      | Non-electronic: shoulder surfing, social engineering, dumpster diving (Bài 4)                                   |
| 27  | d      | Thay sethc.exe bằng cmd.exe, nhấn Shift 5 lần (Bài 4)                                                           |
| 28  | a      | Packing: nén/mã hoá mã độc (Bài 5)                                                                              |
| 29  | b      | Run key = persistence (Bài 5)                                                                                   |
| 30  | c      | SSID ≤ 32 ký tự, phân biệt hoa/thường (Bài 6)                                                                   |
| 31  | d      | Tên lạ chưa chắc là mã độc → kiểm tra đường dẫn, chữ ký số, VirusTotal (Lab RAM)                                |
| 32  | a      | Tên sai chính tả + chạy ngoài System32/Program Files là đáng ngờ; nhiều svchost là bình thường (Lab 2, Lab RAM) |
| 33  | b      | 445 = SMB, họ EternalBlue/WannaCry (Hướng dẫn Lab 2)                                                            |
| 34  | c      | Public = profile dùng ở quán cà phê, sân bay (Hướng dẫn Lab 2)                                                  |
| 35  | d      | `netsh advfirewall show allprofiles state` (Hướng dẫn Lab 2)                                                    |
| 36  | a      | `net localgroup Administrators` (Hướng dẫn Lab 2)                                                               |
| 37  | b      | 4740 = tài khoản bị khoá; 4625 = đăng nhập thất bại (Lab 3)                                                     |
| 38  | c      | Câu hỏi báo cáo Lab 3: threshold thấp → người dùng hợp lệ dễ bị khoá                                            |
| 39  | d      | Lab Wi-Fi Bài 4: WPA2/WPA3, mật khẩu ≥ 12 ký tự                                                                 |
| 40  | a      | Lab Wi-Fi Bài 5: `netsh wlan show interfaces` xem Cipher                                                        |

Phân bố đáp án: a 10 · b 10 · c 10 · d 10.
