import { visit } from 'unist-util-visit'
import type { RemarkPlugin } from '@astrojs/markdown-remark'

/**
 * Remark plugin to transform GitHub directive into GitHub card component
 * Usage: ::github{repo="owner/repo"}
 */
export const remarkGithubCard: RemarkPlugin = () => {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === 'textDirective' || node.type === 'leafDirective') {
        if (node.name === 'github') {
          const data = node.data || (node.data = {})
          const attributes = node.attributes || {}
          const repo = attributes.repo

          // Validation: must be leaf type (no children)
          if (Array.isArray(node.children) && node.children.length !== 0) {
            data.hName = 'div'
            data.hProperties = { class: 'github-card-error' }
            node.children = [
              {
                type: 'text',
                value: 'Invalid directive. ("github" directive must be leaf type "::github{repo="owner/repo"}")',
              },
            ]
            return
          }

          // Validation: repo must exist and contain "/"
          if (!repo || !repo.includes('/')) {
            data.hName = 'div'
            data.hProperties = { class: 'github-card-error' }
            node.children = [
              {
                type: 'text',
                value: 'Invalid repository. ("repo" attribute must be in the format "owner/repo")',
              },
            ]
            return
          }

          const cardUuid = `GC${Math.random().toString(36).slice(-6)}`
          const [owner, repoName] = repo.split('/')

          // Create HAST structure
          data.hName = 'div'
          data.hProperties = {
            class: 'github-card-wrapper',
          }

          // Build the card structure
          node.children = [
            {
              type: 'html',
              value: `
<a id="${cardUuid}-card" class="card-github fetch-waiting" href="https://github.com/${repo}" target="_blank" rel="noopener noreferrer" data-repo="${repo}">
  <div class="gc-titlebar">
    <div class="gc-titlebar-left">
      <div class="gc-owner">
        <div id="${cardUuid}-avatar" class="gc-avatar"></div>
        <div class="gc-user">${owner}</div>
      </div>
      <div class="gc-divider">/</div>
      <div class="gc-repo">${repoName}</div>
    </div>
    <div class="github-logo">
      <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
    </div>
  </div>
  <div id="${cardUuid}-description" class="gc-description">Loading...</div>
  <div class="gc-infobar">
    <div id="${cardUuid}-stars" class="gc-stars">
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694z"></path>
      </svg>
      <span>0</span>
    </div>
    <div id="${cardUuid}-forks" class="gc-forks">
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
      </svg>
      <span>0</span>
    </div>
    <div id="${cardUuid}-license" class="gc-license">
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.006.005-.01.01-.045.04c-.21.176-.441.327-.686.45C14.556 10.78 13.88 11 13 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L12.178 4.5h-.162c-.305 0-.604-.079-.868-.231l-1.29-.736a.245.245 0 0 0-.124-.033H8.75V13h2.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.5V3.5h-.984a.245.245 0 0 0-.124.033l-1.289.737c-.265.15-.564.23-.869.23h-.162l2.112 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.016.015-.045.04c-.21.176-.441.327-.686.45C4.556 10.78 3.88 11 3 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L2.178 4.5H1.75a.75.75 0 0 1 0-1.5h2.234a.249.249 0 0 0 .125-.033l1.288-.737c.265-.15.564-.23.869-.23h.984V.75a.75.75 0 0 1 1.5 0Zm2.945 8.477c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327Zm-10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327Z"></path>
      </svg>
      <span>-</span>
    </div>
  </div>
</a>
<script type="module">
(function() {
  const cardId = '${cardUuid}-card';
  const card = document.getElementById(cardId);
  if (!card) return;

  const repo = '${repo}';

  fetch(\`https://api.github.com/repos/\${repo}\`, { referrerPolicy: "no-referrer" })
    .then(response => {
      if (!response.ok) throw new Error('API request failed');
      return response.json();
    })
    .then(data => {
      // Update description
      const desc = document.getElementById('${cardUuid}-description');
      if (desc) {
        desc.innerText = data.description?.replace(/:[a-zA-Z0-9_]+:/g, '') || "No description available";
      }

      // Update stars
      const stars = document.getElementById('${cardUuid}-stars');
      if (stars) {
        const span = stars.querySelector('span');
        if (span) {
          span.innerText = Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 1
          }).format(data.stargazers_count || 0);
        }
      }

      // Update forks
      const forks = document.getElementById('${cardUuid}-forks');
      if (forks) {
        const span = forks.querySelector('span');
        if (span) {
          span.innerText = Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 1
          }).format(data.forks || 0);
        }
      }

      // Update license
      const license = document.getElementById('${cardUuid}-license');
      if (license) {
        const span = license.querySelector('span');
        if (span) {
          span.innerText = data.license?.spdx_id || 'No License';
        }
      }

      // Update avatar
      const avatar = document.getElementById('${cardUuid}-avatar');
      if (avatar && data.owner?.avatar_url) {
        avatar.style.backgroundImage = \`url(\${data.owner.avatar_url})\`;
        avatar.style.backgroundColor = 'transparent';
      }

      // Remove loading state
      card.classList.remove('fetch-waiting');
      console.log('[GITHUB-CARD] Loaded card for ${repo}');
    })
    .catch(err => {
      console.warn('[GITHUB-CARD] Error loading card for ${repo}:', err);
      card.classList.remove('fetch-waiting');
      card.classList.add('fetch-error');
      const desc = document.getElementById('${cardUuid}-description');
      if (desc) {
        desc.innerText = 'Failed to load repository information';
      }
    });
})();
</script>
              `,
            },
          ]
        }
      }
    })
  }
}

export default remarkGithubCard
