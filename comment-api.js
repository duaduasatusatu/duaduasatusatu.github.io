// Comment API for Member System
const COMMENTS_API = '/api/comments';

async function submitComment(text, username) {
  try {
    const res = await fetch(COMMENTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, username })
    });
    return await res.json();
  } catch (e) {
    return { error: 'Gagal mengirim komentar' };
  }
}

async function getComments(adminEmail, adminPassword) {
  try {
    const res = await fetch(COMMENTS_API, {
      method: 'GET',
      headers: { email: adminEmail, password: adminPassword }
    });
    if (res.status === 401) return { error: 'Unauthorized' };
    return await res.json();
  } catch (e) {
    return { error: 'Gagal mengambil komentar' };
  }
}

async function approveComment(id, adminEmail, adminPassword) {
  try {
    const res = await fetch(COMMENTS_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: true })
    });
    return await res.json();
  } catch (e) {
    return { error: 'Gagal menyetujui komentar' };
  }
}

// Initialize comment form
function setupCommentForm() {
  const commentForm = document.querySelector('#commentForm');
  const commentMsg = document.querySelector('#commentMsg');

  if (commentForm) {
    commentForm.addEventListener('submit', async e => {
      e.preventDefault();
      const form = new FormData(commentForm);
      const text = String(form.get('comment-text') || '').trim();
      
      const authData = JSON.parse(localStorage.getItem('member_demo_auth_v1') || 'null');
      const username = authData?.username || 'Anonymous';
      
      if (!text) {
        commentMsg.textContent = 'Komentar tidak boleh kosong!';
        return;
      }

      const result = await submitComment(text, username);
      if (result.error) {
        commentMsg.textContent = result.error;
      } else {
        commentMsg.textContent = 'Komentar terkirim, menunggu persetujuan admin!';
        commentForm.reset();
      }
    });
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCommentForm);
} else {
  setupCommentForm();
}