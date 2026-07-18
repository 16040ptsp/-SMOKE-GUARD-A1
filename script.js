let dataInterval;
let currentRole = 'user';

// เข้าใช้ระบบแบบบุคคลทั่วไป
function enterAsUser() {
    currentRole = 'user';
    document.getElementById('role-badge').innerText = '👤 โหมดบุคคลทั่วไป';
    document.getElementById('role-badge').className = 'text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600';
    switchPage('dashboard-page');
    startSimulation();
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
    
    // 🔑 น้าเปลี่ยนรหัสผ่านแอดมินตรงเลข '1234' นี้ได้เลยครับตามใจชอบ
    if(passInput === '1234') { 
        errorMsg.classList.add('hidden');
        currentRole = 'admin';
        document.getElementById('role-badge').innerText = '🛡️ โหมดผู้ดูแลระบบ (Admin)';
        document.getElementById('role-badge').className = 'text-xs font-bold px-3 py-1 rounded-full bg-slate-900 text-white';
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-form').classList.add('hidden');
        switchPage('dashboard-page');
        startSimulation();
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

// ฟังก์ชันเริ่มรันสุ่มข้อมูลฝุ่น
function startSimulation() {
    function simulateData() {
        let randomPM = Math.floor(Math.random() * (180 - 20 + 1)) + 20;
        let randomGas = Math.floor(Math.random() * (260 - 210 + 1)) + 210;
        let randomTemp = (Math.random() * (29.5 - 28.0) + 28.0).toFixed(1);

        document.getElementById('pm-value').innerText = randomPM;
        document.getElementById('gas-value').innerText = randomGas;
        document.getElementById('temp-value').innerText = randomTemp;

        let pill = document.getElementById('status-pill');
        let txt = document.getElementById('status-text');
        
        if(randomPM >= 150){
            txt.innerText = 'แจ้งเตือน: ควัน/ฝุ่น สูงเกินมาตรฐาน';
            pill.style.background = '#ffe3e5';
            pill.style.color = '#dd3445';
        }
        else if(randomPM >= 81){
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
    }

    simulateData();
    clearInterval(dataInterval);
    dataInterval = setInterval(simulateData, 3000);
}

// โหลดไอคอนตอนเริ่มต้นระบบ
lucide.createIcons();