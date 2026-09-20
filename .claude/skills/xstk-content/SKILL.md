---
name: xstk-content
description: Use whenever implementing or reviewing an algorithm module (Bayes, continuous density, normal distribution, confidence interval, hypothesis test, Student-t, regression, joint distribution) for the XSTK subject in this repo. Packages the exact verified exam data and core formulas so you don't re-derive or re-verify them from the source markdown files.
---

# XSTK (Xác suất Thống kê) domain knowledge

This is a **subject-scoped** skill (XSTK only). Other subjects get their own
`.claude/skills/<subject>-content/SKILL.md` — see `docs/ADDING_A_SUBJECT.md`. Don't add
non-XSTK facts here.

Source material: `docs/xstk/files/*.md` — 5 hướng dẫn giải chi tiết (kèm cách bấm máy
Casio fx-880BTG cho từng bước), transcribed từ PDF/ảnh gốc:
`citd_hk1_2025_2026_de1.md`, `citd_hk1_2025_2026_de2.md` (CITD HK1 2025-2026, có đáp án
đầy đủ), `de1_uicd_2025.md`, `de2_uicd_2025.md` (UICD 2025, có đáp án), và
`ck_xstk_hk2_2023_2024.md` (đề khác kỳ — giới thiệu 2 dạng bài KHÔNG xuất hiện ở 4 đề
kia: phân phối đồng thời, kiểm định/ước lượng bằng Student-t). Mọi số liệu dưới đây đã
đối chiếu trực tiếp với các file này, không chỉ tin số cho sẵn.

## 10 dạng bài (1 dạng = 1 module) — đã loại "biến ngẫu nhiên rời rạc/nhị thức"

Lượt trước liệt kê nhầm 1 dạng "biến ngẫu nhiên rời rạc (nhị thức)" — dạng này KHÔNG
xuất hiện trong bất kỳ đề nào trong 5 file nguồn, đã loại khỏi danh sách.

| # | Module (`id`) | Nguồn |
|---|---|---|
| 1 | `bayes` | MỌI đề (CITD Đề1,2; UICD Đề1,2), Câu 1 |
| 2 | `continuous-density` | CITD Đề1,2 (bậc 3); UICD Đề1 (bậc 1); UICD Đề2 (bậc 2) |
| 3 | `normal-distribution` | CITD Đề1,2; UICD Đề1,2 — 4 kiểu câu hỏi |
| 4 | `ci-known-sigma` | UICD Đề1,2, Câu 4 — biết σ, + cỡ mẫu tối thiểu |
| 5 | `ci-sample-proportion` | CITD Đề1,2, Câu 4 — từ bảng tần số ghép nhóm |
| 6 | `hypothesis-proportion` | UICD Đề1,2 (2 phía); CK HK2 2023-2024 Câu3a (1 phía trái) |
| 7 | `t-distribution` | CK HK2 2023-2024 Câu4 — chưa biết σ, n nhỏ |
| 8 | `regression` | CITD Đề1,2; CK HK2 2023-2024 Câu5 (thiếu dữ liệu gốc) |
| 9 | `joint-discrete` | CK HK2 2023-2024 Câu1 |
| 10 | `joint-continuous` | CK HK2 2023-2024 Câu2 |

**Trạng thái (lượt 2026-09-15, đợt 4)**: ✅ đủ 10/10 module đã code (Giai đoạn 1 + 2
hoàn tất). Việc còn lại (nếu có) chỉ là bảo trì hoặc thêm ví dụ mới nếu có đề khác.

**KHÔNG dùng canvas/animation cho module nào** (quyết định đợt 3, xem
`docs/decisions.md`) — mỗi module hiển thị "từng bước giải" dạng text (`StepPlayer`)
+ `TipCallout` (mẹo) + `CalculatorTip` (bấm máy) + `AnswerKeyPanel` (ghi vào bài làm,
format theo `docs/xstk/Dap an.jpg`). 5 canvas viết ở đợt 2 đã bị XÓA — xem mục "Kiến
trúc riêng của XSTK" ở cuối file này.

## Công thức cốt lõi mỗi dạng

