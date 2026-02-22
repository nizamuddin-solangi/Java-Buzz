/* ===========================
   JAVA BUZZ - BLOG JS
   =========================== */

document.addEventListener('DOMContentLoaded', async () => {
    const blogGrid = document.getElementById('blog-grid');
    const searchInput = document.getElementById('blog-search');
    let allBlogs = [];

    if (!blogGrid) return;

    // Fetch blog data
    try {
        const res = await fetch('./data/blogs.json');
        allBlogs = await res.json();
        renderBlogs(allBlogs);
    } catch (err) {
        blogGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#8B7355;padding:40px">Could not load blog posts.</p>';
        return;
    }

    // Render blog posts
    function renderBlogs(blogs) {
        blogGrid.innerHTML = '';
        if (blogs.length === 0) {
            blogGrid.innerHTML = '<div class="no-results"><span>🔍</span>No posts match your search.</div>';
            return;
        }
        blogs.forEach((post, i) => {
            const card = document.createElement('div');
            card.className = 'blog-card animate-on-scroll';
            card.dataset.delay = i * 70;

            const initials = post.author.split(' ').map(n => n[0]).join('').toUpperCase();
            const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const tagsHTML = (post.tags || []).map(tag =>
                `<span class="blog-tag">#${tag}</span>`
            ).join('');

            card.innerHTML = `
        <div class="blog-card-img-wrap">
          <img class="blog-card-img" src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='images/page-hero-bg.jpg'">
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="blog-card-category-tag">${post.category}</span>
            <span>📅 ${formattedDate}</span>
          </div>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div class="blog-tags">${tagsHTML}</div>
            <div class="blog-card-footer">
              <div class="blog-card-author">
                <div class="blog-author-avatar">${initials}</div>
                <div>
                  <div class="blog-author-name">${post.author}</div>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                <button class="blog-share-btn" onclick="sharePost('${encodeURIComponent(post.title)}')">
                  🔗 Share
                </button>
                <div class="blog-social-share">
                  <a href="#" class="share-btn fb" onclick="sharePlatform('facebook', '${encodeURIComponent(post.title)}', event)" aria-label="Share on Facebook">f</a>
                  <a href="#" class="share-btn tw" onclick="sharePlatform('twitter', '${encodeURIComponent(post.title)}', event)" aria-label="Share on Twitter">𝕏</a>
                </div>
              </div>
            </div>
          </div>
        `;
            blogGrid.appendChild(card);
        });

        // Trigger animations
        setTimeout(() => {
            blogGrid.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 70);
            });
        }, 50);
    }

    // Live search
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) {
                renderBlogs(allBlogs);
                return;
            }
            const filtered = allBlogs.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.author.toLowerCase().includes(query) ||
                post.category.toLowerCase().includes(query) ||
                (post.tags || []).some(t => t.toLowerCase().includes(query))
            );
            renderBlogs(filtered);
        });
    }

    // Platform-specific share
    window.sharePlatform = function (platform, encodedTitle, event) {
        event.preventDefault();
        const title = decodeURIComponent(encodedTitle);
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out this coffee blog: ${title}`);
        
        let shareUrl = '';
        if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    // Generic share handler
    window.sharePost = function (encodedTitle) {
        const title = decodeURIComponent(encodedTitle);
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this article from Java Buzz: ${title}`,
                url: window.location.href
            }).catch(() => { });
        } else {
            // Fallback: copy URL
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    window.showToast && showToast('🔗 Link copied to clipboard!');
                });
        }
    };
});
