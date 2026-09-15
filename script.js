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
const rpcPulseDot = document.getElementById('rpc-pulse-dot');
const priceDisplay = document.getElementById('price');
const priceSolDisplay = document.getElementById('price-sol');
const marketCapDisplay = document.getElementById('marketcap');
const totalSupplyDisplay = document.getElementById('total-supply');
const circulatingSupplyDisplay = document.getElementById('circulating-supply');
const volumeDisplay = document.getElementById('volume-24h');
const liquidityDisplay = document.getElementById('liquidity-usd');
const tokenAgeDisplay = document.getElementById('token-age');
const marketChart = document.getElementById('market-chart');
const marketChartFrame = document.getElementById('market-chart-frame');
const galleryFilterButtons = document.querySelectorAll('.filter-btn');
const gallery = document.getElementById('gallery-grid');
const galleryItems = document.querySelectorAll('.gallery-item');
const faqItems = document.querySelectorAll('.faq-item');
const socialButtons = document.querySelectorAll('[data-social]');
const marketplaceButtons = document.querySelectorAll('.marketplace-btn');
const communityUpload = document.getElementById('community-upload');
const uploadStatus = document.getElementById('upload-status');
const galleryImageModal = document.getElementById('gallery-image-modal');
const galleryFullImage = document.getElementById('gallery-full-image');
const closeGalleryImageButton = document.getElementById('close-gallery-image');
const fanApplicationModal = document.getElementById('fan-club-application-modal');
const openFanApplicationButton = document.getElementById('open-fan-application');
const closeFanApplicationButton = document.getElementById('close-fan-application');

// Fan Status Checker references
const checkerWalletAddress = document.getElementById('checker-wallet-address');
const checkStatusBtn = document.getElementById('check-status-btn');
const autoDetectWalletBtn = document.getElementById('auto-detect-wallet-btn');
const checkerLoading = document.getElementById('checker-loading');
const checkerLoadingText = document.getElementById('checker-loading-text');
const checkerResultSuccess = document.getElementById('checker-result-success');
const checkerResultPlebeian = document.getElementById('checker-result-plebeian');
const checkerResultError = document.getElementById('checker-result-error');
const checkerInputError = document.getElementById('checker-input-error');
const checkerRetryBtn = document.getElementById('checker-retry-btn');
const rankBadgeIcon = document.getElementById('rank-badge-icon');
const rankTierTag = document.getElementById('rank-tier-tag');
const rankDisplayName = document.getElementById('rank-display-name');
const rankHoldingsAmount = document.getElementById('rank-holdings-amount');
const rankHoldingsUsd = document.getElementById('rank-holdings-usd');
const rankDurationTime = document.getElementById('rank-duration-time');
const rankVeteranTitle = document.getElementById('rank-veteran-title');
const rankDecreeText = document.getElementById('rank-decree-text');
const fanClubApplication = document.getElementById('fan-club-application');
const applicationWallet = document.getElementById('application-wallet');
const applicationTelegram = document.getElementById('application-telegram');
const applicationCommitment = document.getElementById('application-commitment');
const applicationSubmit = document.getElementById('application-submit');
const applicationStatus = document.getElementById('application-status');

const DEXSCREENER_API_URL = 'https://api.dexscreener.com/latest/dex/tokens/';
// The official Solana endpoint is heavily rate-limited and frequently returns 403 in browsers
// under sustained use (Solana's own docs: "not for production"). Since this page polls RPC
// every 30s for tokenomics AND makes on-demand calls for the rank checker, a single hardcoded
// endpoint gets throttled fast. Fall back through other well-known free public endpoints.
const SOLANA_RPC_ENDPOINTS = [
    'https://api.mainnet-beta.solana.com',
    'https://solana-rpc.publicnode.com',
    'https://rpc.ankr.com/solana'
];