- **Bayes**: P(B) = Σ P(Ai)·P(B\|Ai) (xác suất toàn phần). P(Ai\|B) =
  P(Ai)·P(B\|Ai)/P(B). Có 2 biến thể câu hỏi: **đơn giản** (P(Ai\|B), 1 nhánh) và
  **mở rộng** (gộp nhiều Ai ở tử số, và/hoặc điều kiện theo B̄ thay vì B) — cùng 1
  `BayesSpec`/`runBayes` xử lý cả 2 qua `targetEventIds: string[]` +
  `conditionOnComplement: boolean`, không cần nhánh code riêng.
- **Mật độ liên tục — tìm K**: ∫f(x)dx=1 trên miền xác định. f(x,k) LUÔN tuyến tính
  theo k (k nhân toàn biểu thức, HOẶC k chỉ là hằng số cộng thêm) → giải bằng tích phân
  số tại k=0 và k=1 rồi suy hệ số tuyến tính, không cần đại số ký hiệu riêng cho từng
  bậc đa thức. Cận âm/vượt miền xác định → f(x)=0 ngoài miền, phải "cắt" cận trước khi
  tích phân.
- **Phân phối chuẩn**: Z=(X-μ)/σ. Φ(z)=P(Z<z). "Nhóm k% cao nhất" ⇔ P(X>x₀)=k% ⇔
  φ(z)=1-k (đổi trước khi tra ngược) — lỗi hay gặp nhất là quên đổi chiều này.
- **Khoảng tin cậy cho μ (biết σ)**: ε=z_{α/2}·σ/√n. Cỡ mẫu tối thiểu:
  n≥(z_{α/2}·σ/E)², LUÔN làm tròn LÊN.
- **Khoảng tin cậy cho μ (CHƯA biết σ, n nhỏ)**: dùng Student-t, df=n-1:
  ε=t_{α/2,df}·s/√n (s = độ lệch chuẩn MẪU, không phải σ tổng thể).
  Dấu hiệu nhận biết: đề KHÔNG cho σ, phải tự tính từ dữ liệu mẫu.
- **Khoảng tin cậy cho tỷ lệ p**: ε=z_{α/2}·√(f(1-f)/n) — khác công thức ε=z·σ/√n của
  ước lượng μ (dùng f thay σ, không có "biết trước" tổng thể nào cho tỷ lệ).
- **Kiểm định tỷ lệ**: Z=(f-p0)/√(p0(1-p0)/n). 1 phía (đề nêu rõ "lớn hơn"/"nhỏ hơn")
  dùng z_α, miền bác bỏ 1 đuôi; 2 phía (đề nói "khác với"/không nêu hướng) dùng z_{α/2},
  bác bỏ nếu \|Z\|>z_{α/2}.
- **Kiểm định trung bình bằng Student-t**: t=(x̄-μ0)/(s/√n), so với t_{α,df} hoặc
  t_{α/2,df}, df=n-1.
- **Phân phối đồng thời rời rạc**: biên P(X=x)=Σ_y P(X=x,Y=y). Độc lập ⇔ P(X=x,Y=y) =
  P(X=x)·P(Y=y) MỌI (x,y) — chỉ cần tìm 1 ô lệch là đủ kết luận KHÔNG độc lập.
- **Phân phối đồng thời liên tục**: mật độ biên fX(x)=∫f(x,y)dy. 2 công thức điều kiện
  KHÁC NHAU, dễ nhầm nhất: điều kiện tại 1 GIÁ TRỊ (X=x₀) dùng mật độ có điều kiện
  fY(y\|x₀)=f(x₀,y)/fX(x₀); điều kiện trên 1 KHOẢNG (X>x₀) dùng P(B\|A)=P(A∩B)/P(A) với
  tích phân kép — KHÔNG dùng mật độ có điều kiện cho trường hợp khoảng.

## 1. Bayes — số liệu đã verify (`data/bayesExamples.ts`)

- **CITD Đề1, Câu1**: 3 ca sáng/chiều/tối, tỷ lệ 40%/45%/15%, phế phẩm theo ca
  5%/8%/16%. P(phế phẩm)=8%. Câu hỏi Bayes: "không phải ca tối, biết không phế phẩm" =
  Bayes MỞ RỘNG, gộp (sáng+chiều) ở tử số, điều kiện theo phần bù: [(0.4×0.95+
  0.45×0.92)]/0.92 ≈ 86.30%.
