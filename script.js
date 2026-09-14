// ==================== Element references ====================
const menu = document.getElementById('site-menu');
const burger = document.querySelector('.burger');
const sectionLinks = document.querySelectorAll('[data-section]');
const pageSections = document.querySelectorAll('.page-section, #membership');
const copyButton = document.getElementById('copy-contract');
const contract = document.getElementById('contract');
const kekiusModel = document.getElementById('kekius-model');
const modelError = document.getElementById('model-error');
const modelLoading = document.getElementById('model-loading');
const tokenomicsStatus = document.getElementById('tokenomics-status');
const priceDisplay = document.getElementById('price');
const marketCapDisplay = document.getElementById('marketcap');
const totalSupplyDisplay = document.getElementById('total-supply');
const circulatingSupplyDisplay = document.getElementById('circulating-supply');
const holdersDisplay = document.getElementById('holders-count');
const holdersDetail = document.getElementById('holders-detail');
const tokenAgeDisplay = document.getElementById('token-age');
const marketChart = document.getElementById('market-chart');
const marketChartFrame = document.getElementById('market-chart-frame');
const galleryFilterButtons = document.querySelectorAll('.filter-btn');
const gallery = document.getElementById('gallery-grid');
const galleryItems = document.querySelectorAll('.gallery-item');
const faqItems = document.querySelectorAll('.faq-item');
const socialButtons = document.querySelectorAll('[data-social]');
const communityUpload = document.getElementById('community-upload');
const uploadStatus = document.getElementById('upload-status');

const DEXSCREENER_API_URL = 'https://api.dexscreener.com/latest/dex/tokens/';
const COINGECKO_CONTRACT_API_URL = 'https://api.coingecko.com/api/v3/coins/solana/contract/';
const COINGECKO_HOLDERS_API_URL = 'https://api.coingecko.com/api/v3/onchain/networks/solana/tokens/';
const COINGECKO_API_KEY = '';
const MARKET_DATA_REFRESH_MS = 60000;
const COMMUNITY_UPLOAD_KEY = 'kekius-community-gallery';

// ==================== Burger menu controls ====================
function setMenuState(isOpen) {
    menu.classList.toggle('is-open', isOpen);
    burger.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

function toggleMenu() {
    setMenuState(!menu.classList.contains('is-open'));
}

// ==================== Section navigation ====================
function showSection(sectionId, selectedLink) {
    pageSections.forEach((section) => {
        section.classList.toggle('is-visible', section.id === sectionId);
    });

    sectionLinks.forEach((link) => {
        link.classList.toggle('active', link === selectedLink);
    });
}

// ==================== Contract address clipboard ====================
function copyContract() {
    if (!contract || !copyButton) return;

    navigator.clipboard.writeText(contract.textContent.trim()).then(() => {
        copyButton.textContent = 'Copied';
        window.setTimeout(() => {
            copyButton.textContent = 'Copy';
        }, 1600);
    }).catch(() => {
        copyButton.textContent = 'Copy failed';
        window.setTimeout(() => {
            copyButton.textContent = 'Copy';
        }, 1600);
    });
}

function refreshGalleryFilters() {
    const items = document.querySelectorAll('.gallery-item');
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

    items.forEach((item) => {
        const matches = activeFilter === 'all' || item.dataset.category === activeFilter;
        item.classList.toggle('is-hidden', !matches);
    });
}

function saveCommunityUploads(images) {
    localStorage.setItem(COMMUNITY_UPLOAD_KEY, JSON.stringify(images));
}

function loadCommunityUploads() {
    try {
        const stored = localStorage.getItem(COMMUNITY_UPLOAD_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Unable to load community uploads:', error);
        return [];
    }
}

function renderUploadedGalleryEntries() {
    if (!gallery) return;

    const uploads = loadCommunityUploads();
    uploads.forEach((imageSrc) => {
        const article = document.createElement('article');
        article.className = 'gallery-item';
        article.dataset.category = 'community';
        article.innerHTML = `<img src="${imageSrc}" alt="Community-submitted Kekius artwork" />`;
        gallery.appendChild(article);
    });

    refreshGalleryFilters();
}

function handleCommunityUpload(event) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
        if (uploadStatus) uploadStatus.textContent = 'Please choose a valid image file.';
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const uploads = loadCommunityUploads();
        const nextUploads = [reader.result, ...uploads].slice(0, 12);
        saveCommunityUploads(nextUploads);

        const article = document.createElement('article');
        article.className = 'gallery-item';
        article.dataset.category = 'community';
        article.innerHTML = `<img src="${reader.result}" alt="Community-submitted Kekius artwork" />`;
        gallery.prepend(article);
        refreshGalleryFilters();

        if (uploadStatus) {
            uploadStatus.textContent = `${file.name} uploaded to the community gallery.`;
        }

        if (communityUpload) communityUpload.value = '';
    };

    reader.readAsDataURL(file);
}