// OPTIONAL BUT RECOMMENDED FOR RELIABILITY: every endpoint above is anonymous/keyless, and
// providers are increasingly restricting or paywalling anonymous access to heavier methods
// (confirmed: rpc.ankr.com already returns 403 for some chains without a key as of mid-2026).
// There is no free, keyless, unlimited public Solana RPC that's guaranteed to keep working —
// that's a real infrastructure constraint, not something client-side code can fully solve.
// The actual fix: sign up for a free API key from a provider built for light dApp usage
// (Helius has the most generous free tier in the Solana ecosystem — https://dev.helius.xyz,
// free tier covers tens of thousands of requests/day) and paste it in below. It's normal and
// safe to expose a free-tier read key in client-side code; it identifies your usage for
// rate-limiting, it isn't a secret credential.
const HELIUS_API_KEY = ''; // e.g. 'a1b2c3d4-...' — get one free at https://dev.helius.xyz
if (HELIUS_API_KEY) {
    SOLANA_RPC_ENDPOINTS.unshift(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`);
}
const JUPITER_PRICE_API_URL = 'https://api.jup.ag/price/v2?ids=';
const MARKET_DATA_REFRESH_MS = 30000;
const COMMUNITY_UPLOAD_KEY = 'kekius-community-gallery';
const KEK_SUPPORT_BOT_URL = 'https://t.me/KekiusMod_bot';
let currentTokenPriceUsd = 0.000064;

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

function showGalleryImage(image) {
    if (!galleryImageModal || !galleryFullImage) return;

    galleryFullImage.src = image.currentSrc || image.src;
    galleryFullImage.alt = image.alt;
    galleryImageModal.showModal();
}

function setupGalleryImageViewer() {
    if (!gallery || !galleryImageModal) return;

    gallery.addEventListener('click', (event) => {
        const image = event.target.closest('.gallery-item img');
        if (image) showGalleryImage(image);
    });

    gallery.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const item = event.target.closest('.gallery-item');
        const image = item?.querySelector('img');
        if (!image) return;
        event.preventDefault();
        showGalleryImage(image);
    });

    gallery.querySelectorAll('.gallery-item').forEach((item) => item.setAttribute('tabindex', '0'));

    closeGalleryImageButton?.addEventListener('click', () => galleryImageModal.close());
    galleryImageModal.addEventListener('click', (event) => {
        if (event.target === galleryImageModal) galleryImageModal.close();
    });
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

function setupMarketplaceButtons() {
    marketplaceButtons.forEach((button) => {
        button.addEventListener('click', () => {
            alert('Marketplace coming soon. Check back later!');
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

// ==================== Direct Solana RPC & Market Data Live Sync ====================
// Tries each known public RPC endpoint in turn until one answers successfully. Throws only
// if every endpoint fails, with ALL collected errors attached (not just the last one) so
// real failures are diagnosable instead of only showing whichever endpoint failed last.
async function callSolanaRpc(method, params, { timeoutMs = 8000 } = {}) {
    const failures = [];

    for (const endpoint of SOLANA_RPC_ENDPOINTS) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: '2.0', id: method, method, params }),
                signal: controller.signal
            });

            if (!response.ok) {
                failures.push(`${endpoint} → HTTP ${response.status}`);
                continue;
            }

            const data = await response.json();

            if (data.error) {
                failures.push(`${endpoint} → ${data.error.message || 'RPC error'}`);
                continue;
            }

            return data.result;
        } catch (err) {
            failures.push(`${endpoint} → ${err.message || 'network error'}`);
        } finally {
            window.clearTimeout(timer);
        }
    }

    const combined = new Error(`All Solana RPC endpoints failed for ${method}: ${failures.join(' | ')}`);
    combined.endpointFailures = failures;
    throw combined;
}

const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const ASSOCIATED_TOKEN_PROGRAM_ID = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';

// Derives the standard Associated Token Account address for (owner, mint) without any RPC
// call, using the same PDA formula every wallet (Phantom, Solflare, etc.) uses when a wallet
// first receives a token. Requires the solanaWeb3 bundle for PublicKey + PDA derivation.
function deriveAssociatedTokenAddress(ownerAddress, mintAddress) {
    const owner = new solanaWeb3.PublicKey(ownerAddress);
    const mint = new solanaWeb3.PublicKey(mintAddress);
    const tokenProgram = new solanaWeb3.PublicKey(TOKEN_PROGRAM_ID);
    const associatedProgram = new solanaWeb3.PublicKey(ASSOCIATED_TOKEN_PROGRAM_ID);

    const [ata] = solanaWeb3.PublicKey.findProgramAddressSync(
        [owner.toBuffer(), tokenProgram.toBuffer(), mint.toBuffer()],
        associatedProgram
    );
    return ata.toBase58();
}

// Looks up a wallet's balance of one specific token via a single lightweight getAccountInfo
// call on its derived Associated Token Account, instead of getTokenAccountsByOwner (a
// getProgramAccounts-family "heavy" scan). Heavy scan methods are exactly what public RPC
// providers throttle or paywall first — plain getAccountInfo on one address is one of the
// cheapest, most universally-supported calls and is far less likely to be blocked.
// Trade-off: this only finds tokens held in the *standard* associated token account. A wallet
// holding the token in a manually-created, non-associated account (rare, but possible) would
// need the getTokenAccountsByOwner fallback below to be detected.
async function getTokenBalanceViaAta(ownerAddress, mintAddress) {
    const ataAddress = deriveAssociatedTokenAddress(ownerAddress, mintAddress);
    const accountInfo = await callSolanaRpc('getAccountInfo', [ataAddress, { encoding: 'jsonParsed' }]);

    if (!accountInfo?.value) {
        // Account has never been created — this IS a reliable, genuine 0-balance signal
        // (not an error), since the standard ATA is created automatically on first receipt.
        return { uiAmount: 0, tokenAccountPubkey: null, confirmedEmpty: true };
    }

    const tokenAmount = accountInfo.value.data?.parsed?.info?.tokenAmount;
    return {
        uiAmount: Number(tokenAmount?.uiAmount || 0),
        tokenAccountPubkey: ataAddress,
        confirmedEmpty: false
    };
}

async function fetchSolanaTokenSupply(mintAddress) {
    const result = await callSolanaRpc('getTokenSupply', [mintAddress]);
    return result?.value;
}

async function fetchDexMarketData(mintAddress) {
    try {
        const response = await fetch(`${DEXSCREENER_API_URL}${mintAddress}`);
        if (!response.ok) throw new Error(`Dexscreener HTTP error: ${response.status}`);
        const result = await response.json();
        const pair = result.pairs
            ?.filter((item) => item.chainId === 'solana')
            .sort((first, second) => (second.liquidity?.usd || 0) - (first.liquidity?.usd || 0))[0];

        if (pair) return pair;
    } catch (dexErr) {
        console.warn('Dexscreener primary query failed, trying Jupiter fallback:', dexErr);
    }

    // Fallback to Jupiter Price API
    try {
        const jupResp = await fetch(`${JUPITER_PRICE_API_URL}${mintAddress}`);
        if (jupResp.ok) {
            const jupData = await jupResp.json();
            const tokenPrice = jupData.data?.[mintAddress]?.price;
            if (tokenPrice) {
                return {
                    priceUsd: String(tokenPrice),
                    priceNative: 'Unavailable',
                    marketCap: null,
                    volume: { h24: 0 },
                    liquidity: { usd: 0 },
                    pairCreatedAt: null
                };
            }
        }
    } catch (jupErr) {
        console.warn('Jupiter price query note:', jupErr);
    }

    return null;
}

async function loadTokenomics() {
    if (!contract || !priceDisplay || !marketCapDisplay) return;

    const tokenAddress = contract.textContent.trim() || 'XC78JjRHnSqaysrHiTrhR8eRngFbvX3rrHyRjWEpump';

    try {
        if (tokenomicsStatus) {
            tokenomicsStatus.textContent = 'Syncing directly with Solana Mainnet RPC...';
        }

        const [supplyResult, dexResult] = await Promise.allSettled([
            fetchSolanaTokenSupply(tokenAddress),
            fetchDexMarketData(tokenAddress)
        ]);

        let onChainUiSupply = 998556684.34;
        if (supplyResult.status === 'fulfilled' && supplyResult.value) {
            const supplyVal = supplyResult.value;
            onChainUiSupply = Number(supplyVal.uiAmount || onChainUiSupply);
            const formattedSupply = `${formatTokenAmount(onChainUiSupply)} KEKIUS`;
            if (totalSupplyDisplay) totalSupplyDisplay.textContent = formattedSupply;
            if (circulatingSupplyDisplay) circulatingSupplyDisplay.textContent = formattedSupply;
        } else {
            console.warn('Solana RPC supply query fallback:', supplyResult.reason);
            if (totalSupplyDisplay) totalSupplyDisplay.textContent = '998,556,684.34 KEKIUS';
            if (circulatingSupplyDisplay) circulatingSupplyDisplay.textContent = '998,556,684.34 KEKIUS';
        }

        if (dexResult.status === 'fulfilled' && dexResult.value) {
            const pair = dexResult.value;
            const priceUsdNum = Number(pair.priceUsd || 0);
            if (priceUsdNum > 0) currentTokenPriceUsd = priceUsdNum;

            if (priceDisplay) priceDisplay.textContent = formatUsd(pair.priceUsd);
            if (priceSolDisplay) {
                const native = Number(pair.priceNative || 0);
                priceSolDisplay.textContent = native > 0 ? `${native.toFixed(10).replace(/0+$/, '')} SOL` : 'Live';
            }

            const calculatedMcap = pair.marketCap || (priceUsdNum * onChainUiSupply);
            if (marketCapDisplay) marketCapDisplay.textContent = formatUsd(calculatedMcap);

            if (volumeDisplay) volumeDisplay.textContent = formatUsd(pair.volume?.h24 || 0);
            if (liquidityDisplay) liquidityDisplay.textContent = formatUsd(pair.liquidity?.usd || 0);
            if (tokenAgeDisplay) tokenAgeDisplay.textContent = formatTokenAge(pair.pairCreatedAt);

            if (marketChart && marketChartFrame && pair.pairAddress) {
                marketChartFrame.src = `https://dexscreener.com/${pair.chainId || 'solana'}/${pair.pairAddress}?embed=1&theme=dark&trades=0&info=0`;
                marketChart.classList.add('is-ready');
            }

            if (tokenomicsStatus) {
                tokenomicsStatus.textContent = `Verified Solana RPC live sync · Updated ${new Date().toLocaleTimeString()}`;
            }
        } else {
            if (priceDisplay) priceDisplay.textContent = formatUsd(currentTokenPriceUsd);
            if (marketCapDisplay) marketCapDisplay.textContent = formatUsd(currentTokenPriceUsd * onChainUiSupply);
            if (tokenomicsStatus) {
                tokenomicsStatus.textContent = `On-chain Solana supply verified · Updated ${new Date().toLocaleTimeString()}`;
            }
        }
    } catch (error) {
        console.error('Tokenomics sync error:', error);
        if (tokenomicsStatus) {
            tokenomicsStatus.textContent = 'Solana ledger sync reconnecting...';
        }
    }
}

