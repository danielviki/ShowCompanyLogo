// 添加语言配置
const translations = {
    en: {
        title: 'Corporate Directory',
        subtitle: 'Showcasing Our Business Partners',
        loading: 'Loading companies...',
        description: 'Description',
        introduction: 'Introduction',
        contact: 'Contact Information',
        website: 'Website',
        email: 'Email'
    },
    cn: {
        title: '企业名录',
        subtitle: '展示我们的合作伙伴',
        loading: '加载公司信息...',
        description: '描述',
        introduction: '简介',
        contact: '联系方式',
        website: '网站',
        email: '邮箱'
    }
};

// 当前语言
let currentLang = 'en';

// 语言切换函数
function switchLanguage(lang) {
    currentLang = lang;
    
    // 更新静态文本
    document.querySelector('.site-header h1').textContent = translations[lang].title;
    document.querySelector('.subtitle').textContent = translations[lang].subtitle;
    // document.querySelector('#loadingMessage p').textContent = translations[lang].loading;
    
    // 清空现有内容
    const container = document.getElementById('logoContainer');
    container.innerHTML = '';
    
    // 显示加载信息
    // const loadingMessage = document.getElementById('loadingMessage');
    // loadingMessage.style.display = 'block';
    
    // 重新获取并显示公司信息
    fetchCompanyLogos();
}

async function fetchCompanyLogos() {
    // const loadingMessage = document.getElementById('loadingMessage');
    const container = document.getElementById('logoContainer');
    
    try {
        const response = await fetch('http://localhost:8080/wp-json/wp/v2/company', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const companies = await response.json();
        
        if (!companies || companies.length === 0) {
            // loadingMessage.innerHTML = '<p>No companies found.</p>';
            return;
        }
        
        // loadingMessage.style.display = 'none';
        
        // 清除现有内容
        container.innerHTML = '';
        
        for (const company of companies) {
            const companyDiv = document.createElement('div');
            companyDiv.className = 'logo-item';
            
            // 添加公司名称
            companyDiv.innerHTML = `<h3>${company.title.rendered}</h3>`;
            
            // 处理公司 logo
            if (company.acf && company.acf.logo_url) {
                try {
                    const mediaResponse = await fetch(`http://localhost:8080/wp-json/wp/v2/media/${company.acf.logo_url}`);
                    if (!mediaResponse.ok) {
                        throw new Error('Media fetch failed');
                    }
                    
                    const mediaData = await mediaResponse.json();
                    
                    const imgElement = document.createElement('img');
                    imgElement.src = mediaData.link;
                    imgElement.alt = company.title.rendered;
                    imgElement.loading = 'lazy';
                    companyDiv.appendChild(imgElement);
                    
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
                    
                } catch (mediaError) {
                    console.error('Error fetching media:', mediaError);
                }
            }
            
            container.appendChild(companyDiv);
        }
    } catch (error) {
        console.error('Detailed error:', error);
        // loadingMessage.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// 添加语言选择器事件监听
document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.addEventListener('change', (e) => {
        switchLanguage(e.target.value);
    });
    
    // 初始化页面
    fetchCompanyLogos();
});