function setupGalleryFilters() {
    if (!galleryFilterButtons.length || !galleryItems.length) return;

    galleryFilterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            galleryFilterButtons.forEach((item) => item.classList.toggle('active', item === button));
            refreshGalleryFilters();
        });
    });

    renderUploadedGalleryEntries();
}

function setupFaq() {
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        const button = item.querySelector('.faq-question');
        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            faqItems.forEach((faqItem) => faqItem.classList.toggle('active', false));
            if (!isOpen) item.classList.add('active');
        });
    });
}

function setupSocialButtons() {
    socialButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.social === 'x' ? 'https://x.com/OG_kekius_Sol' : 'https://t.me/kekius_portal_join';
            window.open(target, '_blank', 'noopener,noreferrer');
        });
    });
}

// ==================== Live tokenomics data ====================
function formatUsd(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return 'Unavailable';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: amount < 1 ? 8 : 2
    }).format(amount);
}

function formatTokenAge(createdAt) {
    if (!createdAt) return 'Unavailable';

    const createdDate = new Date(createdAt);
    const ageInDays = Math.max(0, Math.floor((Date.now() - createdDate.getTime()) / 86400000));
    const launchDate = createdDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    if (ageInDays < 1) return `Launched today · ${launchDate}`;
    if (ageInDays === 1) return `1 day · ${launchDate}`;
    if (ageInDays < 365) return `${ageInDays} days · ${launchDate}`;

    return `${Math.floor(ageInDays / 365)} years · ${launchDate}`;
}

function formatTokenAmount(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return 'Unavailable';

    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2
    }).format(amount);
}