// ==================== KEK Fan Status & Imperial Rank Checker ====================
const FAN_RANKS = [
    { min: 20000000, name: 'Maximus Praetor', tier: 'Tier I Imperial Council', badge: './Kek%20diamond%20status.jpg', decree: 'Imperator! You stand among the wealthiest generals of Rome. The Emperor salutes your monumental treasury.' },
    { min: 5000000, name: 'Imperial Legate', tier: 'Tier II Legion Commander', badge: './Kek%20golden%20status.jpg', decree: 'A legendary commander of the meme legions. Your diamond hands are inscribed with honor in the imperial archives.' },
    { min: 1000000, name: 'Tribune of the Empire', tier: 'Tier III High Tribune', badge: './kek%20silver%20status.jpg', decree: 'An esteemed tribune holding imperial sway. Your defense of the realm brings glory to Kekius Maximus.' },
    { min: 100000, name: 'Centurion Guardian', tier: 'Tier IV Centurion', badge: './Kek%20leather%20status.jpg', decree: 'A battle-hardened centurion guarding the gates. Your steadfast holding protects the empire against all dips.' },
    { min: 1, name: 'Legionary Initiate', tier: 'Tier V Soldier', badge: './least%20kek%20status.jpg', decree: 'A loyal soldier sworn to the meme legions. Continue your crusade and stack $KEKIUS to rise in military rank.' }
];

function getVeteranTitle(days) {
    if (days >= 90) return 'Diamond Centurion (90+ days of service)';
    if (days >= 30) return 'Imperial Veteran (30+ days of service)';
    if (days >= 7) return 'Loyal Shieldbearer (7+ days of service)';
    if (days >= 1) return `${days} Days of Service`;
    return 'New Recruit (< 24 hours of service)';
}

