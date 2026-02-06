/**
 * MN-06 Watch: Shared Navigation Component
 */

(function() {
    const path = window.location.pathname;
    const isVotes = path === '/' || path === '/index.html' || path.endsWith('emmer-vote-tracker/');
    const isTranscripts = path.includes('/transcripts/') && !path.includes('/analytics');
    const isAnalytics = path.includes('/analytics');
    const isTweets = path.includes('/tweets');
    const isSponsorship = path.includes('/sponsorship') || path.includes('/bills');
    
    const navHTML = `
        <a href="https://mn06watch.com" class="mn06-nav-brand">
            <img src="https://mn06watch.com/MN06Watch_Logo.png" alt="MN-06 Watch" class="mn06-nav-logo">
            MN-06 Watch
        </a>
        <div class="mn06-nav-links">
            <a href="https://mn06watch.com/" class="mn06-nav-link ${isVotes ? 'active' : ''}">Vote Tracker</a>
            <a href="https://mn06watch.com/sponsorships/" class="mn06-nav-link ${isSponsorship ? 'active' : ''}">Bills</a>
            <a href="https://mn06watch.com/transcripts/" class="mn06-nav-link ${isTranscripts ? 'active' : ''}">Transcripts</a>
            <a href="https://mn06watch.com/transcripts/analytics/" class="mn06-nav-link ${isAnalytics ? 'active' : ''}">Analytics</a>
            <a href="https://mn06watch.com/tweets/" class="mn06-nav-link ${isTweets ? 'active' : ''}">Tweets</a>
            <a href="https://mn06watch.substack.com" class="mn06-nav-link" target="_blank">Newsletter</a>
        </div>
    `;
    
    const navCSS = `
    <style id="mn06-nav-styles">
        #mn06-nav {
            position: sticky !important;
            top: 0 !important;
            z-index: 9999 !important;
            background: rgba(21, 42, 69, 0.95) !important;
            border-bottom: 1px solid #2a3441 !important;
            padding: 10px 20px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
        }
        
        .mn06-nav-brand {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            text-decoration: none !important;
            color: #d4a84b !important;
            font-weight: 700 !important;
            font-size: 1rem !important;
        }
        
        .mn06-nav-logo {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
        }
        
        .mn06-nav-links {
            display: flex !important;
            gap: 20px !important;
            flex-wrap: wrap !important;
        }
        
        .mn06-nav-link {
            color: #8b949e !important;
            text-decoration: none !important;
            font-size: 0.9rem !important;
            padding: 6px 12px !important;
            border-radius: 6px !important;
            transition: all 0.2s !important;
        }
        
        .mn06-nav-link:hover {
            color: #e6edf3 !important;
            background: #1e3a5f !important;
        }
        
        .mn06-nav-link.active {
            color: #d4a84b !important;
            font-weight: 600 !important;
        }
        
        @media (max-width: 768px) {
            #mn06-nav {
                flex-direction: column !important;
                gap: 10px !important;
                padding: 10px !important;
            }
            .mn06-nav-links {
                gap: 10px !important;
                justify-content: center !important;
            }
            .mn06-nav-link {
                font-size: 0.8rem !important;
                padding: 4px 8px !important;
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