- **CITD Đề2, Câu1**: 3 phân xưởng I/II/III, tỷ lệ 36%/40%/24%, phế phẩm 10%/8%/12%.
  P(phế phẩm)=9.68%. "Không phải PX III, biết không phế phẩm" (gộp I+II, điều kiện
  phần bù): [(0.36×0.9+0.4×0.92)]/(1-0.0968) ≈ 76.62%.
- **UICD Đề1, Câu1**: 3 đơn vị A/B/C, tỷ lệ 70%/20%/10%, lỗi 3%/5%/7%. P(lỗi)=3.8%.
  Câu hỏi: "Đơn vị A, biết lỗi" = Bayes ĐƠN GIẢN (1 nhánh, điều kiện theo B trực tiếp,
  KHÔNG gộp, KHÔNG điều kiện phần bù): P(A\|L)=0.021/0.038≈55.26%.
- **UICD Đề2, Câu1**: 3 nhà cung cấp X/Y/Z, tỷ lệ 50%/30%/20%, lỗi 2%/4%/5%.
  P(lỗi)=3.2%. "Nhà cung cấp Y, biết lỗi": P(Y\|D)=0.012/0.032=37.5%.
- `BayesSpec` xử lý cả 2 kiểu (đơn giản/mở rộng) bằng đúng 3 field:
  `targetEventIds: string[]` (1 id = đơn giản, nhiều id = mở rộng),
  `conditionOnComplement: boolean` (false = điều kiện theo B, true = theo B̄). Node id
  quy ước trong `ProbabilityTreeCanvas`: "root", mỗi `PartitionEvent.id`, lá
  `${ai.id}::b`/`${ai.id}::notb`. Edge id: `root->${ai.id}`, `${ai.id}->b`,
  `${ai.id}->notb` — đọc kỹ trước khi sửa `engine/bayes.ts` hoặc canvas, 2 file phải
  khớp id.

## 2. Mật độ liên tục — số liệu đã verify (`data/continuousDensityExamples.ts`)

- **CITD Đề1**: f(x)=K(x³/4+x+1/6), [0,6]. K=1/100=0.01. E(X)=2319/500=4.638.
  Var(X)≈1.288956. P(-3≤X≤4): cận -3 ngoài [0,6] nên f(x)=0 ở đó, chỉ tính ∫₀⁴ =
  37/150≈24.67%.
- **CITD Đề2**: f(x)=K(12x³/25+2x/3+10/3), [0,5]. K=0.01. E(X)=133/36≈3.6944.
  Var(X)=1661/1296≈1.281635802. P(-4≤X≤1): cận -4 ngoài [0,5], chỉ tính ∫₀¹ =
  71/1875≈3.79%.
- **UICD Đề1**: f(x)=K-x/450, [0,30] (bậc 1 — K chỉ là hằng số CỘNG THÊM, không nhân
  toàn biểu thức). K=1/15≈0.0667. E(X)=10 (tháng). P(X≥15)=∫₁₅³⁰=25%. KHÔNG có Var(X)
  trong đáp án gốc.
- **UICD Đề2**: f(x)=K(4x-x²), [0,4] (bậc 2). K=3/32. E(X)=2 (triệu đồng). P(X>3)=
  ∫₃⁴=5/32≈15.625%. KHÔNG có Var(X) trong đáp án gốc.
- `ContinuousDensitySpec.fn(x,k)` PHẢI tuyến tính theo k — `runContinuousDensity` giải
  bằng Simpson's rule tại k=0 và k=1 (∫fn(x,0)dx=B, ∫fn(x,1)dx=A+B, k=(1-B)/A), đúng
  cho cả 2 dạng "K nhân toàn biểu thức" (CITD) và "K là hằng số cộng thêm" (UICD Đề1) —
  không cần nhánh code riêng theo bậc đa thức. `verifiedVariance` optional trong type vì
  2 đề UICD không cho sẵn — khi thiếu, engine vẫn tính (đúng toán từ f(x) đã verify)
  nhưng không so với "đáp án đề" trong narration.

