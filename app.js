/* ------------------------------------------
   DYNAMIC TAB TEXT & PLACEHOLDERS
------------------------------------------- */

// Text under tabs
const tabDescriptions = {
    url: "Enter a link and I'll turn it into a QR code that opens your website instantly",
    text: "Write any message and I'll generate a QR code that reveals your text",
    phone: "Type a phone number and the QR code will let people call it right away",
    email: "Provide an email address and I'll create a QR code to send an email to it"
};

// Textarea placeholder
const tabPlaceholders = {
    url: "https://example.com",
    text: "Write your message here...",
    phone: "3332222456",
    email: "name@example.com"
};

// Captions for download
const captions = {
    url: "🔗  Visit this website",
    text: "💬 Read this message",
    phone: "☎️  Call this number",
    email: "✉️  Send an email"
};

// DOM elements
const tabs = document.querySelectorAll(".tab");
const description = document.querySelector(".tab-description");
const textarea = document.querySelector(".input-field");
const qrContainer = document.querySelector(".qrcode-section");
const actionsContainer = document.querySelector(".qrcode-actions-section");

// Default state
let currentTabType = "url";
let qrcode = null;

// Apply default text on load
description.textContent = tabDescriptions.url;
textarea.placeholder = tabPlaceholders.url;

/* ------------------------------------------
   TAB CLICK LOGIC
------------------------------------------- */

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // Switch active tab
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const type = tab.getAttribute("data-type");
        currentTabType = type;

        // Update description and placeholder
        description.textContent = tabDescriptions[type];
        textarea.placeholder = tabPlaceholders[type];

        // Clear textarea
        textarea.value = '';

        // Clear QR code and actions
        qrContainer.innerHTML = '';
        actionsContainer.innerHTML = '';

        
        // Reset QR code instance
        qrcode = null;
    });
});


// Listen to textarea input
textarea.addEventListener('input', generateQR);

/* ------------------------------------------
   QR CODE GENERATION
------------------------------------------- */

function generateQR() {
    const value = textarea.value.trim();
    
    // Clear previous QR code
    qrContainer.innerHTML = '';
    actionsContainer.innerHTML = '';

    if (!value) {
        qrcode = null;
        return;
    }

    let qrContent = value;

    // Format content based on tab type
    if (currentTabType === 'phone') {
        qrContent = `tel:${value}`;
    } else if (currentTabType === 'email') {
        qrContent = `mailto:${value}`;
    } else if (currentTabType === 'text') {
        qrContent = value;
    }

    // Calculate QR size based on container
    const containerWidth = qrContainer.offsetWidth;
    const containerHeight = qrContainer.offsetHeight;
    const qrSize = Math.min(containerWidth, containerHeight) - 40;

    // Create QR code
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

    qrcode.append(qrContainer);
    
    // Add caption and download button
    createActions();
}

/* ------------------------------------------
   ACTIONS SECTION (CAPTION + DOWNLOAD)
------------------------------------------- */

function createActions() {
    const caption = captions[currentTabType];
    
    actionsContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; height: 100%; padding: 20px; gap: 25px;">
            <p style="font-size: 1.1rem; font-weight: 600; text-align: center; margin: 0px;">${caption}</p>
            <button id="download-btn" style="
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 35px;
                background-color: rgb(255, 18, 93);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                font-family: Outfit;
                cursor: pointer;
                transition: 0.2s ease;
                margin-top: 3px;
            ">
                Download
            </button>
        </div>
    `;

    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.addEventListener('mouseenter', () => {
        downloadBtn.style.backgroundColor = 'rgb(230, 16, 84)';
        downloadBtn.style.transform = 'scale(1.05)';
    });
    downloadBtn.addEventListener('mouseleave', () => {
        downloadBtn.style.backgroundColor = 'rgb(255, 18, 93)';
        downloadBtn.style.transform = 'scale(1)';
    });
    
    downloadBtn.addEventListener('click', downloadQRCode);
}

/* ------------------------------------------
   DOWNLOAD QR CODE WITH TITLE AND CAPTION
------------------------------------------- */

function downloadQRCode() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1080;
    canvas.height = 1080;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const qrSize = 700;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = (canvas.height - qrSize) / 2;
    
    // Title at top
    const titleY = qrY / 2;
    ctx.fillStyle = '#000000';
    ctx.font = '700 60px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('QR Code WebApp by Isma', canvas.width / 2, titleY);
    
    // Get QR SVG
    const qrSvg = qrContainer.querySelector('svg');
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
        
        // Ensure QR code colors are correct (RGB(255, 18, 93))
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
        
        // Caption at bottom
        const spaceBelow = canvas.height - (qrY + qrSize);
        const captionY = qrY + qrSize + (spaceBelow / 2);
        
        const caption = captions[currentTabType];
        ctx.fillStyle = '#000000';
        ctx.font = '700 40px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(caption, canvas.width / 2, captionY);
        
        // Download
        canvas.toBlob(function(blob) {
            const link = document.createElement('a');
            link.download = `qrcode-${currentTabType}-${Date.now()}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(url);
        });
    };
    
    img.src = url;
}

// Initialize on load
window.addEventListener('load', () => {
    generateQR();
});