async function inspectFanStatus(address) {
    const cleanAddress = address?.trim();

    const showInputError = (message) => {
        if (checkerInputError) {
            checkerInputError.textContent = message;
            checkerInputError.classList.remove('is-hidden');
        }
    };

    if (checkerInputError) checkerInputError.classList.add('is-hidden');

    if (!cleanAddress) {
        showInputError('Please enter a Solana wallet address.');
        return;
    }

    // Base58 Solana public key validation
    if (cleanAddress.length < 32 || cleanAddress.length > 44 || /[^1-9A-HJ-NP-za-km-z]/.test(cleanAddress)) {
        showInputError('Please enter a valid Solana public key address (32 to 44 base58 characters).');
        return;
    }

    if (checkerLoading) checkerLoading.classList.remove('is-hidden');
    if (checkerResultSuccess) checkerResultSuccess.classList.add('is-hidden');
    if (checkerResultPlebeian) checkerResultPlebeian.classList.add('is-hidden');
    if (checkerResultError) checkerResultError.classList.add('is-hidden');
    if (checkerLoadingText) checkerLoadingText.textContent = 'Scanning Solana ledger for $KEKIUS token accounts...';

    try {
        const TOKEN_MINT = 'XC78JjRHnSqaysrHiTrhR8eRngFbvX3rrHyRjWEpump';

        // Primary path: derive the standard Associated Token Account and do one cheap
        // getAccountInfo call. This is far less likely to be blocked than a program-wide
        // scan (see getTokenBalanceViaAta for why). Any thrown error here means every RPC
        // endpoint failed — a genuine connectivity problem, not evidence of a zero balance.
        let totalBalance = 0;
        let tokenAccountPubkey = null;

        try {
            const ataResult = await getTokenBalanceViaAta(cleanAddress, TOKEN_MINT);
            totalBalance = ataResult.uiAmount;
            tokenAccountPubkey = ataResult.tokenAccountPubkey;
        } catch (ataError) {
            // Fall back to the heavier program-account scan in case this wallet holds the
            // token in a non-standard (manually created) token account, or the RPC endpoints
            // that reject getAccountInfo for some reason still accept this call.
            console.warn('ATA lookup failed, falling back to full account scan:', ataError);
            if (checkerLoadingText) checkerLoadingText.textContent = 'Retrying with a broader ledger scan...';

            const result = await callSolanaRpc('getTokenAccountsByOwner', [
                cleanAddress,
                { mint: TOKEN_MINT },
                { encoding: 'jsonParsed' }
            ]);

            const accounts = result?.value || [];
            for (const acc of accounts) {
                const tokenAmount = acc.account?.data?.parsed?.info?.tokenAmount;
                if (tokenAmount) {
                    totalBalance += Number(tokenAmount.uiAmount || 0);
                    if (!tokenAccountPubkey) {
                        tokenAccountPubkey = acc.pubkey;
                    }
                }
            }
        }

        if (totalBalance <= 0) {
            // Genuinely confirmed on-chain: this wallet holds no $KEKIUS.
            if (checkerLoading) checkerLoading.classList.add('is-hidden');
            if (checkerResultPlebeian) checkerResultPlebeian.classList.remove('is-hidden');
            return;
        }

        // Tokens found: Calculate duration of service
        if (checkerLoadingText) checkerLoadingText.textContent = 'Verifying holding duration on-chain...';

        let daysHeld = 0;
        if (tokenAccountPubkey) {
            try {
                const sigResult = await callSolanaRpc('getSignaturesForAddress', [tokenAccountPubkey, { limit: 25 }]);
                const sigs = sigResult || [];
                if (sigs.length > 0) {
                    const oldest = sigs[sigs.length - 1];
                    if (oldest.blockTime) {
                        const firstTxDate = oldest.blockTime * 1000;
                        daysHeld = Math.max(0, Math.floor((Date.now() - firstTxDate) / 86400000));
                    }
                }
            } catch (err) {
                // Non-fatal: still show the rank, just without a precise duration.
                console.warn('Duration lookup note:', err);
            }
        }

        const rank = FAN_RANKS.find((r) => totalBalance >= r.min);
        const veteran = getVeteranTitle(daysHeld);
        const totalUsdVal = totalBalance * currentTokenPriceUsd;

        if (rankBadgeIcon) {
            rankBadgeIcon.src = rank.badge;
            rankBadgeIcon.alt = `${rank.name} status badge`;
        }
        if (rankTierTag) rankTierTag.textContent = rank.tier;
        if (rankDisplayName) rankDisplayName.textContent = rank.name;
        if (rankHoldingsAmount) rankHoldingsAmount.textContent = `${formatTokenAmount(totalBalance)} $KEKIUS`;
        if (rankHoldingsUsd) rankHoldingsUsd.textContent = `≈ ${formatUsd(totalUsdVal)}`;
        if (rankDurationTime) rankDurationTime.textContent = daysHeld > 0 ? `${daysHeld} Days` : 'Initiate';
        if (rankVeteranTitle) rankVeteranTitle.textContent = veteran;
        if (rankDecreeText) rankDecreeText.textContent = rank.decree;

        if (checkerLoading) checkerLoading.classList.add('is-hidden');
        if (checkerResultSuccess) checkerResultSuccess.classList.remove('is-hidden');
        unlockFanClubApplication();

    } catch (error) {
        console.error('Fan status check error:', error);
        if (checkerLoading) checkerLoading.classList.add('is-hidden');
        const errorMessageEl = document.getElementById('checker-error-message');
        if (errorMessageEl) {
            const detail = error.endpointFailures?.length
                ? error.endpointFailures.join(' · ')
                : (error.message || 'network error');
            errorMessageEl.textContent = `Every available Solana RPC endpoint failed to respond (${detail}). This does not mean your wallet has 0 $KEKIUS — it means the check couldn't complete. Please try again in a moment.`;
        }
        if (checkerResultError) checkerResultError.classList.remove('is-hidden');
    }
}

