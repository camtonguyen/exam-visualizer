"""Kiểm chứng các câu tính toán mã cổ điển trong đề ATTT (chạy: python3 ciphers.py).
Quy ước theo slide Bài 2A: Playfair 5x5, I≡J, dư 1 ký tự thêm X; Caesar/Vigenère/Affine A=0..Z=25."""
A = "ABCDEFGHIKLMNOPQRSTUVWXYZ"  # không có J


def pf_matrix(key):
    seen = []
    for ch in key.upper().replace("J", "I") + A:
        if ch.isalpha() and ch not in seen:
            seen.append(ch)
    return [seen[i:i + 5] for i in range(0, 25, 5)]


def playfair(key, msg):
    m = pf_matrix(key)
    pos = {m[r][c]: (r, c) for r in range(5) for c in range(5)}
    s = [c for c in msg.upper().replace("J", "I") if c.isalpha()]
    if len(s) % 2:
        s.append("X")
    out = []
    for a, b in zip(s[::2], s[1::2]):
        assert a != b, f"cặp trùng {a}{b}: tránh ra đề kiểu này (slide không nêu luật chèn X)"
        (ra, ca), (rb, cb) = pos[a], pos[b]
        if ra == rb:
            out += [m[ra][(ca + 1) % 5], m[rb][(cb + 1) % 5]]
        elif ca == cb:
            out += [m[(ra + 1) % 5][ca], m[(rb + 1) % 5][cb]]
        else:
            out += [m[ra][cb], m[rb][ca]]
    return "".join(out)


def shift(msg, key):  # Vigenère; Caesar = key 1 ký tự
    ks = [ord(k) - 65 for k in key.upper()]
    s = [c for c in msg.upper() if c.isalpha()]
    return "".join(chr((ord(c) - 65 + ks[i % len(ks)]) % 26 + 65) for i, c in enumerate(s))


def affine(msg, a, b):
    return "".join(chr(((ord(c) - 65) * a + b) % 26 + 65) for c in msg.upper() if c.isalpha())


def permute(msg, h):  # vị trí i của khối mã = ký tự thứ h[i] của khối rõ
    d = len(h)
    return " ".join("".join(msg[k:k + d][j - 1] for j in h) for k in range(0, len(msg), d))


if __name__ == "__main__":
    # Đề mẫu (đề thật) câu 05, 06
    assert pf_matrix("BAOMAT")[2][2] == "K"
    assert playfair("BAOMAT", "THANH PHO HO CHI MINH")[1] == "N"
    # Ví dụ trên slide Bài 2A
    assert shift("CRYPTOGRAPHY", "F") == "HWDUYTLWFUMD"
    assert shift("VIGENERE", "CHIFFRE") == "XPOJSVVG"
    assert permute("JOHN IS A GOOD ACTOR", (4, 1, 3, 2, 5)) == "NJHO  AI S  DGOO  OATCR"
    for k, m in [("CONGNGHE", "AN TOAN THONG TIN"), ("HACKER", "BAO MAT MANG"), ("KHOABIMAT", "DAI HOC QUOC GIA")]:
        print(k, pf_matrix(k), m, "->", playfair(k, m))
    print("Caesar k=3 ATTACK ->", shift("ATTACK", "D"))
    print("Vigenere LEMON ATTACKATDAWN ->", shift("ATTACKATDAWN", "LEMON"))
    print("Affine 5x+8 HOC ->", affine("HOC", 5, 8))
    print("Permute (3 1 4 2) MATKHAU0 ->", permute("SECURITY", (3, 1, 4, 2)))
    print("OK")