async function loadCoinGeckoSupply(tokenAddress) {
    const response = await fetch(`${COINGECKO_CONTRACT_API_URL}${tokenAddress}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
    if (!response.ok) throw new Error(`CoinGecko request failed: ${response.status}`);

    const data = await response.json();
    const marketData = data.market_data || {};
    if (totalSupplyDisplay) totalSupplyDisplay.textContent = formatTokenAmount(marketData.max_supply ?? marketData.total_supply);
    if (circulatingSupplyDisplay) circulatingSupplyDisplay.textContent = formatTokenAmount(marketData.circulating_supply);
}

async function loadCoinGeckoHolders(tokenAddress) {
    if (!COINGECKO_API_KEY) {
        if (holdersDisplay) holdersDisplay.textContent = 'Unavailable';
        if (holdersDetail) holdersDetail.textContent = 'Holder data unavailable';
        return;
    }

    const response = await fetch(`${COINGECKO_HOLDERS_API_URL}${tokenAddress}/holders`, {
        headers: { 'x-cg-pro-api-key': COINGECKO_API_KEY }
    });
    if (!response.ok) throw new Error(`CoinGecko holders request failed: ${response.status}`);

    const data = await response.json();
    const holders = data.data?.attributes?.holders_count ?? data.holders_count ?? data.total_holders;
    if (holdersDisplay) holdersDisplay.textContent = formatTokenAmount(holders);
}

async function loadTokenomics() {
    if (!contract || !priceDisplay || !marketCapDisplay) return;

    try {
        const tokenAddress = contract.textContent.trim();
        const [dexscreenerResult, supplyResult, holdersResult] = await Promise.allSettled([
            fetch(`${DEXSCREENER_API_URL}${tokenAddress}`),
            loadCoinGeckoSupply(tokenAddress),
            loadCoinGeckoHolders(tokenAddress)
        ]);
        if (supplyResult.status === 'rejected') {
            if (totalSupplyDisplay) totalSupplyDisplay.textContent = 'Unavailable';
            if (circulatingSupplyDisplay) circulatingSupplyDisplay.textContent = 'Unavailable';
        }
        if (holdersResult.status === 'rejected') {
            if (holdersDisplay) holdersDisplay.textContent = 'Unavailable';
            if (holdersDetail) holdersDetail.textContent = 'CoinGecko holders data unavailable';
        }
        if (dexscreenerResult.status === 'rejected') throw dexscreenerResult.reason;

        const response = dexscreenerResult.value;
        if (!response.ok) throw new Error(`Dexscreener request failed: ${response.status}`);

        const result = await response.json();
        const pair = result.pairs
            ?.filter((item) => item.chainId === 'solana')
            .sort((first, second) => (second.liquidity?.usd || 0) - (first.liquidity?.usd || 0))[0];

        if (!pair) throw new Error('No Solana trading pair found');

        priceDisplay.textContent = formatUsd(pair.priceUsd);
        marketCapDisplay.textContent = formatUsd(pair.marketCap);
        if (tokenAgeDisplay) tokenAgeDisplay.textContent = formatTokenAge(pair.pairCreatedAt);
        if (marketChart && marketChartFrame && pair.pairAddress) {
            marketChartFrame.src = `https://dexscreener.com/${pair.chainId}/${pair.pairAddress}?embed=1&theme=dark&trades=0&info=0`;
            marketChart.classList.add('is-ready');
        }
        if (tokenomicsStatus) {
            tokenomicsStatus.textContent = `Live data from ${pair.dexId || 'Dexscreener'} · Updated ${new Date().toLocaleTimeString()}`;
        }
    } catch (error) {
        priceDisplay.textContent = 'Unavailable';
        marketCapDisplay.textContent = 'Unavailable';
        if (tokenAgeDisplay) tokenAgeDisplay.textContent = 'Unavailable';
        if (totalSupplyDisplay) totalSupplyDisplay.textContent = 'Unavailable';
        if (circulatingSupplyDisplay) circulatingSupplyDisplay.textContent = 'Unavailable';
        if (holdersDisplay) holdersDisplay.textContent = 'Unavailable';
        if (tokenomicsStatus) tokenomicsStatus.textContent = 'Live market data is currently unavailable.';
        console.error('Unable to load Dexscreener token data:', error);
    }
}

// ==================== Event listeners ====================
if (burger) {
    burger.addEventListener('click', toggleMenu);
}

sectionLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(link.dataset.section, link);
        setMenuState(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

document.addEventListener('click', (event) => {
    if (menu && menu.classList.contains('is-open') && !menu.contains(event.target) && !burger.contains(event.target)) {
        setMenuState(false);
    }
});

if (copyButton) {
    copyButton.addEventListener('click', copyContract);
}

if (communityUpload) {
    communityUpload.addEventListener('change', handleCommunityUpload);
}

setupGalleryFilters();
setupFaq();
setupSocialButtons();

// ==================== 3D model error handling ====================
if (kekiusModel && modelError) {
    const hideModelLoading = () => modelLoading?.classList.add('is-hidden');

    kekiusModel.addEventListener('load', () => {
        hideModelLoading();
    });

    kekiusModel.addEventListener('error', () => {
        hideModelLoading();
        modelError.classList.add('is-visible');
    });

    if (kekiusModel.loaded || kekiusModel.modelIsVisible) hideModelLoading();
}

// ==================== Initial page state ====================
showSection('home', document.querySelector('[data-section="home"]'));
loadTokenomics();
window.setInterval(loadTokenomics, MARKET_DATA_REFRESH_MS);