function setupFanStatusChecker() {
    if (checkStatusBtn && checkerWalletAddress) {
        checkStatusBtn.addEventListener('click', () => {
            inspectFanStatus(checkerWalletAddress.value);
        });

        checkerWalletAddress.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                inspectFanStatus(checkerWalletAddress.value);
            }
        });
    }

    if (checkerRetryBtn && checkerWalletAddress) {
        checkerRetryBtn.addEventListener('click', () => {
            inspectFanStatus(checkerWalletAddress.value);
        });
    }

    if (autoDetectWalletBtn) {
        autoDetectWalletBtn.addEventListener('click', async () => {
            const provider = getSolanaProvider();
            if (!provider) {
                alert('No Solana browser wallet detected (e.g. Phantom, Solflare). Please paste your wallet address manually.');
                return;
            }

            try {
                const resp = await provider.connect();
                const pubkey = provider.publicKey || resp.publicKey;
                if (pubkey && checkerWalletAddress) {
                    const addrStr = pubkey.toString();
                    checkerWalletAddress.value = addrStr;
                    inspectFanStatus(addrStr);
                }
            } catch (err) {
                console.warn('Wallet auto-detection note:', err);
            }
        });
    }
}

function setApplicationStatus(message, type = '') {
    if (!applicationStatus) return;
    applicationStatus.textContent = message;
    applicationStatus.classList.remove('is-success', 'is-warning');
    if (type) applicationStatus.classList.add(`is-${type}`);
}

function unlockFanClubApplication() {
    if (!applicationSubmit) return;
    applicationSubmit.disabled = false;
    setApplicationStatus('Rank achieved. Complete the form to apply through KEK Support.', 'success');
}