## 3. Phân phối chuẩn — số liệu đã verify (`data/normalExamples.ts`)

- **CITD Đề1** — bàn phím, N(3500,350²) giờ, bảo hành nếu X<2800: P(X<2800)=φ(-2)≈
  2.275% (`cdf-left`, z=-2 tròn). Tìm T để tỷ lệ bảo hành=4%: φ((3500-T)/350)=0.96 ⇒
  z≈1.751 ⇒ T≈2887.15 giờ (`inverse-left`).
- **CITD Đề2** — chuột, N(4000,400²) giờ, bảo hành nếu X<3200: P(X<3200)≈2.275%
  (`cdf-left`, z=-2). Tìm T để tỷ lệ=5%: z≈1.645 ⇒ T≈3342 giờ (`inverse-left`).
- **UICD Đề1** — điện năng, N(200,40²) KWh: P(X>250)=1-φ(1.25)≈10.56% (`cdf-right`).
  Ngưỡng nhóm 0.3% cao nhất: φ(z)=0.997 ⇒ z≈2.7478 ⇒ x₀≈309.91 KWh (`inverse-topk`).
- **UICD Đề2** — chiều cao, N(175,7²) cm: P(X<165)=φ(-1.4286)≈7.66% (`cdf-left`).
  Ngưỡng nhóm 1% cao nhất: φ(z)=0.99 ⇒ z≈2.326 ⇒ x₀≈191.28 cm (`inverse-topk`).
- **Quan trọng — 4 `NormalQueryMode` khác nhau, không phải mọi đề hỏi cùng 1 cặp**:
  `cdf-left`/`cdf-right` (chiều thuận, cho ngưỡng tìm %) tính bằng CDF chuẩn tắc LIÊN
  TỤC thật (Abramowitz–Stegun, chính xác ~7.5e-8) — không có sai số làm tròn cần khớp ở
  chiều này. `inverse-left`/`inverse-topk` (chiều ngược, cho % tìm ngưỡng) BACK-DERIVE z
  từ `verifiedThreshold` đã cho (z=(verifiedThreshold-μ)/σ) thay vì tính bằng nghịch đảo
  CDF liên tục — đáp án đề dùng bảng Laplace nội suy tuyến tính (kém chính xác hơn liên
  tục ~0.1 đơn vị, vd 2887.26 thay vì 2887.15 nếu dùng nghịch đảo liên tục). Xem
  `docs/decisions.md` (2026-09-15) cho lý do đầy đủ — ĐỪNG "sửa" sang nghịch đảo CDF
  liên tục nghĩ rằng nó "chính xác hơn", việc đó sẽ làm hỏng kết quả khớp đáp án đề.
