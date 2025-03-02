import { authService } from './services/auth.js';
import { ImageLoader } from './services/imageLoader.js';

// Language translation configuration / 语言翻译配置
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

let currentLang = 'en'; // Current language state / 当前语言状态

// Switch application language / 切换应用程序语言
function switchLanguage(lang) {
    currentLang = lang;

    // Update static text (Navbar title)
    const navbarTitle = document.querySelector('.navbar-title');
    if (navbarTitle) {
        navbarTitle.textContent = translations[lang].title;
    }

    // Update subtitle text
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        subtitle.textContent = translations[lang].subtitle;
    }

    // Clear existing content
    const container = document.getElementById('logoContainer');
    if (container) {
        container.innerHTML = '';
    }

    // Refetch and display company information
    fetchCompanyLogos();
}

// Fetch and display company logos and information / 获取并展示公司logo及信息
async function fetchCompanyLogos() {
    const container = document.getElementById('logoContainer');
    if (!container) return; // Exit if container is not found

    try {
        // Authenticate before fetching data
        if (!authService.isAuthenticated()) {
            await authService.authenticate();
        }
        
        const response = await authService.fetchWithAuth(
            `${authService.apiUrl}/wp-json/wp/v2/company`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const companies = await response.json();
        container.innerHTML = ''; // Clear existing content

        // Render each company
        for (const company of companies) {
            await renderCompany(company, container);
        }

        // Initialize image lazy loading after all companies are rendered
        const imageLoader = new ImageLoader();
        imageLoader.init();
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p>Failed to load company information.</p>'; // Display error message
    }
}

// Render individual company information / 渲染单个公司信息
async function renderCompany(company, container) {
    if (!company.acf || !company.acf.logo_url) return; // Exit if missing necessary data

    try {
        const companyDiv = document.createElement('div');
        companyDiv.className = 'company-item';

        // Fetch logo URL
        const logoUrl = await authService.fetchMediaWithAuth(company.acf.logo_url);

        // Create and append logo
        const logoImg = document.createElement('img');
        logoImg.setAttribute('data-src', logoUrl);
        logoImg.alt = company.title.rendered;
        logoImg.className = 'company-logo lazy-load';
        logoImg.src = './src/assets/placeholder.png';
        logoImg.dataset.loaded = 'false';

        // Add error handling for images
        logoImg.onerror = () => {
            console.error(`Failed to load image for company: ${company.title.rendered}`);
            logoImg.src = './src/assets/placeholder.png';
        };

        companyDiv.appendChild(logoImg);

        // Add company name
        companyDiv.innerHTML += `<h3>${company.title.rendered}</h3>`;

        // Add company information area
        const infoDiv = document.createElement('div');
        infoDiv.className = 'company-info';

        // Add company description
        const description = currentLang === 'cn' && company.acf.company_description_cn
            ? company.acf.company_description_cn
            : company.acf.company_description;
        if (description) {
            infoDiv.innerHTML += `
                <div class="company-description">
                    <h4>${translations[currentLang].description}</h4>
                    <p>${description}</p>
                </div>
            `;
        }

        // Add company introduction
        const introduction = currentLang === 'cn' && company.acf.company_intro_cn
            ? company.acf.company_intro_cn
            : company.acf.company_intro;
        if (introduction) {
            infoDiv.innerHTML += `
                <div class="company-intro">
                    <h4>${translations[currentLang].introduction}</h4>
                    <p>${introduction}</p>
                </div>
            `;
        }

        // Add contact information
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
        console.error(`Error fetching or rendering company ${company.title.rendered}:`, mediaError);
    }
}

// Application initialization / 应用程序初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Set up language switcher
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                switchLanguage(e.target.value);
            });
        }

        // Initial fetch of company data
        await fetchCompanyLogos();
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
});