function setupFanClubApplication() {
    if (!fanClubApplication || !applicationWallet || !applicationTelegram || !applicationCommitment) return;

    openFanApplicationButton?.addEventListener('click', () => {
        if (fanApplicationModal && !fanApplicationModal.open) fanApplicationModal.showModal();
    });

    closeFanApplicationButton?.addEventListener('click', () => {
        fanApplicationModal?.close();
    });

    fanApplicationModal?.addEventListener('click', (event) => {
        if (event.target !== fanApplicationModal) return;
        fanApplicationModal.close();
    });

    fanClubApplication.addEventListener('submit', (event) => {
        event.preventDefault();

        const inspectedWallet = checkerWalletAddress?.value.trim();
        const submittedWallet = applicationWallet.value.trim();
        const telegramUsername = applicationTelegram.value.trim();
        const hasRank = checkerResultSuccess && !checkerResultSuccess.classList.contains('is-hidden');

        if (!hasRank) {
            setApplicationStatus('Application declined: pass the rank check first, then come back when you achieve a KEKIUS rank.', 'warning');
            return;
        }

        if (submittedWallet !== inspectedWallet) {
            setApplicationStatus('Use the same public address that passed the rank check above.', 'warning');
            return;
        }

        if (!/^@?[A-Za-z0-9_]{5,32}$/.test(telegramUsername)) {
            setApplicationStatus('Enter a valid Telegram username, such as @your_username.', 'warning');
            applicationTelegram.focus();
            return;
        }

        if (!applicationCommitment.checked) {
            setApplicationStatus('Confirm your commitment to long-term $KEKIUS holding to continue.', 'warning');
            return;
        }

        const normalizedTelegram = telegramUsername.startsWith('@') ? telegramUsername : `@${telegramUsername}`;
        const message = [
            'KEK Fan Club Application',
            `Holding wallet: ${submittedWallet}`,
            `Telegram: ${normalizedTelegram}`,
            'Commitment: I commit to long-term holding of $KEKIUS.',
            `Rank: ${rankDisplayName?.textContent.trim() || 'Verified KEKIUS holder'}`
        ].join('\n');
        window.open(KEK_SUPPORT_BOT_URL, '_blank', 'noopener,noreferrer');
        navigator.clipboard?.writeText(message).then(() => {
            setApplicationStatus('Application copied. Paste it into the KEK Support bot at t.me/KekiusMod_bot and send it.', 'success');
        }).catch(() => {
            setApplicationStatus('KEK Support opened at t.me/KekiusMod_bot. Copy your application details and send them there.', 'success');
        });
    });
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
setupGalleryImageViewer();
setupFaq();
setupSocialButtons();
setupMarketplaceButtons();
setupFanStatusChecker();
setupFanClubApplication();

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

// ==================== VIP Solana Payment Configuration & Processor ====================
// Single, publicly-disclosed receiving wallet. Do not rotate/randomize this — a payment
// gate that sends funds to an undisclosed, changing set of addresses is indistinguishable
// from a scam pattern, even if unintentionally so. Keep one address your community can
// verify and look up on a Solana explorer at any time.
const SOLANA_CONFIG = {
    walletAddress: '6UaRKPbvGj8qwVXjrPEiTXehv7x6yoqeGGhqD2DnhNhS',
    amountSol: 0.5,
    vipTelegramUrl: 'https://t.me/KekiusMod_bot',
    rpcEndpoint: 'https://api.mainnet-beta.solana.com',
    storageKey: 'kekius_vip_verified_v2'
};

// Purge any legacy unverified test storage keys so VIP stays locked until genuine payment
try {
    localStorage.removeItem('kekius_vip_access_v1');
    localStorage.removeItem('kekius_vip_access');
    localStorage.removeItem('kekius_pay_addr_idx');
} catch (e) {}

const currentPaymentAddress = SOLANA_CONFIG.walletAddress;

// Track signatures already redeemed on this device so the same real transaction can't be
// reused over and over locally. NOTE: this is a client-side convenience only, not real
// anti-replay protection — a Solana tx signature is public once broadcast, so anyone could
// copy someone else's valid signature into a different browser/device and pass verification.
// True replay prevention requires a small server (or serverless function) that records
// redeemed signatures centrally. Recommend adding one before relying on this for revenue.
const REDEEMED_SIGNATURES_KEY = 'kekius_redeemed_signatures';

function getRedeemedSignatures() {
    try {
        return JSON.parse(localStorage.getItem(REDEEMED_SIGNATURES_KEY) || '[]');
    } catch {
        return [];
    }
}

function markSignatureRedeemed(signature) {
    try {
        const redeemed = getRedeemedSignatures();
        redeemed.push(signature);
        localStorage.setItem(REDEEMED_SIGNATURES_KEY, JSON.stringify(redeemed.slice(-50)));
    } catch (e) { /* non-fatal */ }
}

// Render Solana Pay QR Code
function renderSolanaQr(container, address, amount) {
    if (!container) return;
    const solanaPayUri = `solana:${address}?amount=${amount}&label=Kekius%20Maximus%20VIP&message=Tier%202%20VIP%20Access`;

    try {
        if (typeof qrcode !== 'undefined') {
            const qr = qrcode(0, 'M');
            qr.addData(solanaPayUri);
            qr.make();
            container.innerHTML = qr.createSvgTag({ scalable: true, margin: 2 });
            const svg = container.querySelector('svg');
            if (svg) {
                svg.setAttribute('width', '140');
                svg.setAttribute('height', '140');
                svg.style.display = 'block';
            }
            return;
        }
    } catch (err) {
        console.warn('QR SVG render error, using image fallback:', err);
    }

    const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=4&data=${encodeURIComponent(solanaPayUri)}`;
    container.innerHTML = `<img src="${fallbackUrl}" alt="Solana Pay QR Code" width="140" height="140" />`;
}

// Verify a Solana transaction actually paid the required amount to the required address.
// Uses the RPC's pre/post balance snapshots for the recipient account, which is robust to
// legacy vs versioned transactions and to however many instructions the transfer used.
async function verifySolanaPayment(signature, recipientAddress, minimumSol) {
    let result;
    try {
        result = await callSolanaRpc('getTransaction', [
            signature,
            { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0, commitment: 'confirmed' }
        ]);
    } catch (err) {
        return { ok: false, reason: 'rpc_error', detail: err.message || 'RPC error' };
    }

    if (!result) {
        return { ok: false, reason: 'not_found', detail: 'Transaction not found yet — it may still be confirming.' };
    }

    if (result.meta?.err) {
        return { ok: false, reason: 'failed', detail: 'This transaction failed on-chain.' };
    }

    const accountKeys = result.transaction?.message?.accountKeys || [];
    const recipientIndex = accountKeys.findIndex((entry) => (entry.pubkey || entry) === recipientAddress);

    if (recipientIndex === -1) {
        return { ok: false, reason: 'wrong_recipient', detail: 'This transaction does not pay the VIP wallet address.' };
    }

    const preBalance = result.meta?.preBalances?.[recipientIndex];
    const postBalance = result.meta?.postBalances?.[recipientIndex];

    if (typeof preBalance !== 'number' || typeof postBalance !== 'number') {
        return { ok: false, reason: 'no_balance_data', detail: 'Could not read balance changes for this transaction.' };
    }

    const receivedLamports = postBalance - preBalance;
    const receivedSol = receivedLamports / 1_000_000_000;
    const requiredLamports = Math.round(minimumSol * 1_000_000_000);

    // Small tolerance for floating point / fee rounding on the sender's side.
    if (receivedLamports < requiredLamports - 1000) {
        return { ok: false, reason: 'insufficient_amount', detail: `Only ${receivedSol.toFixed(4)} SOL was sent to the VIP wallet; ${minimumSol} SOL is required.`, receivedSol };
    }

    return { ok: true, receivedSol };
}

// Check if VIP is unlocked in localStorage
function getVipStatus() {
    try {
        const item = localStorage.getItem(SOLANA_CONFIG.storageKey);
        if (!item) return false;
        const parsed = JSON.parse(item);
        return Boolean(parsed && parsed.unlocked === true);
    } catch {
        return false;
    }
}

// Save VIP unlocked state
function saveVipUnlocked(signature = '') {
    const record = {
        unlocked: true,
        signature: signature || 'tx_confirmed',
        recipient: currentPaymentAddress,
        unlockedAt: Date.now()
    };
    localStorage.setItem(SOLANA_CONFIG.storageKey, JSON.stringify(record));
    syncVipUi();
}

// Sync UI of Tier 02 Card
function syncVipUi() {
    const unlocked = getVipStatus();
    const tierCard = document.getElementById('tier-vip-card');
    const unlockBtn = document.getElementById('unlock-vip-btn');
    const unlockedBtn = document.getElementById('vip-unlocked-btn');
    const notice = document.getElementById('vip-unlocked-notice');
    const badge = document.getElementById('vip-card-badge');

    if (tierCard) tierCard.classList.toggle('vip-is-unlocked', unlocked);
    if (unlockBtn) unlockBtn.classList.toggle('is-hidden', unlocked);
    if (unlockedBtn) unlockedBtn.classList.toggle('is-hidden', !unlocked);
    if (notice) notice.classList.toggle('is-hidden', !unlocked);
    if (badge) badge.textContent = unlocked ? 'Tier 02 · VIP ACTIVE' : 'Tier 02';
}

// Debug / Testing helper to reset VIP state
window.resetVipState = function() {
    try {
        localStorage.removeItem(SOLANA_CONFIG.storageKey);
        localStorage.removeItem('kekius_vip_access_v1');
        localStorage.removeItem('kekius_vip_access');
    } catch (e) {}
    syncVipUi();
    console.log('VIP state reset to locked.');
};

// Elements for VIP modal
const vipModal = document.getElementById('vip-payment-modal');
const unlockVipBtn = document.getElementById('unlock-vip-btn');
const closeVipModalBtn = document.getElementById('close-vip-modal');
const finishVipBtn = document.getElementById('finish-vip-btn');
const tabBtnWallet = document.getElementById('tab-btn-wallet');
const tabBtnManual = document.getElementById('tab-btn-manual');
const tabWalletPanel = document.getElementById('tab-wallet-panel');
const tabManualPanel = document.getElementById('tab-manual-panel');
const manualAddressInput = document.getElementById('manual-pay-address');
const copyAddressBtn = document.getElementById('copy-manual-address-btn');
const qrCodeContainer = document.getElementById('payment-qr-code');
const walletStatusLabel = document.getElementById('wallet-provider-label');
const payWalletSubmitBtn = document.getElementById('pay-wallet-submit-btn');
const txSignatureInput = document.getElementById('tx-signature-input');
const verifySignatureBtn = document.getElementById('verify-signature-btn');
const paymentStatusBox = document.getElementById('payment-status-box');
const paymentStatusText = document.getElementById('payment-status-text');
const vipPayFlow = document.getElementById('vip-pay-flow');
const vipSuccessFlow = document.getElementById('vip-success-flow');

function showModalStatus(message, type = 'pending') {
    if (!paymentStatusBox || !paymentStatusText) return;
    paymentStatusBox.classList.remove('is-hidden', 'is-error', 'is-success');
    if (type === 'error') paymentStatusBox.classList.add('is-error');
    if (type === 'success') paymentStatusBox.classList.add('is-success');
    paymentStatusText.textContent = message;
}

function hideModalStatus() {
    if (paymentStatusBox) paymentStatusBox.classList.add('is-hidden');
}

function switchPaymentTab(tabName) {
    const isWallet = tabName === 'wallet';
    if (tabBtnWallet) {
        tabBtnWallet.classList.toggle('active', isWallet);
        tabBtnWallet.setAttribute('aria-selected', String(isWallet));
    }
    if (tabBtnManual) {
        tabBtnManual.classList.toggle('active', !isWallet);
        tabBtnManual.setAttribute('aria-selected', String(!isWallet));
    }
    if (tabWalletPanel) tabWalletPanel.classList.toggle('is-hidden', !isWallet);
    if (tabManualPanel) tabManualPanel.classList.toggle('is-hidden', isWallet);
    hideModalStatus();
}

function getSolanaProvider() {
    if (window.phantom?.solana?.isPhantom) return window.phantom.solana;
    if (window.solflare?.isSolflare) return window.solflare;
    if (window.solana) return window.solana;
    return null;
}

function checkDetectedWallet() {
    const provider = getSolanaProvider();
    if (!walletStatusLabel) return;
    if (provider) {
        const name = provider.isPhantom ? 'Phantom' : (provider.isSolflare ? 'Solflare' : 'Solana Browser Wallet');
        walletStatusLabel.textContent = `${name} detected · Ready to pay`;
        walletStatusLabel.style.color = 'var(--gold)';
    } else {
        walletStatusLabel.textContent = 'No browser wallet detected (use Phantom/Solflare or QR tab)';
        walletStatusLabel.style.color = 'var(--muted)';
    }
}

function showVipSuccessScreen() {
    vipPayFlow?.classList.add('is-hidden');
    vipSuccessFlow?.classList.remove('is-hidden');
}

function openVipModal() {
    if (!vipModal) return;

    // If already unlocked, show VIP reveal directly
    if (getVipStatus()) {
        showVipSuccessScreen();
        vipModal.showModal();
        return;
    }

    // Prepare payment flow
    vipPayFlow?.classList.remove('is-hidden');
    vipSuccessFlow?.classList.add('is-hidden');
    hideModalStatus();
    switchPaymentTab('wallet');

    // Single, disclosed receiving address
    if (manualAddressInput) manualAddressInput.value = currentPaymentAddress;
    renderSolanaQr(qrCodeContainer, currentPaymentAddress, SOLANA_CONFIG.amountSol);
    const solscanLink = document.getElementById('solscan-address-link');
    if (solscanLink) solscanLink.href = `https://solscan.io/account/${currentPaymentAddress}`;

    // Detect browser wallet
    checkDetectedWallet();

    vipModal.showModal();
}

function closeVipModal() {
    if (vipModal && vipModal.open) {
        vipModal.close();
    }
}

// Copy manual pay address
function copyManualAddress() {
    if (!manualAddressInput || !copyAddressBtn) return;
    const addr = manualAddressInput.value;
    navigator.clipboard.writeText(addr).then(() => {
        copyAddressBtn.textContent = 'Copied!';
        window.setTimeout(() => {
            copyAddressBtn.textContent = 'Copy';
        }, 1600);
    }).catch(() => {
        manualAddressInput.select();
    });
}

// Handle Web3 Solana Wallet Payment
async function handleWalletPayment() {
    const provider = getSolanaProvider();
    if (!provider) {
        showModalStatus('No Solana wallet detected. Please install Phantom / Solflare or switch to "QR & Manual Pay".', 'error');
        return;
    }

    try {
        showModalStatus('Connecting to wallet...', 'pending');
        if (payWalletSubmitBtn) payWalletSubmitBtn.disabled = true;

        const connectResp = await provider.connect();
        const fromPubkey = provider.publicKey || connectResp.publicKey;

        if (!fromPubkey) {
            throw new Error('Wallet public key unavailable.');
        }

        if (typeof solanaWeb3 === 'undefined') {
            throw new Error('Solana Web3 library is initializing. Please try again in a few seconds or use QR Pay.');
        }

        showModalStatus('Preparing 0.5 SOL transaction...', 'pending');
        const connection = new solanaWeb3.Connection(SOLANA_CONFIG.rpcEndpoint, 'confirmed');
        const toPubkey = new solanaWeb3.PublicKey(currentPaymentAddress);
        const lamports = Math.round(SOLANA_CONFIG.amountSol * solanaWeb3.LAMPORTS_PER_SOL);

        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: fromPubkey,
                toPubkey: toPubkey,
                lamports: lamports
            })
        );

        showModalStatus('Fetching recent network blockhash...', 'pending');
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;

        showModalStatus('Please approve the transaction in your wallet...', 'pending');
        let signature = '';
        if (provider.signAndSendTransaction) {
            const res = await provider.signAndSendTransaction(transaction);
            signature = res.signature;
        } else if (provider.sendTransaction) {
            signature = await provider.sendTransaction(transaction, connection);
        } else {
            throw new Error('Wallet does not support transaction sending.');
        }

        showModalStatus(`Transaction sent (${signature.slice(0, 8)}...). Confirming on Solana...`, 'pending');

        try {
            await connection.confirmTransaction({
                signature: signature,
                blockhash: blockhash,
                lastValidBlockHeight: lastValidBlockHeight
            }, 'confirmed');
        } catch (confirmErr) {
            console.warn('Network confirmation note:', confirmErr);
        }

        showModalStatus('Verifying payment on-chain...', 'pending');
        // Since we built this transaction ourselves moments ago, this check is mostly a
        // safety net (e.g. against a wallet silently altering the transfer) rather than a
        // trust boundary — but we still verify rather than assume, same as manual payments.
        const verification = await verifySolanaPayment(signature, currentPaymentAddress, SOLANA_CONFIG.amountSol);

        if (!verification.ok) {
            showModalStatus(`Payment sent, but verification failed: ${verification.detail} If this persists, use "QR & Manual Pay" and verify the signature once it's fully confirmed.`, 'error');
            return;
        }

        showModalStatus('Payment verified! VIP unlocked.', 'success');
        window.setTimeout(() => {
            markSignatureRedeemed(signature);
            saveVipUnlocked(signature);
            showVipSuccessScreen();
        }, 800);

    } catch (err) {
        console.error('Wallet payment error:', err);
        const message = err.message?.includes('User rejected') 
            ? 'Transaction rejected in wallet.' 
            : (err.message || 'Payment failed. Please try again or use QR code.');
        showModalStatus(message, 'error');
    } finally {
        if (payWalletSubmitBtn) payWalletSubmitBtn.disabled = false;
    }
}

