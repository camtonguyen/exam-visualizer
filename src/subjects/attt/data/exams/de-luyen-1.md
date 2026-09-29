# Đề luyện tập ATTT — Số 1

> **Đề tự soạn, KHÔNG phải đề thật.** Bám cấu trúc `Đề mẫu.pdf`: 40 câu × 0.25đ, 75 phút,
> chọn 1 đáp án. Khối tình huống (câu 31–40) dùng lại nguyên đoạn tình huống của Đề mẫu (đề mẫu chỉ in
> đoạn tình huống, không in câu hỏi)`.

## PHẦN 1 (câu 01–30)

**01.** Yêu cầu nào sau đây KHÔNG thuộc bốn yêu cầu của dữ liệu được nêu trong bài Tổng quan?
a. Tính bí mật b. Tính toàn vẹn c. Tính không thể từ chối d. Tính ẩn danh

**02.** Kỹ thuật tìm kiếm thông tin hữu ích từ dữ liệu đã mã hoá mà không cần biết khoá giải mã được gọi là:
a. Eavesdropping b. Cryptanalysis c. Intrusion d. Identity Spoofing

**03.** Nhóm kẻ tấn công nào có quyền truy cập hợp pháp vào hệ thống nên rất khó phát hiện và ngăn chặn?
a. Cyber spies b. Script kiddies c. Vicious employees d. Cyber terrorists

**04.** Thành phần nào KHÔNG thuộc mô hình bảo mật cơ bản (4 thành phần)?
a. Hệ thống sao lưu dữ liệu b. Tường lửa (Firewall)
c. Hệ thống phát hiện xâm nhập (IDS) d. Hệ thống phần mềm chống mã độc (AMS)

**05.** Thứ tự đúng các giai đoạn hành động của hacker là:
a. Scanning → Reconnaissance → Gaining Access → Covering Tracks → Maintaining Access
b. Reconnaissance → Gaining Access → Scanning → Maintaining Access → Covering Tracks
c. Gaining Access → Scanning → Reconnaissance → Maintaining Access → Covering Tracks
d. Reconnaissance → Scanning → Gaining Access → Maintaining Access → Covering Tracks

_Dành cho các câu 06, 07:_ Cho m = "AN TOAN THONG TIN", k = "CONGNGHE", giải thuật mã hoá là PlayFair (ma trận 5×5, I ≡ J).

**06.** Trong ma trận khoá 5×5 xây dựng được từ k, ở hàng 2 cột 4 là ký tự:
a. B b. F c. D d. Đáp án khác

**07.** Trong chuỗi ciphertext (c) thu được sau khi mã hoá m với k, ký tự thứ ba của c sẽ là:
a. R b. G c. O d. Đáp án khác

**08.** Mã hoá chuỗi "ATTACK" bằng mã Caesar với khoá k = 3 thu được:
a. DVVDFN b. DWWDFN c. EXXEGO d. Đáp án khác

**09.** Giải thuật mã hoá cổ điển nào có không gian khoá 26! hoán vị?
a. Caesar b. Mã thay thế đơn giản c. Vigenère d. Affine

**10.** Với mã tuyến tính (Affine) e(x) = ax + b (mod 26), khi a = 1 ta được:
a. Mã Hill b. Mã Playfair c. Mã dịch chuyển d. Mã hoán vị bậc d

**11.** Đặc điểm nào đúng với giải thuật DES?
a. Khoá 56 bit, mã hoá khối dữ liệu 64 bit b. Khoá 64 bit, mã hoá khối dữ liệu 56 bit
c. Khoá 128 bit, mã hoá khối dữ liệu 128 bit d. Khoá 56 bit, mã hoá khối dữ liệu 128 bit

**12.** Hàm nào sau đây KHÔNG thuộc các bước xử lý của AES?
a. SubBytes b. ShiftRows c. MixColumns d. Initial Permutation (IP)

**13.** RC4 là đại diện của nhóm giải thuật nào?
a. Mã khối đối xứng b. Mã dòng đối xứng c. Mã bất đối xứng d. Hàm băm

**14.** Trong thực tế, DES và RSA thường được kết hợp như thế nào?
a. RSA mã hoá khối văn bản, DES mã hoá khoá của RSA
b. Cả DES và RSA cùng mã hoá khối văn bản hai lần
c. DES mã hoá khối văn bản, RSA mã hoá khoá mà DES đã dùng
d. RSA chỉ dùng để nén dữ liệu trước khi DES mã hoá

**15.** Xem biểu thức và chọn đáp án phù hợp: A ⇨ B: E(PU_B, M)
a. Chỉ bảo mật b. Bảo mật, chứng thực c. Chứng thực, chữ ký số d. Bảo mật, chứng thực, chữ ký số

**16.** Xem biểu thức và chọn đáp án phù hợp: A ⇨ B: M ‖ E(PR_A, H(M))
a. Chỉ bảo mật b. Bảo mật, chứng thực c. Chứng thực, chữ ký số d. Chỉ chứng thực

**17.** Mô tả sơ đồ: bên gửi băm M được H(M), mã hoá H(M) bằng khoá bí mật chung K rồi gửi kèm M ở dạng rõ;
bên nhận giải mã phần đính kèm bằng K, tự băm lại M và so sánh. Đây là quá trình nào?
a. A → B: E(K, [M ‖ H(M)]) b. A → B: M ‖ H(M ‖ S)
c. A → B: M ‖ E(PR_A, H(M)) d. A → B: M ‖ E(K, H(M))

**18.** Điểm khác nhau cơ bản giữa MAC và hàm băm là:
a. MAC cho kết quả có độ dài thay đổi, hàm băm cho độ dài cố định
b. Hàm băm cần khoá bí mật, MAC thì không
c. MAC chỉ dùng để bảo mật, không dùng để chứng thực
d. MAC dùng khoá bí mật chung, hàm băm không dùng khoá

**19.** Giá trị băm của MD5 có độ dài:
a. 160 bit b. 256 bit c. 128 bit (32 ký tự thập lục phân) d. 64 bit

**20.** Khi kiểm tra chữ ký số, người nhận dùng khoá nào để giải mã chữ ký?
a. Khoá riêng của người nhận b. Khoá công khai của người gửi
c. Khoá riêng của người gửi d. Khoá bí mật chung K

**21.** Kỹ thuật thăm dò nào cho biết thông tin chủ sở hữu tên miền, thông tin liên hệ và name server?
a. WHOIS b. Traceroute c. Ping sweep d. Port scanning

**22.** Bản ghi DNS nào trỏ đến máy chủ thư của tên miền?
a. A b. CNAME c. MX d. PTR

**23.** Mục tiêu chính của giai đoạn quét mạng (scanning) là:
a. Thu thập thông tin nhân viên trên mạng xã hội
b. Xem các phiên bản cũ của website mục tiêu
c. Tìm tài liệu bị vứt bỏ của tổ chức
d. Xác định host đang hoạt động, cổng mở và dịch vụ/hệ điều hành

**24.** Biện pháp phù hợp nhất để hạn chế bị quét cổng là:
a. Công bố sơ đồ mạng lên website để minh bạch
b. Đóng các cổng không cần thiết, cấu hình firewall/IDS chặn gói thăm dò
c. Tắt hoàn toàn máy chủ DNS
d. Chỉ dùng mạng không dây trong công ty

**25.** Trên Windows, mật khẩu người dùng được lưu dưới dạng giá trị băm trong:
a. File SAM b. File hosts c. File boot.ini d. Thư mục Temp

**26.** Biện pháp nào đúng để bảo vệ mật khẩu theo bài học?
a. Dùng cùng một mật khẩu cho mọi tài khoản để dễ nhớ
b. Dùng ngày sinh kết hợp tên thú cưng
c. Không bao giờ đổi mật khẩu để tránh quên
d. Dùng 8–12 ký tự kết hợp chữ hoa, chữ thường, số, ký hiệu và đổi định kỳ

**27.** NTFS Alternate Data Stream (ADS) có thể bị lợi dụng để:
a. Tăng tốc độ ổ cứng b. Giấu dữ liệu vào luồng ẩn của một file có sẵn
c. Mã hoá toàn bộ ổ đĩa d. Tạo bản sao lưu tự động

**28.** Phân tích mã độc tĩnh (Static Analysis) là:
a. Phân tích cấu trúc, chuỗi, bảng import của mẫu mà không chạy mẫu
b. Chạy mẫu trong sandbox và quan sát hành vi
c. Theo dõi lưu lượng mạng khi mẫu đang chạy
d. So sánh registry trước và sau khi chạy mẫu

**29.** Nguyên tắc nào SAI khi phân tích động mã độc trong lab?
a. Tạo snapshot trước khi chạy mẫu b. Dùng mạng giả lập hoặc cô lập mạng
c. Bật shared folder và clipboard giữa VM và máy thật để lấy log nhanh
d. Không đăng nhập tài khoản thật bên trong VM

**30.** Lý do nào KHÔNG phải điểm yếu của WEP?
a. IV chỉ 24 bit nên bị lặp lại b. Dùng CRC-32, không bảo đảm toàn vẹn
c. Dùng khoá tĩnh, chung cho mọi thiết bị d. Dùng AES-CCMP để mã hoá

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

**31.** Lệnh `netstat -ano` được dùng để:
a. Xem các kết nối/cổng đang mở kèm PID của tiến trình b. Xem phiên bản Windows
c. Liệt kê tài khoản người dùng d. Liệt kê thư mục đang chia sẻ

**32.** Cổng 3389 đang mở tương ứng với dịch vụ:
a. SMB b. Remote Desktop (RDP) c. SSH d. HTTPS

**33.** Nhiều sự kiện 4625 từ cùng một địa chỉ IP cho thấy:
a. Hệ thống vừa được cập nhật bản vá b. Một tài khoản vừa được tạo mới
c. Có nhiều lần đăng nhập thất bại — dấu hiệu đang bị dò mật khẩu d. Máy vừa khởi động lại

**34.** Biện pháp phù hợp nhất đối với dấu hiệu ở câu 33 là:
a. Cấu hình chính sách khoá tài khoản (Account Lockout Policy), chặn IP nguồn và dùng mật khẩu mạnh
b. Tắt Security Log để tránh đầy ổ đĩa
c. Bật tài khoản Guest để phân tán đăng nhập
d. Mở thêm cổng 3389 cho người dùng từ xa

**35.** Lệnh nào dùng để vô hiệu hoá tài khoản Guest?
a. net share guest /delete b. whoami /guest
c. net user guest /add d. net user guest /active:no

**36.** Việc một tài khoản nhân viên đột ngột được thêm vào nhóm Administrators là dấu hiệu của:
a. Xoá dấu vết b. Leo thang đặc quyền c. Thăm dò (Footprinting) d. Tấn công từ chối dịch vụ

**37.** Mật khẩu "Company2025" bị xem là yếu chủ yếu vì:
a. Quá dài so với quy định b. Có chứa chữ in hoa
c. Theo mẫu dễ đoán (tên công ty + năm), dễ bị tấn công từ điển kết hợp (hybrid) d. Không chứa chữ thường

**38.** Nhân viên truy cập hệ thống công ty qua Wi-Fi miễn phí ở sân bay nên:
a. Kết nối qua VPN để mã hoá dữ liệu truyền b. Tắt tường lửa để kết nối nhanh hơn
c. Chia sẻ thư mục làm việc lên mạng Wi-Fi đó d. Dùng mạng Open System vì không cần mật khẩu

**39.** Hotspot dùng WPA2 với mật khẩu "12345678" có vấn đề chính là:
a. WPA2 dùng IV 24 bit như WEP b. WPA2 không hỗ trợ mã hoá
c. Hotspot cá nhân luôn an toàn tuyệt đối d. Chuẩn chấp nhận được nhưng mật khẩu quá yếu, cần đổi mật khẩu mạnh (hoặc dùng WPA3)

**40.** Với máy có tiến trình lạ chiếm gần 2 GB RAM và nhiều tiến trình trùng tên khác PID, bước phản ứng đầu tiên phù hợp là:
a. Tiếp tục sử dụng bình thường và theo dõi thêm vài tuần
b. Cô lập máy khỏi mạng để tránh lây lan, sau đó quét và phân tích
c. Gửi file nghi ngờ qua email cho toàn công ty để cùng kiểm tra
d. Tắt phần mềm diệt virus trên máy thật để tiến trình chạy ổn định

---

## Đáp án & giải thích

| Câu | Đáp án | Giải thích (nguồn)                                                                                                       |
| --- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| 01  | d      | 4 yêu cầu: bí mật, toàn vẹn, không thể từ chối, sẵn sàng (Bài 1)                                                         |
| 02  | b      | Định nghĩa Cryptanalysis (Bài 1)                                                                                         |
| 03  | c      | Vicious employees có quyền hợp pháp → khó phát hiện (Bài 1)                                                              |
| 04  | a      | 4 thành phần: Cryptosystem, Firewall, AMS, IDS (Bài 1)                                                                   |
| 05  | d      | Thăm dò → Quét → Chiếm quyền → Duy trì → Xoá dấu vết                                                                     |
| 06  | c      | Ma trận `CONGH / EABDF / IKLMP / QRSTU / VWXYZ` → hàng 2 cột 4 = D                                                       |
| 07  | a      | AN TO … → AN: A(2,2) N(1,3) chéo → B O; TO: T(4,4) O(1,2) chéo → R G. c = BORG… → ký tự 3 = R (c đầy đủ: BORGBOUGNGDYLC) |
| 08  | b      | A→D, T→W, C→F, K→N → DWWDFN                                                                                              |
| 09  | b      | Khoá = hoán vị của bảng chữ cái → 26! (Bài 2A)                                                                           |
| 10  | c      | Slide: "Nếu a = 1 ta có mã dịch chuyển"                                                                                  |
| 11  | a      | DES: khoá 56 bit, khối 64 bit                                                                                            |
| 12  | d      | AES gồm SubBytes, ShiftRows, MixColumns, AddRoundKey; IP là của DES                                                      |
| 13  | b      | Stream cipher, đại diện RC4 (Bài 2A)                                                                                     |
| 14  | c      | DES mã khối văn bản, RSA mã khoá DES (Bài 2A)                                                                            |
| 15  | a      | PU_B chỉ B giải được → chỉ bảo mật, không chứng thực                                                                     |
| 16  | c      | PR_A ký H(M) → chứng thực + chữ ký số; M gửi rõ → không bảo mật                                                          |
| 17  | d      | Dạng (b) công dụng hàm băm: M ‖ E(K, H(M)) → chứng thực                                                                  |
| 18  | d      | MAC = C(K, M) có khoá; hash không khoá (Bài 2B)                                                                          |
| 19  | c      | MD5 128 bit, 32 ký tự hex                                                                                                |
| 20  | b      | Kiểm tra bằng khoá công khai người gửi                                                                                   |
| 21  | a      | WHOIS trả về domain, liên hệ, name server, NetRange                                                                      |
| 22  | c      | MX = mail server                                                                                                         |
| 23  | d      | Scanning: host, cổng, dịch vụ (Bài 3B)                                                                                   |
| 24  | b      | Đóng cổng thừa + firewall/IDS                                                                                            |
| 25  | a      | `C:\Windows\System32\config\SAM` (Bài 4)                                                                                 |
| 26  | d      | Quy tắc bảo vệ mật khẩu (Bài 4)                                                                                          |
| 27  | b      | ADS giấu dữ liệu trong luồng phụ (Bài 4, Ẩn file)                                                                        |
| 28  | a      | Tĩnh = không chạy mẫu (Bài 5)                                                                                            |
| 29  | c      | Phải tắt shared folder/clipboard/drag-drop (Bài 5)                                                                       |
| 30  | d      | AES-CCMP là của WPA2, không phải điểm yếu WEP (Bài 6)                                                                    |
| 31  | a      | Lab Bài 2: LISTENING = cổng mở, cột PID                                                                                  |
| 32  | b      | 3389 = RDP; 445 = SMB                                                                                                    |
| 33  | c      | 4625 = đăng nhập thất bại (ghi chú SV)                                                                                   |
| 34  | a      | Khoá tài khoản sau nhiều lần sai + chặn IP + mật khẩu mạnh                                                               |
| 35  | d      | Lab Bài 2, Cách 1                                                                                                        |
| 36  | b      | Chiếm thêm quyền quản trị = leo thang đặc quyền (Bài 4)                                                                  |
| 37  | c      | Mẫu dễ đoán; hybrid = từ điển + thêm số/ký hiệu                                                                          |
| 38  | a      | Wi-Fi công cộng → VPN                                                                                                    |
| 39  | d      | WPA2 (AES) ổn, điểm yếu là mật khẩu                                                                                      |
| 40  | b      | Kỹ thuật phản ứng: cô lập endpoint bị nhiễm (Bài 5)                                                                      |

Phân bố đáp án: a 10 · b 10 · c 10 · d 10.