- `inverse-topk` khác `inverse-left` chỉ ở NGỮ NGHĨA narration ("đổi thành φ(z)=1-k%
  trước khi tra" — lỗi hay gặp nhất theo chính lời giải gốc), phép tính z giống hệt.

## Số liệu Giai đoạn 2 (module 4-10, đã implement — `data/*.ts` tương ứng)

### 4. `ci-known-sigma`
- UICD Đề1: σ=4.8, n=64, x̄=25.6. CI95%=(24.424,26.776). Cỡ mẫu cho sai số≤3.1 →
  n≥9.21→**làm tròn LÊN 10**.
- UICD Đề2: σ=15, n=36, x̄=505. CI99%=(498.56,511.44). Cỡ mẫu cho sai số≤5 →
  n≥59.72→**làm tròn LÊN 60**.

### 5. `ci-sample-proportion`
- CITD Đề1: 7 khoảng 160-188cm, n=380, (trung điểm,tần số): (162,38)(166,54)(170,74)
  (174,115)(178,57)(182,28)(186,14). x̄≈172.5157895, S≈6.076666142. CI95% μ=
  (171.9048,173.1268). Kiểm định tỷ lệ ≥180cm>10%, α=1%: f=(28+14)/380=21/190≈0.1105,
  H0:p=0.1 vs H1:p>0.1 (1 phía), Z=(f-0.1)/√(0.1×0.9/380)≈0.684, z_0.01≈2.326 → KHÔNG
  bác bỏ H0.
- CITD Đề2: 7 khoảng 162-190cm, n=380, (trung điểm,tần số): (164,39)(168,58)(172,75)
  (176,112)(180,63)(184,21)(188,12). x̄≈174.2421053, S≈5.95358616. CI95% μ=
  (173.6435,174.8407). Kiểm định tỷ lệ ≥182cm>8%, α=1%: f=33/380≈0.0868, H0:p=0.08 vs
  p>0.08, Z≈0.4916 → KHÔNG bác bỏ H0.
- Bấm máy: MODE→STAT→1-Variable, SETUP→Frequency→ON, nhập (trung điểm,tần số), SHIFT→
  STAT→Var lấy x̄/xσn-1; z_0.01≈2.326 lấy bằng InverseNormal(Area=0.99,σ=1,μ=0).

### 6. `hypothesis-proportion`
- UICD Đề1: tuyên bố p0=0.6, n=300, thành công=182, α=5%. Đề hỏi "có thể bác bỏ tuyên
  bố" (không nêu hướng) → 2 PHÍA: H0:p=0.6 vs H1:p≠0.6. f=182/300≈0.6067,
  Z=(f-0.6)/√(0.6×0.4/300)≈0.236, z_0.025=1.96 → \|Z\|<1.96 → KHÔNG bác bỏ.
- UICD Đề2: p0=0.8, n=400, thành công=300, α=1%. Đề hỏi "khác với 80%" → 2 phía:
  f=0.75, Z=(0.75-0.8)/√(0.8×0.2/400)=-2.5, z_0.005=2.576 → \|Z\|=2.5<2.576 → KHÔNG bác
  bỏ (sát ngưỡng — ví dụ tốt để animate "gần biên bác bỏ").
- CK HK2 2023-2024 Câu3a: n=200 thiết bị, 7 lỗi, f=7/200=0.035, α=5%. Đề nêu rõ "ít
  hơn" → 1 PHÍA TRÁI: H0:p=0.04 vs H1:p<0.04. Z=(0.035-0.04)/√(0.04×0.96/200)≈-0.36,
  z_α=-1.645 (miền bác bỏ Z<z_α) → Z=-0.36>-1.645 → KHÔNG bác bỏ.
- Câu3b (CÙNG đề, n=200,f=0.035): ước lượng khoảng cho TỶ LỆ p (không phải μ — công
  thức ε=z_{α/2}·√(f(1-f)/n), KHÁC ε=z·σ/√n của ước lượng μ), độ tin cậy 90%:
  z_{0.05}=1.645, ε≈0.021, CI=(0.014,0.056).
- CITD Đề1,2's kiểm định (mục 5 ở trên) cũng là ví dụ hợp lệ của "1 phía" — có thể tham
  chiếu chéo khi build UI thay vì chép lại số liệu.
- Mẹo phân biệt 1/2 phía từ đề bài (transcribed nguyên văn từ nguồn): "khác với", "có
  thể bác bỏ tuyên bố" (không nêu hướng) → 2 phía, z_{α/2}; "lớn hơn"/"nhỏ hơn" (nêu rõ
  hướng) → 1 phía, z_α.

### 7. `t-distribution`
- CK HK2 2023-2024 Câu4: pH tại 15 hồ: 7.2, 7.3, 6.1, 6.9, 6.6, 7.9, 5.8, 7.3, 6.3, 5.5,
  6.3, 6.5, 5.7, 6.9, 6.7. n=15, x̄=6.6, s=0.672 (độ lệch chuẩn MẪU hiệu chỉnh, ký hiệu
  xσn-1 trên Casio — KHÔNG phải σ tổng thể), df=n-1=14.
- CI95% cho μ: t_{0.025,14}=2.145, ε=2.145×0.672/√15≈0.372, CI=(6.228,6.972).
- Kiểm định H0:μ=6 vs H1:μ>6, α=5%: t=(6.6-6)/(0.672/√15)≈3.458, t_{0.05,14}=1.761 →
  t=3.458>1.761 → **BÁC BỎ H0** — đây là VÍ DỤ DUY NHẤT trong cả 5 đề nguồn có bác bỏ
  H0 (mọi ví dụ kiểm định khác đều kết luận "không đủ bằng chứng bác bỏ"), nên đây là
  test case bắt buộc để module thật sự animate được nhánh "bác bỏ", không chỉ nhánh
  "không bác bỏ".
