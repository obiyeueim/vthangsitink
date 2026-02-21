-- =========================================================
-- 🍌 BANANA HUB PREMIUM KEY SYSTEM (BULLETPROOF GUI)
-- Đã tích hợp Code chạy Script Chính & Fix lỗi không hiện Menu
-- =========================================================

local player = game:GetService("Players").LocalPlayer
-- Tạo ID độc nhất cho mỗi người chơi
local MyHWID = tostring(player.UserId) .. "_BANANA"
local API_URL = "https://keysystem-bananacat.bananacathubb.workers.dev"

-- 1. TÌM NƠI AN TOÀN ĐỂ CHỨA GIAO DIỆN (CHỐNG TÀNG HÌNH)
local guiParent = nil
pcall(function() if gethui then guiParent = gethui() end end)
if not guiParent then pcall(function() guiParent = game:GetService("CoreGui") end) end
if not guiParent then guiParent = player:WaitForChild("PlayerGui") end

-- Xóa GUI cũ nếu đang bị kẹt
if guiParent:FindFirstChild("BananaKeySystem") then
    guiParent.BananaKeySystem:Destroy()
end

-- 2. TẠO GIAO DIỆN KHÁNG LỖI
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "BananaKeySystem"
ScreenGui.Parent = guiParent
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

local MainFrame = Instance.new("Frame")
MainFrame.Parent = ScreenGui
MainFrame.AnchorPoint = Vector2.new(0.5, 0.5)
MainFrame.BackgroundColor3 = Color3.fromRGB(15, 15, 15)
MainFrame.Position = UDim2.new(0.5, 0, 0.5, 0)
MainFrame.Size = UDim2.new(0, 380, 0, 240)
MainFrame.ClipsDescendants = true

local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 12)
UICorner.Parent = MainFrame

local UIStroke = Instance.new("UIStroke")
UIStroke.Color = Color3.fromRGB(255, 225, 53)
UIStroke.Thickness = 2
UIStroke.Parent = MainFrame

local Title = Instance.new("TextLabel")
Title.Parent = MainFrame
Title.BackgroundTransparency = 1
Title.Position = UDim2.new(0, 0, 0, 20)
Title.Size = UDim2.new(1, 0, 0, 30)
Title.Font = Enum.Font.GothamBlack
Title.Text = "🍌 BANANA HUB"
Title.TextColor3 = Color3.fromRGB(255, 225, 53)
Title.TextSize = 24

local Subtitle = Instance.new("TextLabel")
Subtitle.Parent = MainFrame
Subtitle.BackgroundTransparency = 1
Subtitle.Position = UDim2.new(0, 0, 0, 50)
Subtitle.Size = UDim2.new(1, 0, 0, 20)
Subtitle.Font = Enum.Font.GothamSemibold
Subtitle.Text = "Premium Access Required"
Subtitle.TextColor3 = Color3.fromRGB(150, 150, 150)
Subtitle.TextSize = 13

local InputFrame = Instance.new("Frame")
InputFrame.Parent = MainFrame
InputFrame.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
InputFrame.Position = UDim2.new(0.05, 0, 0, 90)
InputFrame.Size = UDim2.new(0.9, 0, 0, 45)
local InputCorner = Instance.new("UICorner")
InputCorner.CornerRadius = UDim.new(0, 8)
InputCorner.Parent = InputFrame

local KeyInput = Instance.new("TextBox")
KeyInput.Parent = InputFrame
KeyInput.BackgroundTransparency = 1
KeyInput.Position = UDim2.new(0.05, 0, 0, 0)
KeyInput.Size = UDim2.new(0.9, 0, 1, 0)
KeyInput.Font = Enum.Font.Code
KeyInput.PlaceholderText = "Nhập Key BANANA-6H-... vào đây"
KeyInput.PlaceholderColor3 = Color3.fromRGB(100, 100, 100)
KeyInput.Text = ""
KeyInput.TextColor3 = Color3.fromRGB(255, 255, 255)
KeyInput.TextSize = 14
KeyInput.ClearTextOnFocus = false

local GetKeyBtn = Instance.new("TextButton")
GetKeyBtn.Parent = MainFrame
GetKeyBtn.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
GetKeyBtn.Position = UDim2.new(0.05, 0, 0, 150)
GetKeyBtn.Size = UDim2.new(0.42, 0, 0, 40)
GetKeyBtn.Font = Enum.Font.GothamBold
GetKeyBtn.Text = "GET KEY"
GetKeyBtn.TextColor3 = Color3.fromRGB(255, 225, 53)
GetKeyBtn.TextSize = 14
local GetKeyCorner = Instance.new("UICorner")
GetKeyCorner.CornerRadius = UDim.new(0, 8)
GetKeyCorner.Parent = GetKeyBtn
local GetKeyStroke = Instance.new("UIStroke")
GetKeyStroke.Color = Color3.fromRGB(255, 225, 53)
GetKeyStroke.Thickness = 1
GetKeyStroke.Parent = GetKeyBtn

