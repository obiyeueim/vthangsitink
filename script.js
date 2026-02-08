// Web JavaScript - CHUẨN 100%
const SECRET = "YAMATE_VIP_FINAL"; 

function generateKey() {
    const urlParams = new URLSearchParams(window.location.search);
    const hwid = urlParams.get('hwid') || "NOHWID";
    
    // 1. Nối HWID và SECRET, xóa mọi khoảng trắng
    const raw = (hwid + SECRET).replace(/\s+/g, "");
    
    // 2. Mã hóa Base64
    const base64 = btoa(raw);
    
    // 3. Xóa các ký tự không phải chữ và số, lấy 10 ký tự đầu, viết hoa
    const finalKey = base64.replace(/[^a-zA-Z0-9]/g, "").substring(0, 10).toUpperCase();
    
    document.getElementById('keyDisplay').innerText = "YM-" + finalKey;
    document.getElementById('keyDisplay').style.display = 'block';
}