- Dấu hiệu nhận biết cần dùng t thay vì z: đề KHÔNG cho σ tổng thể, phải tự tính s từ
  dữ liệu mẫu (và thường n nhỏ, ở đây n=15).
- Bấm máy: MODE→STAT→1-Variable nhập 15 giá trị → SHIFT→STAT lấy x̄, xσn-1. Nếu máy có
  Inverse-t: Distribution→Inverse t (Area, df=14); nếu không, tra bảng t thủ công
  (t_{0.025,14}=2.145, t_{0.05,14}=1.761 — 2 giá trị hay dùng, nên nhớ).

### 8. `regression`
- CITD Đề1: (2018,8.7)(2019,9.1)(2020,9.3)(2021,9.7)(2022,9.9)(2023,10.5)(2024,11.0)
  (2025,11.3). r=0.9923. ŷ=-748.125+0.375X. Dự đoán 2028: ŷ=12.375 (nghìn người).
- CITD Đề2: (2018,8.8)(2019,9.2)(2020,9.5)(2021,9.8)(2022,10.0)(2023,10.6)(2024,11.3)
  (2025,11.5). r=0.9874. ŷ=-781.6666667+0.3916666667X. Dự đoán 2028: ŷ≈12.6333.
- CK HK2 2023-2024 Câu5: bảng tần số 2 CHIỀU (X=đường kính cm, Y=chiều cao m, tần số
  n). Kết quả theo đáp án: ŷ=0.44x-5.99. Dự đoán x=30: ŷ=7.21m. **Bảng tần số gốc
  KHÔNG có đầy đủ trong tài liệu nguồn** — phần "Bấm máy" chỉ liệt kê vài ô ví dụ
  (X=20,Y=2,Freq=3; X=20,Y=3,Freq=5; X=22,Y=3,Freq=2; X=22,Y=4,Freq=10) rồi ghi "nhập
  đủ tất cả các ô có tần số khác 0" mà không liệt kê hết — khi implement, ví dụ này chỉ
  hiển thị được kết quả hồi quy CUỐI CÙNG, KHÔNG animate được bước "điểm xuất hiện dần"
  (thiếu dữ liệu điểm đầy đủ để vẽ scatter đúng). Cần xin thêm bảng gốc nếu muốn animate
  đủ; đừng tự bịa bảng tần số để lấp chỗ trống.
- `RegressionSpec.points` nên hỗ trợ `weight` (mặc định 1) cho trường hợp bảng tần số
  (dù ví dụ Câu5 thiếu dữ liệu điểm, hàm tính vẫn nên nhận được tham số trọng số ngay
  từ đầu, tránh phải sửa lại type khi có dữ liệu đầy đủ sau này).

### 9. `joint-discrete`
- CK HK2 2023-2024 Câu1: bảng P(X=x,Y=y), X,Y∈{0,1,2}:

  | X＼Y | 0 | 1 | 2 |
  |---|---|---|---|
  | 0 | 0.2 | 0.1 | 0.15 |
  | 1 | 0.3 | 0.15 | 0 |
  | 2 | 0.1 | 0 | 0 |

  Biên X: P(X=0)=0.45, P(X=1)=0.45, P(X=2)=0.1 (cộng theo hàng).
  P(X+Y>1): gộp 3 ô (x,y) có x+y>1 — (0,2)=0.15, (1,1)=0.15, (2,0)=0.1 → tổng=0.4.
  Kiểm tra độc lập: P(X=2)=0.1, P(Y=2)=0.15+0+0=0.15, tích=0.015 ≠ P(X=2,Y=2)=0 →
  KHÔNG độc lập. Chỉ cần tìm 1 ô lệch (thường chọn ô có giá trị 0, dễ thấy khác tích),
  KHÔNG cần kiểm tra hết 9 ô.
