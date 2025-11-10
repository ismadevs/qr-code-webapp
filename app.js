let qrcode = null;
let currentTab = 'url';
let currentLanguage = 'en';

// Translation data
const translations = {
    en: {
        title: "QR Code WebApp by Isma",
        description: "Generate scannable QR codes in seconds.",
        url: "URL",
        text: "Text",
        phone: "Phone",
        email: "Email",
        urlLabel: "Enter URL",
        urlPlaceholder: "https://example.com",
        textLabel: "Enter Text",
        textPlaceholder: "Hello world!",
        phoneLabel: "Enter Phone Number",
        phonePlaceholder: "+15551234567",
        emailLabel: "Enter Email Address",
        emailPlaceholder: "info@example.com",
        qrLabel: "QR Code",
        emptyState: "Enter content above to generate QR code",
        downloadBtn: "Download",
        downloadTitle: "QR Code WebApp by Isma",
        captionUrl: "🔗  Visit this website",
        captionText: "💬 Read this message",
        captionPhone: "☎️  Call this number",
        captionEmail: "✉️  Send an email"
    },
    it: {
        title: "QR Code WebApp by Isma",
        description: "Genera codici QR scansionabili in secondi.",
        url: "URL",
        text: "Testo",
        phone: "Telefono",
        email: "Email",
        urlLabel: "Inserisci URL",
        urlPlaceholder: "https://esempio.it",
        textLabel: "Inserisci Testo",
        textPlaceholder: "Ciao mondo!",
        phoneLabel: "Inserisci Numero di Telefono",
        phonePlaceholder: "+393331234567",
        emailLabel: "Inserisci Indirizzo Email",
        emailPlaceholder: "info@esempio.it",
        qrLabel: "Codice QR",
        emptyState: "Inserisci il contenuto sopra per generare il codice QR",
        downloadBtn: "Scarica",
        downloadTitle: "QR Code WebApp di Isma",
        captionUrl: "🔗  Visita questo sito web",
        captionText: "💬 Leggi questo messaggio",
        captionPhone: "☎️  Chiama questo numero",
        captionEmail: "✉️  Invia un'email"
    }
};

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');
const inputs = {
    url: document.getElementById('url-input'),
    text: document.getElementById('text-input'),
    phone: document.getElementById('phone-input'),
    email: document.getElementById('email-input')
};

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        contents.forEach(c => c.classList.remove('active'));
        document.getElementById(`${tabName}-content`).classList.add('active');
        
        currentTab = tabName;
        generateQR();
    });
});

Object.values(inputs).forEach(input => {
    input.addEventListener('input', generateQR);
});

function generateQR() {
    const input = inputs[currentTab];
    const value = input.value.trim();
    const qrcodeDiv = document.getElementById('qrcode');
    const t = translations[currentLanguage];

    qrcodeDiv.innerHTML = '';

    if (!value) {
        qrcodeDiv.innerHTML = `<div class="empty-state">${t.emptyState}</div>`;
        downloadBtn.style.display = 'none';
        qrcode = null;
        return;
    }

    let qrContent = value;

    if (currentTab === 'phone') {
        qrContent = `tel:${value}`;
    } else if (currentTab === 'email') {
        qrContent = `mailto:${value}`;
    }

    // Calculate QR size based on container size
    const containerWidth = qrcodeDiv.offsetWidth;
    const qrSize = Math.min(240, containerWidth - 40); // 40px for padding

    qrcode = new QRCodeStyling({
        width: qrSize,
        height: qrSize,
        type: "svg",
        data: qrContent,
        margin: 0,
        dotsOptions: {
            color: "rgb(255, 18, 93)",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: {
            color: "rgb(255, 18, 93)",
            type: "extra-rounded"
        },
        cornersDotOptions: {
            color: "rgb(255, 18, 93)",
            type: "dot"
        },
        qrOptions: {
            errorCorrectionLevel: "H"
        }
    });

    qrcode.append(qrcodeDiv);
    downloadBtn.style.display = 'flex';
}

const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', downloadQRCode);

// Get current language captions
function getCaptions() {
    const t = translations[currentLanguage];
    return {
        url: t.captionUrl,
        text: t.captionText,
        phone: t.captionPhone,
        email: t.captionEmail
    };
}

function downloadQRCode() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1080;
    canvas.height = 1080;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const qrSize = 700;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = (canvas.height - qrSize) / 2;
    
    const titleY = qrY / 2;
    
    ctx.fillStyle = '#000000';
    ctx.font = '700 60px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(translations[currentLanguage].downloadTitle, canvas.width / 2, titleY);
    
    const qrSvg = document.querySelector('#qrcode svg');
    if (!qrSvg) return;
    
    const svgData = new XMLSerializer().serializeToString(qrSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = function() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = qrSize;
        tempCanvas.height = qrSize;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(img, 0, 0, qrSize, qrSize);
        
        const imageData = tempCtx.getImageData(0, 0, qrSize, qrSize);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] < 128 && data[i+1] < 128 && data[i+2] < 128) {
                data[i] = 255;
                data[i + 1] = 18;
                data[i + 2] = 93;
            }
        }
        
        tempCtx.putImageData(imageData, 0, 0);
        
        ctx.drawImage(tempCanvas, qrX, qrY, qrSize, qrSize);
        
        const spaceBelow = canvas.height - (qrY + qrSize);
        const captionY = qrY + qrSize + (spaceBelow / 2);
        
        const captions = getCaptions();
        const caption = captions[currentTab];
        ctx.fillStyle = '#000000';
        ctx.font = '700 40px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(caption, canvas.width / 2, captionY);
        
        canvas.toBlob(function(blob) {
            const link = document.createElement('a');
            link.download = `qrcode-${currentTab}-${Date.now()}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(url);
        });
    };
    
    img.src = url;
}

// Language toggle functionality
const languageBtn = document.getElementById('language-toggle');

languageBtn.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'it' : 'en';
    updateLanguage();
});

function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Update language button
    languageBtn.innerHTML = currentLanguage === 'en' ? '🇮🇹 ITA' : '🇺🇸 ENG';
    
    // Update title
    document.querySelector('h1').textContent = t.title;
    
    // Update description (if you added it)
    const description = document.querySelector('.description');
    if (description) {
        description.textContent = t.description;
    }
    
    // Update tabs
    document.querySelector('[data-tab="url"] span').textContent = t.url;
    document.querySelector('[data-tab="text"] span').textContent = t.text;
    document.querySelector('[data-tab="phone"] span').textContent = t.phone;
    document.querySelector('[data-tab="email"] span').textContent = t.email;
    
    // Update labels and placeholders
    document.querySelector('label[for="url-input"]').textContent = t.urlLabel;
    document.getElementById('url-input').placeholder = t.urlPlaceholder;
    
    document.querySelector('label[for="text-input"]').textContent = t.textLabel;
    document.getElementById('text-input').placeholder = t.textPlaceholder;
    
    document.querySelector('label[for="phone-input"]').textContent = t.phoneLabel;
    document.getElementById('phone-input').placeholder = t.phonePlaceholder;
    
    document.querySelector('label[for="email-input"]').textContent = t.emailLabel;
    document.getElementById('email-input').placeholder = t.emailPlaceholder;
    
    // Update QR section
    document.querySelector('.qr-label').textContent = t.qrLabel;
    
    // Update empty state if visible
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) {
        emptyState.textContent = t.emptyState;
    }
    
    // Update download button
    const downloadBtnText = document.querySelector('#download-btn');
    if (downloadBtnText) {
        downloadBtnText.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M12 14.5L12 4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            ${t.downloadBtn}
        `;
    }
}
