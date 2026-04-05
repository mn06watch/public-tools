/**
 * MN-06 Watch: Shared Navigation Component
 * Updated April 2026 — matches article page design system
 */

(function() {
    const path = window.location.pathname;
    const isVotes = path === '/' || path === '/index.html' || path.endsWith('emmer-vote-tracker/');
    const isTranscripts = path.includes('/transcripts/') && !path.includes('/analytics');
    const isAnalytics = path.includes('/analytics');
    const isTweets = path.includes('/tweets');
    const isSponsorship = path.includes('/sponsorship') || path.includes('/bills');
    const isArticles = path.includes('/articles');
    
    const navHTML = `
        <div class="mn06-nav-left">
            <a href="https://mn06watch.com" class="mn06-nav-brand">MN06Watch</a>
            <div class="mn06-nav-tagline">Receipts, not rage.</div>
        </div>
        <div class="mn06-nav-links">
            <a href="https://mn06watch.com/" class="mn06-nav-link ${isVotes ? 'active' : ''}">Vote Tracker</a>
            <a href="https://mn06watch.com/sponsorships/" class="mn06-nav-link ${isSponsorship ? 'active' : ''}">Bills</a>
            <a href="https://mn06watch.com/transcripts/" class="mn06-nav-link ${isTranscripts ? 'active' : ''}">Transcripts</a>
            <a href="https://mn06watch.com/transcripts/analytics/" class="mn06-nav-link ${isAnalytics ? 'active' : ''}">Analytics</a>
            <a href="https://mn06watch.com/tweets/" class="mn06-nav-link ${isTweets ? 'active' : ''}">Tweets</a>
            <a href="https://mn06watch.com/articles/" class="mn06-nav-link ${isArticles ? 'active' : ''}">Articles</a>
            <a href="https://mn06watch.substack.com" class="mn06-nav-link" target="_blank">Substack</a>
        </div>
    `;
    
    const navCSS = `
    <style id="mn06-nav-styles">
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Mono:wght@400;500&display=swap');
        
        #mn06-nav {
            position: sticky !important;
            top: 0 !important;
            z-index: 9999 !important;
            background: #1B3A5C !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            padding: 12px 24px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
        }
        
        .mn06-nav-left {
            display: flex !important;
            flex-direction: column !important;
        }
        
        .mn06-nav-brand {
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: 1.3rem !important;
            color: #C8922A !important;
            text-decoration: none !important;
            font-weight: 700 !important;
            line-height: 1.2 !important;
        }
        
        .mn06-nav-brand:hover {
            color: #e4bc6b !important;
        }
        
        .mn06-nav-tagline {
            font-family: 'DM Mono', monospace !important;
            font-size: 0.68rem !important;
            color: rgba(255,255,255,0.35) !important;
            margin-top: 1px !important;
        }
        
        .mn06-nav-links {
            display: flex !important;
            gap: 4px !important;
            flex-wrap: wrap !important;
            align-items: center !important;
        }
        
        .mn06-nav-link {
            font-family: 'DM Mono', monospace !important;
            color: rgba(255,255,255,0.55) !important;
            text-decoration: none !important;
            font-size: 0.78rem !important;
            padding: 5px 10px !important;
            border-radius: 5px !important;
            transition: all 0.15s ease !important;
        }
        
        .mn06-nav-link:hover {
            color: rgba(255,255,255,0.9) !important;
            background: rgba(255,255,255,0.08) !important;
        }
        
        .mn06-nav-link.active {
            color: #C8922A !important;
            font-weight: 500 !important;
        }
        
        @media (max-width: 768px) {
            #mn06-nav {
                flex-direction: column !important;
                gap: 10px !important;
                padding: 12px 16px !important;
            }
            .mn06-nav-left {
                align-items: center !important;
            }
            .mn06-nav-links {
                gap: 2px !important;
                justify-content: center !important;
            }
            .mn06-nav-link {
                font-size: 0.72rem !important;
                padding: 4px 7px !important;
            }
        }
    </style>
    `;
    
    function insertNav() {
        const target = document.getElementById('mn06-nav');
        
        if (!document.getElementById('mn06-nav-styles')) {
            document.head.insertAdjacentHTML('beforeend', navCSS);
        }
        
        if (target) {
            target.innerHTML = navHTML;
        } else {
            const nav = document.createElement('div');
            nav.id = 'mn06-nav';
            nav.innerHTML = navHTML;
            document.body.insertBefore(nav, document.body.firstChild);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertNav);
    } else {
        insertNav();
    }
})();
