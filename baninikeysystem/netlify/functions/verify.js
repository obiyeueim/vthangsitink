exports.handler = async function(event, context) {
    // 1. CẤU HÌNH HEADER (Cho phép mọi nơi truy cập & CẤM CACHE)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    };

    // 2. LẤY THAM SỐ (Netlify dùng event.queryStringParameters)
    const { key, hwid } = event.queryStringParameters || {};
    const secret = "BANANA_NETLIFY_VIP"; // Đổi mật khẩu ở đây

    // 3. KIỂM TRA HWID
    if (!hwid) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "MISSING_HWID", message: "Vui long lay link tu Script Roblox!" })
        };
    }

    // 4. THUẬT TOÁN 10 GIÂY
    const currentTime = Date.now();
    const timeStep = Math.floor(currentTime / 10000); // 10 giây

    const generateKey = (step) => {
        const raw = secret + step + hwid;
        const encoded = Buffer.from(raw).toString('base64');
        const clean = encoded.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        return `BANANA-${clean.substring(0, 4)}-${clean.substring(4, 8)}`;
    };

    const currentKey = generateKey(timeStep);
    const previousKey = generateKey(timeStep - 1);

    // 5. TRẢ VỀ KẾT QUẢ
    
    // Web gọi (Lấy Key)
    if (!key) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                key: currentKey,
                ttl: 10 - Math.floor((currentTime % 10000) / 1000)
            })
        };
    }

    // Script gọi (Check Key)
    if (key === currentKey || key === previousKey) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ status: "success", message: "Key Valid" })
        };
    } else {
        return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ status: "error", message: "Key Expired" })
        };
    }
};