local VerifyBtn = Instance.new("TextButton")
VerifyBtn.Parent = MainFrame
VerifyBtn.BackgroundColor3 = Color3.fromRGB(255, 225, 53)
VerifyBtn.Position = UDim2.new(0.53, 0, 0, 150)
VerifyBtn.Size = UDim2.new(0.42, 0, 0, 40)
VerifyBtn.Font = Enum.Font.GothamBold
VerifyBtn.Text = "VERIFY"
VerifyBtn.TextColor3 = Color3.fromRGB(0, 0, 0)
VerifyBtn.TextSize = 14
local VerifyCorner = Instance.new("UICorner")
VerifyCorner.CornerRadius = UDim.new(0, 8)
VerifyCorner.Parent = VerifyBtn

local StatusText = Instance.new("TextLabel")
StatusText.Parent = MainFrame
StatusText.BackgroundTransparency = 1
StatusText.Position = UDim2.new(0, 0, 0, 205)
StatusText.Size = UDim2.new(1, 0, 0, 20)
StatusText.Font = Enum.Font.GothamSemibold
StatusText.Text = "Account ID: " .. MyHWID
StatusText.TextColor3 = Color3.fromRGB(100, 100, 100)
StatusText.TextSize = 12

-- =========================================================
-- 3. LOGIC XỬ LÝ (ĐỒNG BỘ 100% VỚI WEB V15.8)
-- =========================================================

-- Nút Lấy Key
GetKeyBtn.MouseButton1Click:Connect(function()
    local url = API_URL .. "/?hwid=" .. MyHWID
    if setclipboard then
        setclipboard(url)
        StatusText.Text = "✅ Đã Copy Link! Hãy ra trình duyệt dán."
        StatusText.TextColor3 = Color3.fromRGB(0, 255, 136)
    else
        StatusText.Text = "❌ Lỗi: App của bạn không hỗ trợ Copy!"
        StatusText.TextColor3 = Color3.fromRGB(255, 51, 51)
    end
end)

-- Nút Xác Nhận (Verify)
VerifyBtn.MouseButton1Click:Connect(function()
    -- Gọt sạch rác và In hoa 100% để chống lệnh Cache & sai định dạng
    local inputKey = tostring(KeyInput.Text):gsub("%s+", ""):upper()
    local cleanHwid = MyHWID:gsub("%s+", ""):upper()
    
    if inputKey == "" then
        StatusText.Text = "⚠️ Vui lòng dán Key vào ô trống!"
        StatusText.TextColor3 = Color3.fromRGB(255, 225, 53)
        return
    end

    VerifyBtn.Text = "ĐANG CHECK..."
    StatusText.Text = "Đang kết nối Server..."
    StatusText.TextColor3 = Color3.fromRGB(150, 150, 150)
    
    task.spawn(function()
        -- Lệnh t=tick() lừa điện thoại ném bộ nhớ đệm đi, ép check Key mới
        local checkUrl = API_URL .. "/api/verify?hwid=" .. cleanHwid .. "&key=" .. inputKey .. "&t=" .. tostring(tick())
        
        local success, res = pcall(function()
            return game:HttpGet(checkUrl)
        end)

        if success then
            if res:match('"status":"success"') then
                StatusText.Text = "✅ Xác thực thành công! Đang tải Menu..."
                StatusText.TextColor3 = Color3.fromRGB(0, 255, 136)
                VerifyBtn.Text = "THÀNH CÔNG"
                VerifyBtn.BackgroundColor3 = Color3.fromRGB(0, 255, 136)
                task.wait(1)
                
                -- Xóa bảng Key đi cho thoáng màn hình
                ScreenGui:Destroy()
                print("BANANA HUB VERIFIED SUCCESSFULLY!")

                -- Bật luồng chạy độc lập (Chống lỗi ngắt Script khi xóa GUI)
                task.spawn(function()
                    local loadSuccess, loadError = pcall(function()
                        -- 🔥 CHẠY SCRIPT MENU CHÍNH CỦA BÁC Ở ĐÂY 🔥
                        loadstring(game:HttpGet("https://raw.githubusercontent.com/dauphucan061-tech/mbingua/refs/heads/main/4968767887617217.lua"))()
                    end)
                    
                    -- Nếu Script trên Github bị lỗi, nó sẽ in dòng chữ màu cam vào Console (F9)
                    if not loadSuccess then
                        warn("⚠️ LỖI BANANA HUB: Không thể chạy Script chính! Chi tiết: " .. tostring(loadError))
                    end
                end)
                
            elseif res:match('"status":"expired"') then
                StatusText.Text = "❌ Key đã hết hạn hoặc bị Xóa!"
                StatusText.TextColor3 = Color3.fromRGB(255, 51, 51)
                VerifyBtn.Text = "VERIFY"
            else
                StatusText.Text = "❌ Key KHÔNG ĐÚNG! Vui lòng Get Key lại."
                StatusText.TextColor3 = Color3.fromRGB(255, 51, 51)
                VerifyBtn.Text = "VERIFY"
            end
        else
            StatusText.Text = "❌ Lỗi mạng! Hãy bật 1.1.1.1 hoặc thử lại."
            StatusText.TextColor3 = Color3.fromRGB(255, 51, 51)
            VerifyBtn.Text = "VERIFY"
        end
    end)
end)