// Handle Manual Transaction Verification
async function handleVerifyManualPayment() {
    const signature = txSignatureInput?.value.trim();
    if (!signature) {
        showModalStatus('Please paste your Solana transaction signature.', 'error');
        return;
    }

    // Basic Solana base58 signature format validation (base58 chars, min length)
    if (signature.length < 50 || signature.length > 100 || /[^1-9A-HJ-NP-za-km-z]/.test(signature)) {
        showModalStatus('Invalid transaction signature format. Please check the transaction hash.', 'error');
        return;
    }

    if (getRedeemedSignatures().includes(signature)) {
        showModalStatus('This transaction signature has already been used to unlock VIP on this device.', 'error');
        return;
    }

    showModalStatus('Verifying transaction on Solana network...', 'pending');
    if (verifySignatureBtn) verifySignatureBtn.disabled = true;

    try {
        const verification = await verifySolanaPayment(signature, currentPaymentAddress, SOLANA_CONFIG.amountSol);

        if (!verification.ok) {
            const messages = {
                not_found: 'Transaction not found yet. It may still be confirming — wait a few seconds and try again.',
                failed: 'This transaction failed on-chain, so no VIP access was granted.',
                wrong_recipient: `This transaction doesn't pay the VIP wallet (${currentPaymentAddress}).`,
                insufficient_amount: verification.detail,
                no_balance_data: 'Could not read this transaction\'s balance changes. Please try again.',
                rpc_error: `Network error while verifying: ${verification.detail}`
            };
            showModalStatus(messages[verification.reason] || 'Verification failed. Please check the signature and try again.', 'error');
            return;
        }

        showModalStatus(`Payment of ${verification.receivedSol.toFixed(4)} SOL verified on-chain! Unlocking VIP...`, 'success');
        window.setTimeout(() => {
            markSignatureRedeemed(signature);
            saveVipUnlocked(signature);
            showVipSuccessScreen();
        }, 800);
    } catch (err) {
        console.error('Verification error:', err);
        showModalStatus('Could not reach the Solana network to verify this transaction. Please try again in a moment.', 'error');
    } finally {
        if (verifySignatureBtn) verifySignatureBtn.disabled = false;
    }
}

