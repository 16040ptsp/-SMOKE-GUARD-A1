// 1. ฟังก์ชันเมื่อกดปุ่ม "User ทั่วไป"
function enterAsUser() {
    currentRole = 'user';
    
    // เปลี่ยนป้ายสถานะมุมขวาบนให้เป็นสีฟ้าอ่อนแบบในรูป
    const badge = document.getElementById('role-badge');
    badge.innerText = '👤 บุคคลทั่วไป (User)';
    badge.className = 'text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600';
    
    // สลับหน้าจอจากหน้า Portal ไปเป็นหน้า Dashboard
    switchPage('dashboard-page');
    
    // เริ่มดึงข้อมูลจริงจากบอร์ด
    startRealDataFetch();
}

// 2. ฟังก์ชันสลับหน้าจอ (ต้องมี ID ตรงกับใน index.html)
function switchPage(pageId) {
    document.getElementById('portal-page').classList.add('hidden');
    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById(pageId).classList.remove('hidden');
}

// 3. ฟังก์ชันดึงค่าจริง (ตรวจสอบตัวแปรให้ตรงกับบอร์ด IPST)
function startRealDataFetch() {
    function updateData() {
        fetch('/data') // บอร์ด IPST จะส่งค่าออกมาที่นี่
            .then(response => response.json())
            .then(data => {
                // อัปเดตตัวเลข (99, 255, 24.7 ตามรูปของน้า)
                document.getElementById('pm-value').innerText = data.pm25;
                document.getElementById('gas-value').innerText = data.gas;
                document.getElementById('temp-value').innerText = data.temp;

                // ตรรกะเปลี่ยนสี "ป้ายสถานะตรงกลาง" ให้ตรงกับค่าฝุ่น
                let pill = document.getElementById('status-pill');
                let txt = document.getElementById('status-text');
                
                if(data.pm25 >= 150){
                    txt.innerText = '⚠️ คุณภาพอากาศอันตราย';
                    pill.style.background = '#ffe3e5';
                    pill.style.color = '#dd3445';
                }
                else if(data.pm25 >= 81){
                    // สีเหลืองอำพันแบบในรูปของน้า (เฝ้าระวังคุณภาพอากาศ)
                    txt.innerText = '🟠 เฝ้าระวังคุณภาพอากาศ';
                    pill.style.background = '#fff1d8';
                    pill.style.color = '#b86d00';
                }
                else{
                    txt.innerText = '🟢 คุณภาพอากาศปกติ';
                    pill.style.background = '#e5f8ef';
                    pill.style.color = '#188d58';
                }

                // อัปเดตเวลาล่าสุดตรงมุมซ้ายล่างแบบในรูป
                document.getElementById('updated-time').innerText = new Date().toLocaleTimeString('th-TH');
            })
            .catch(err => {
                console.error('เชื่อมต่อบอร์ดไม่ได้:', err);
                document.getElementById('status-text').innerText = '⏳ กำลังรอข้อมูลจากบอร์ด...';
            });
    }

    updateData();
    clearInterval(dataInterval);
    dataInterval = setInterval(updateData, 3000); // ดึงค่าใหม่ทุก 3 วินาที
}