- Cần `JointTableCanvas` mới (`src/components/table/JointTableCanvas.tsx`, CHƯA tạo):
  lưới 2 chiều, animate (a) tô từng HÀNG để cộng ra biên X, (b) tô từng CỘT để cộng ra
  biên Y, (c) highlight các ô thỏa điều kiện (vd x+y>1), (d) so sánh 1 ô cụ thể với
  tích 2 biên (hiện phép nhân bên cạnh) để minh họa kiểm tra độc lập.

### 10. `joint-continuous`
- CK HK2 2023-2024 Câu2: f(x,y)=c(2x+y), 0≤x≤1, 0≤y≤2. c=1/4 (giải từ
  ∫₀¹∫₀² c(2x+y)dydx=4c=1).
  Mật độ biên fX(x)=∫₀² (1/4)(2x+y)dy = x+1/2 trên [0,1].
  P(Y>1\|X=1/2) = 5/8 = 0.625 — mật độ CÓ ĐIỀU KIỆN tại 1 điểm cụ thể:
  fY(y\|x=1/2)=f(1/2,y)/fX(1/2)=(1/4)(1+y), rồi ∫₁² đó.
  P(Y>1\|X>1/2) = 3/5 = 0.6 — xác suất có điều kiện trên 1 KHOẢNG: P(B\|A)=P(A∩B)/P(A),
  P(X>1/2)=∫_{1/2}¹(x+1/2)dx=5/8, P(Y>1,X>1/2)=∫_{1/2}¹∫₁²(1/4)(2x+y)dydx=3/8 (tích
  phân kép) ⇒ (3/8)/(5/8)=0.6.
- **Đây là dạng dễ nhầm nhất** — nguồn gốc nói rõ "Mẹo quan trọng — phân biệt câu c và
  d": câu c điều kiện là X=1 GIÁ TRỊ cụ thể → dùng mật độ có điều kiện fY(y\|x)=
  f(x,y)/fX(x); câu d điều kiện là X thuộc 1 KHOẢNG → dùng P(B\|A)=P(A∩B)/P(A), tích
  phân kép trên miền tương ứng. Animate 2 luồng bước KHÁC NHAU rõ ràng cho 2 trường
  hợp này khi implement, có transition/khối text giải thích tại sao dùng công thức
  khác nhau — giữ đúng tinh thần "mẹo quan trọng" của tài liệu gốc, đừng lược bỏ vì
  "trông giống nhau".

## Kiến trúc riêng của XSTK (khác CTRR)

**KHÔNG dùng canvas/animation** (quyết định 2026-09-15, đợt 3 — xem `docs/decisions.md`
cho lý do đầy đủ). Đợt 2 đã viết 5 canvas (`ProbabilityTreeCanvas`,
`AreaUnderCurveCanvas`, `DensityCurveCanvas`, `NormalCurveCanvas`, `NumberLineCanvas`,
`ScatterRegressionCanvas`) rồi XÓA hết ở đợt 3 — đừng viết lại chúng, đừng tạo
`JointTableCanvas` cho `joint-discrete` (module 9) như đợt 2 từng dự tính. Mỗi module
giờ hiển thị dạng "từng bước giải" text-only:

- `components/ui/ExamplePicker.tsx` — hàng nút chọn đề (`GraphPicker` của CTRR giờ là
  wrapper mỏng quanh cái này).
- `components/ui/StepPlayer.tsx` — dùng chung với CTRR, hiện title/explanation của mỗi
  `AlgoStep` dạng text đơn thuần (không còn canvas đi kèm để "diễn hoạt" theo step).
