// Add this temporarily at the top of main.js
console.log('Environment check:', {
    apiUrl: process.env?.VITE_API_URL,
    username: process.env?.VITE_WP_USERNAME,
    password: process.env?.VITE_WP_PASSWORD
});

/*
console.log('import.meta:', import.meta);  // 打印 import.meta 对象
console.log('import.meta.env:', import.meta.env);  // 打印环境变量
console.log('Environment Debug:', {
    all: import.meta.env,
    apiUrl: import.meta.env.VITE_API_URL,
    username: import.meta.env.VITE_WP_USERNAME,
});
*/

import { authService } from './services/auth.js';

// Language translations
const translations = {
    en: {
        title: 'Corporate Directory',
        subtitle: 'Showcasing Our Business Partners',
        description: 'Description',
        introduction: 'Introduction',
        contact: 'Contact Information',
        website: 'Website',
        email: 'Email'
    },
    cn: {
        title: '企业名录',
        subtitle: '展示我们的合作伙伴',
        description: '描述',
        introduction: '简介',
        contact: '联系方式',
        website: '网站',
        email: '邮箱'
    }
};

let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update static text
    document.querySelector('.site-header h1').textContent = translations[lang].title;
    document.querySelector('.subtitle').textContent = translations[lang].subtitle;
    
    // Clear existing content
    const container = document.getElementById('logoContainer');
    container.innerHTML = '';
    
    // Refetch and display company information
    fetchCompanyLogos();
}

async function fetchCompanyLogos() {
    const container = document.getElementById('logoContainer');
    
    try {
        const response = await authService.fetchWithAuth(
            `${process.env.VITE_API_URL}/wp-json/wp/v2/company`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const companies = await response.json();
        container.innerHTML = '';
        
        for (const company of companies) {
            await renderCompany(company, container);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function renderCompany(company, container) {
    if (company.acf && company.acf.logo_url) {
        try {
            const companyDiv = document.createElement('div');
            companyDiv.className = 'company-item';

            // Fetch logo URL
            const logoUrl = await authService.fetchMediaWithAuth(company.acf.logo_url);
            
            // Create and append logo
            const logoImg = document.createElement('img');
            logoImg.src = logoUrl;
            logoImg.alt = company.title.rendered;
            logoImg.className = 'company-logo';
            
            // Add error handling for images
            logoImg.onerror = () => {
                console.error(`Failed to load image for company: ${company.title.rendered}`);
                logoImg.src = 'placeholder.png'; // Add a placeholder image
            };

            companyDiv.appendChild(logoImg);
            
            // 添加公司名称
            companyDiv.innerHTML += `<h3>${company.title.rendered}</h3>`;
            
            // 添加公司信息区域
            const infoDiv = document.createElement('div');
            infoDiv.className = 'company-info';
            
            // 添加公司描述
            if (currentLang === 'cn' && company.acf.company_description_cn) {
                infoDiv.innerHTML += `
                    <div class="company-description">
                        <h4>${translations[currentLang].description}</h4>
                        <p>${company.acf.company_description_cn}</p>
                    </div>
                `;
            } else if (company.acf.company_description) {
                infoDiv.innerHTML += `
                    <div class="company-description">
                        <h4>${translations[currentLang].description}</h4>
                        <p>${company.acf.company_description}</p>
                    </div>
                `;
            }

            // 添加公司简介
            if (currentLang === 'cn' && company.acf.company_intro_cn) {
                infoDiv.innerHTML += `
                    <div class="company-intro">
                        <h4>${translations[currentLang].introduction}</h4>
                        <p>${company.acf.company_intro_cn}</p>
                    </div>
                `;
            } else if (company.acf.company_intro) {
                infoDiv.innerHTML += `
                    <div class="company-intro">
                        <h4>${translations[currentLang].introduction}</h4>
                        <p>${company.acf.company_intro}</p>
                    </div>
                `;
            }
            
            // 添加联系信息
            const contactDiv = document.createElement('div');
            contactDiv.className = 'company-contact';
            
            if (company.acf.company_website || company.acf.contact_email) {
                contactDiv.innerHTML = `<h4>${translations[currentLang].contact}</h4>`;
            }
            
            if (company.acf.company_website) {
                contactDiv.innerHTML += `
                    <p><strong>${translations[currentLang].website}:</strong> 
                        <a href="${company.acf.company_website}" target="_blank" rel="noopener noreferrer">
                            ${company.acf.company_website}
                        </a>
                    </p>
                `;
            }
            
            if (company.acf.contact_email) {
                contactDiv.innerHTML += `
                    <p><strong>${translations[currentLang].email}:</strong> 
                        <a href="mailto:${company.acf.contact_email}">
                            ${company.acf.contact_email}
                        </a>
                    </p>
                `;
            }
            
            if (contactDiv.innerHTML) {
                infoDiv.appendChild(contactDiv);
            }
            companyDiv.appendChild(infoDiv);
            
            container.appendChild(companyDiv);
            
        } catch (mediaError) {
            console.error('Error fetching media:', mediaError);
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Authenticate user
        await authService.authenticate();
        
        // Set up language switcher
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                switchLanguage(e.target.value);
            });
        }
        
        // Initialize page with company logos
        fetchCompanyLogos();
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
});