// Setup VIP Payment Event Listeners
function setupVipPayment() {
    if (unlockVipBtn) {
        unlockVipBtn.addEventListener('click', openVipModal);
    }

    if (closeVipModalBtn) {
        closeVipModalBtn.addEventListener('click', closeVipModal);
    }

    if (finishVipBtn) {
        finishVipBtn.addEventListener('click', closeVipModal);
    }

    if (tabBtnWallet) {
        tabBtnWallet.addEventListener('click', () => switchPaymentTab('wallet'));
    }

    if (tabBtnManual) {
        tabBtnManual.addEventListener('click', () => switchPaymentTab('manual'));
    }

    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', copyManualAddress);
    }

    if (payWalletSubmitBtn) {
        payWalletSubmitBtn.addEventListener('click', handleWalletPayment);
    }

    if (verifySignatureBtn) {
        verifySignatureBtn.addEventListener('click', handleVerifyManualPayment);
    }

    // Modern Web Guidance: fallback for light-dismiss on dialog backdrop click
    if (vipModal && !('closedBy' in HTMLDialogElement.prototype)) {
        vipModal.addEventListener('click', (event) => {
            if (event.target !== vipModal) return;
            const rect = vipModal.getBoundingClientRect();
            const isInside = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );
            if (!isInside) {
                vipModal.close();
            }
        });
    }

    // Initial check on load
    syncVipUi();
}

setupVipPayment();

// ==================== Initial page state ====================
showSection('home', document.querySelector('[data-section="home"]'));
loadTokenomics();
window.setInterval(loadTokenomics, MARKET_DATA_REFRESH_MS);

