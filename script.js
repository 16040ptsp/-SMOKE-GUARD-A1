let dataInterval;
let currentRole = 'user';

// เข้าใช้ระบบแบบบุคคลทั่วไป
function enterAsUser() {
    currentRole = 'user';
    document.getElementById('role-badge').innerText = '👤 โหมดบุคคลทั่วไป';
    document.getElementById('role-badge').className = 'text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600';
    switchPage('dashboard-page');
    startRealDataFetch(); // เปลี่ยนมาเรียกใช้ฟังก์ชันดึงค่าจริง
}

// แสดง/ซ่อน กล่องกรอกรหัสผ่านแอดมิน
function showAdminLogin() {
    let form = document.getElementById('admin-form');
    form.classList.toggle('hidden');
    document.getElementById('admin-password').focus();
}

// ตรวจสอบรหัสผ่านแอดมิน
function verifyAdmin() {
    let passInput = document.getElementById('admin-password').value;
    let errorMsg = document.getElementById('login-error');
    
    if(passInput === '1234') { 
        errorMsg.classList.add('hidden');
        currentRole = 'admin';
        document.getElementById('role-badge').innerText = '🛡️ โหมดผู้ดูแลระบบ (Admin)';
        document.getElementById('role-badge').className = 'text-xs font-bold px-3 py-1 rounded-full bg-slate-900 text-white';
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-form').classList.add('hidden');
        switchPage('dashboard-page');
        startRealDataFetch(); // เปลี่ยนมาเรียกใช้ฟังก์ชันดึงค่าจริง
    } else {
        errorMsg.classList.remove('hidden');
    }
}

// สลับหน้าจอการใช้งาน
function switchPage(pageId) {
    document.getElementById('portal-page').classList.add('hidden');
    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById(pageId).classList.remove('hidden');
}

// ปุ่มย้อนกลับหน้าแรก
function backToPortal() {
    switchPage('portal-page');
    clearInterval(dataInterval);
}

// ==========================================
// 🔄 ส่วนดึงค่าจริงจากบอร์ด IPST (ของเดิมของน้า)
// ==========================================
function startRealDataFetch() {
    function updateData() {
        // วิ่งไปดึงค่าจากบอร์ด IPST (ใช้ Endpoint '/data' เดิมที่บอร์ดน้าปล่อยออกมา)
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                // นำค่าจริงจากบอร์ดมาใส่ใน Grid แดชบอร์ด
                document.getElementById('pm-value').innerText = data.pm25;
                document.getElementById('gas-value').innerText = data.gas;
                document.getElementById('temp-value').innerText = data.temp;

                // ตรรกะเปลี่ยนสีป้ายเตือนตามค่าฝุ่นจริง
                let pill = document.getElementById('status-pill');
                let txt = document.getElementById('status-text');
                
                if(data.pm25 >= 150){
                    txt.innerText = 'แจ้งเตือน: ควัน/ฝุ่น สูงเกินมาตรฐาน';
                    pill.style.background = '#ffe3e5';
                    pill.style.color = '#dd3445';
                }
                else if(data.pm25 >= 81){
                    txt.innerText = 'เฝ้าระวังคุณภาพอากาศ';
                    pill.style.background = '#fff1d8';
                    pill.style.color = '#b86d00';
                }
                else{
                    txt.innerText = 'ระบบทำงานปกติ (สถานะ: ' + (currentRole === 'admin' ? 'แอดมินคุม' : 'ผู้ชม') + ')';
                    pill.style.background = '#e5f8ef';
                    pill.style.color = '#188d58';
                }

                document.getElementById('updated-time').innerText = new Date().toLocaleTimeString('th-TH');
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                document.getElementById('status-text').innerText = 'เชื่อมต่อบอร์ดไม่ได้...';
            });
    }

    updateData();
    clearInterval(dataInterval);
    // ดึงข้อมูลใหม่จากบอร์ดจริงทุก ๆ 3 วินาที
    dataInterval = setInterval(updateData, 1000);
}

// โหลดไอคอนตอนเริ่มต้นระบบ
lucide.createIcons();