- `components/ui/TipCallout.tsx` (props `{tip: string}`) — "Mẹo" riêng mỗi ví dụ,
  transcribed nguyên văn. Field `tip` ở data là OPTIONAL — không phải ví dụ nào cũng
  có mẹo trong nguồn (CITD Đề2's Câu2 phân phối chuẩn không có), component chỉ render
  khi `tip` tồn tại, KHÔNG bịa mẹo để lấp chỗ trống.
- `components/ui/CalculatorTip.tsx` (accordion, props `CalculatorTipData = {menu,
  steps}`) — MỌI module XSTK bắt buộc có ít nhất 1 cái, nội dung transcribed nguyên
  văn từ phần "Bấm máy" của file nguồn tương ứng, không tự bịa cách bấm máy khác.
- `components/ui/AnswerKeyPanel.tsx` (props `{spec: AnswerKeySpec}`) — "Ghi vào bài
  làm", format theo mẫu ảnh `docs/xstk/Dap an.jpg` (khối `setup` đặt biến cố/giả thiết,
  rồi các `parts` a)/b)/c)). `AnswerKeySpec.totalPoints` = điểm TỔNG cả câu (verified,
  đúng như nguồn ghi "Câu N (Xđ)"); `AnswerKeyLine.points` (điểm TỪNG DÒNG con) để
  UNDEFINED ở mọi ví dụ hiện có — 4 nguồn CITD/UICD chỉ cho điểm tổng, KHÔNG cho điểm
  chi tiết per-part như ảnh mẫu, nên bịa điểm chi tiết để "giống ảnh" sẽ là fabricate
  exam data (CLAUDE.md cấm). Chỉ điền `points` cấp dòng khi có nguồn thật cho nó.
- `ContinuousDensitySpec.fn(x,k)` không đổi khi bỏ canvas — vẫn cần cho
  `runContinuousDensity` sinh step narration, không phải chỉ để vẽ.
- Mọi engine (`bayes.ts`/`continuousDensity.ts`/`normalDistribution.ts`) KHÔNG đổi khi
  bỏ canvas — chúng chỉ sinh `AlgoStep[]` cho `StepPlayer`, chưa bao giờ tự vẽ gì; chỉ
  module (JSX) và data (`tip`/`answerKey` field mới) thay đổi.
- `engine/normalQuantile.ts` (Giai đoạn 2) — hàm nghịch đảo CDF chuẩn tắc THẬT (Acklam's
  algorithm), dùng cho `zCritical()`/`zAlpha()` trong `ciKnownSigma.ts`/
  `ciSampleProportion.ts`/`hypothesisProportion.ts`. KHÁC HẲN cách `normalDistribution.ts`
  xử lý ngưỡng đáp án đề (back-derive, xem mục 3 ở trên) — ở đây z_{0.025}=1.96,
  z_{0.01}=2.326... LÀ hằng số textbook thật (chính là output của 1 hàm nghịch đảo CDF
  liên tục), không phải số đáp án đề tra bảng làm tròn, nên tính bằng công thức liên
  tục là ĐÚNG, đã verify bằng node trước khi dùng (standardNormalQuantile(0.975) ≈
  1.959963986...). ĐỪNG áp dụng "back-derive" pattern của `normalDistribution.ts` vào
  đây — 2 tình huống khác nhau, xem `docs/decisions.md` (2026-09-15, đợt 4).
- Ngược lại, Student-t (`t-distribution`) KHÔNG có hàm nghịch đảo t nào được viết —
  `TTestSpec.tCriticalForCI`/`tCriticalForTest` là INPUT tra bảng t theo df, vì bảng t
  thật sự rời rạc theo df (không như z liên tục), nên tra bảng chính là cách làm đúng
  của một học sinh thật, không phải approximation cho 1 kết quả liên tục "tốt hơn".
- `GroupedProportionSpec` (module 5) tính x̄/S từ `bins` bằng weighted mean/variance
  (đã verify khớp CHÍNH XÁC 172.5157895/6.076666142 và 174.2421053/5.95358616 qua node
  trước khi code), và suy số "thành công" cho kiểm định tỷ lệ MÁY MÓC bằng tổng tần số
  các bin có midpoint≥ngưỡng (khớp đúng 42/380 và 33/380 của cả 2 đề) — không cần field
  "verifiedSuccessCount" riêng.
- `JointContinuousSpec` (module 10) dùng Simpson 1D lồng nhau cho tích phân kép trên
  1 miền CHỮ NHẬT cố định — KHÔNG tổng quát hóa cho miền biến đổi/không chữ nhật, vì
  chỉ có 1 ví dụ thật duy nhất (CK Câu2) và miền của nó là chữ nhật; đừng thêm phức tạp
  cho use case chưa tồn tại.
