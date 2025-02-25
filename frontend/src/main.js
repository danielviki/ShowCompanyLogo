async function fetchCompanyLogos() {
    const loadingMessage = document.getElementById('loadingMessage');
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
            loadingMessage.innerHTML = '<p>No companies found.</p>';
            return;
        }
        
        loadingMessage.style.display = 'none';
        
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
                    
                    // 添加公司描述
                    if (company.acf.company_description) {
                        const descriptionDiv = document.createElement('div');
                        descriptionDiv.className = 'company-description';
                        descriptionDiv.innerHTML = company.acf.company_description;
                        companyDiv.appendChild(descriptionDiv);
                    }
                    
                } catch (mediaError) {
                    console.error('Error fetching media:', mediaError);
                }
            }
            
            container.appendChild(companyDiv);
        }
    } catch (error) {
        console.error('Detailed error:', error);
        loadingMessage.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', fetchCompanyLogos);