/**
 * MN-06 Watch: Shared Navigation Component
 * Include this script in any page to get the consistent nav bar
 * 
 * Usage: <script src="/nav.js"></script>
 * Place a <div id="mn06-nav"></div> where you want the nav to appear
 */

(function() {
    // Determine current page for active state
    const path = window.location.pathname;
    const isVotes = path === '/' || path === '/index.html' || path.endsWith('emmer-vote-tracker/');
    const isTranscripts = path.includes('/transcripts/') && !path.includes('/analytics');
    const isAnalytics = path.includes('/analytics');
    const isTweets = path.includes('/tweets');
    const isSponsorship = path.includes('/sponsorship') || path.includes('/bills');
    
    const navHTML = `
    <nav class="top-nav">
        <a href="https://mn06watch.com" class="nav-brand">
            <img src="https://mn06watch.com/MN06Watch_Logo.png" alt="MN-06 Watch" class="nav-logo">
            MN-06 Watch
        </a>
        <div class="nav-links">
            <a href="https://mn06watch.com/" class="nav-link ${isVotes ? 'active' : ''}">Vote Tracker</a>
            <a href="https://mn06watch.com/sponsorships/" class="nav-link ${isSponsorship ? 'active' : ''}">Bills</a>
            <a href="https://mn06watch.com/transcripts/" class="nav-link ${isTranscripts ? 'active' : ''}">Transcripts</a>
            <a href="https://mn06watch.com/transcripts/analytics/" class="nav-link ${isAnalytics ? 'active' : ''}">Analytics</a>
            <a href="https://mn06watch.com/tweets/" class="nav-link ${isTweets ? 'active' : ''}">Tweets</a>
            <a href="https://mn06watch.substack.com" class="nav-link" target="_blank">Newsletter</a>
        </div>
    </nav>
    `;
    
    // CSS for the nav (in case page doesn't have it)
    const navCSS = `
    <style id="mn06-nav-styles">
        #mn06-nav #mn06-nav .top-nav {
            background: rgba(21, 42, 69, 0.95);
            border-bottom: 1px solid #2a3441;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            backdrop-filter: blur(10px);
        }
        
        #mn06-nav #mn06-nav .nav-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: #d4a84b;
            font-weight: 700;
            font-size: 1rem;
        }
        
        #mn06-nav #mn06-nav .nav-logo {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        
        #mn06-nav #mn06-nav .nav-links {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        #mn06-nav #mn06-nav .nav-link {
            color: #8b949e;
            text-decoration: none;
            font-size: 0.9rem;
            padding: 6px 12px;
            border-radius: 6px;
            transition: all 0.2s;
        }
        
        #mn06-nav #mn06-nav .nav-link:hover {
            color: #e6edf3;
            background: #1e3a5f;
        }
        
        #mn06-nav #mn06-nav .nav-link.active {
            color: #d4a84b;
            font-weight: 600;
        }
        
        @media (max-width: 768px) {
            #mn06-nav #mn06-nav .top-nav {
                flex-direction: column;
                gap: 10px;
                padding: 10px;
            }
            #mn06-nav #mn06-nav .nav-links {
                gap: 10px;
                justify-content: center;
            }
            #mn06-nav #mn06-nav .nav-link {
                font-size: 0.8rem;
                padding: 4px 8px;
            }
        }
    </style>
    `;
    
    // Insert nav at the target div or at the start of body
    function insertNav() {
        const target = document.getElementById('mn06-nav');
        
        // Add CSS if not already present
        if (!document.getElementById('mn06-nav-styles')) {
            document.head.insertAdjacentHTML('beforeend', navCSS);
        }
        
        if (target) {
            target.innerHTML = navHTML;
        } else {
            // Insert at start of body
            document.body.insertAdjacentHTML('afterbegin', navHTML);
        }
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertNav);
    } else {
        insertNav();
    }
})();
