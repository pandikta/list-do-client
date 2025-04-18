// Simpan Secret Key dalam Base64 untuk menghindari hardcode langsung
const ENCODED_SECRET_KEY = "Y29iYWNvYmExMjM=";
const GITHUB_USERNAME = "pandikta"; 
const GITHUB_REPO = "listfile";
const GITHUB_PAT = "Z2hwX3dlQnk5enBSQkdiZkd0NWFPaWxEdk5MQ1prQnlZaDJERVJOZw==";

// localStorage.clear();

const EXPIRATION_TIME = 5 * 60 * 1000; // 5 menit dalam milidetik

function setWithExpiry(key, value) {
    const now = new Date().getTime();
    const item = { value, expiry: now + EXPIRATION_TIME };
    localStorage.setItem(key, JSON.stringify(item));
    
}

function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

function clearExpiredStorage() {
    Object.keys(localStorage).forEach(key => {
        getWithExpiry(key); // Ini akan otomatis hapus jika sudah expired
    });
}


document.addEventListener("DOMContentLoaded", clearExpiredStorage);


document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("authenticated") === "true") {
        showContent();
    }
});

function getSecretKey() {
    return atob(ENCODED_SECRET_KEY);
}

function checkKey() {
    let inputKey = document.getElementById("secret-key").value;
    if (inputKey === getSecretKey()) {
        // localStorage.setItem("authenticated", "true");
        // Simpan data dengan batas waktu 5 menit
        setWithExpiry("authenticated", "true");
        showContent();
    } else {
        document.getElementById("error-msg").innerText = "Wrong Key!";
    }
}

function showContent() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("content-container").classList.remove("hidden");
    loadCredentials();
}

// // Load credentials from GitHub
async function loadCredentials() {
    let tableBody = document.getElementById("credential-list");
    let secretKey = getSecretKey(); // Gunakan secret key

    try {
        let credentials = await fetchGitHubFile();
        credentials.forEach(item => {
            
            // let decryptedLink = decryptData(item.link, secretKey);
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td><a href="${item.download_url}" target="_blank">Click</a></td>
                <td><button class="copy-btn" onclick="copyToClipboard('${item.download_url}')">📋 Copy</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading credentials:", error);
    }
}


async function fetchGitHubFile() {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents`;
    const token = atob(GITHUB_PAT)
    const response = await fetch(url, {
        headers: {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github.v3.raw"
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch GitHub file: ${response.status}`);
    }

    return response.json(); // Mengembalikan data JSON
}

// // Enkripsi data menggunakan AES (CryptoJS)
// function encryptData(text, key) {
//     return CryptoJS.AES.encrypt(text, key).toString();
// }

// // Dekripsi data menggunakan AES (CryptoJS)
// function decryptData(ciphertext, key) {
//     let bytes = CryptoJS.AES.decrypt(ciphertext, key);
//     return bytes.toString(CryptoJS.enc.Utf8);
// }

// Salin ke clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied: " + text);
    });
}

// Toggle Password Visibility
function togglePassword() {
    let inputField = document.getElementById("secret-key");
    let eyeOpen = document.getElementById("eye_open");
    let eyeSlash = document.getElementById("eye_slash");

    if (inputField.type === "password") {
        eyeOpen.style.display = "none";
        eyeSlash.style.display = "block";
        inputField.type = "text";
    } else {
        eyeOpen.style.display = "block";
        eyeSlash.style.display = "none";
        inputField.type = "password";
    }
}


// async function listRepositoryFiles() {
//     const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/`;

//     try {
//         const response = await fetch(url, {
//             headers: {
//                 "Authorization": `token ${GITHUB_PAT}`,
//                 "Accept": "application/vnd.github.v3+json"
//             }
//         });
//         if (!response.ok) {
//             throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
//         }
        
//         const data = await response.json();
//         console.log(data)
        

//         // Tampilkan di halaman HTML (jika ada)
//         const fileList = document.getElementById("file-list");
//         fileList.innerHTML = ""; // Kosongkan sebelum menambahkan
//         data.forEach(file => {
//             let listItem = document.createElement("li");
//             listItem.innerHTML = `<a href="${file.download_url}" target="_blank">${file.name}</a>`;
//             fileList.appendChild(listItem);
//         });

//     } catch (error) {
//         // console.error("Error fetching repository files:", error);
//     }
// }

// // Jalankan fungsi untuk mendapatkan daftar file
// listRepositoryFiles();