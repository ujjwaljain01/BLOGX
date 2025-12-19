// components/CommentList.jsx
import React, { useEffect, useState, useRef } from 'react';
import service from '../appwrite/config';
import authService from '../appwrite/auth';
import CommentForm from './CommentForm';

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const subRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);

      // 1) guard: require a valid postId
      if (!postId) {
        console.warn('CommentList: missing postId, skipping load.');
        setComments([]);
        setLoading(false);
        return;
      }

      // coerce to string (Appwrite expects the same type stored)
      const articleId = typeof postId === 'string' ? postId : String(postId);
      console.debug('CommentList: loading comments for articleId=', articleId);

      // 2) current user (optional)
      const currentUser = await authService.getCurrentUser().catch(() => null);
      if (!mounted) return;
      setUser(currentUser);

      // 3) load comments
      try {
        const res = await service.getCommentsByPost(articleId);
        if (!mounted) return;
        setComments(res?.documents || []);
      } catch (err) {
        console.error('CommentList: failed to load comments', err);
        setComments([]);
      } finally {
        if (mounted) setLoading(false);
      }

      // 4) subscribe to realtime changes for this article
      try {
        if (subRef.current && typeof subRef.current.close === 'function') {
          subRef.current.close();
        }
        subRef.current = service.subscribeToComments(articleId, (evt) => {
          try {
            const { events = [], payload } = evt;
            if (!payload) return;
            // create
            if (events.some((e) => e.includes('.create'))) {
              setComments((s) => [payload, ...s]);
            } else if (events.some((e) => e.includes('.update'))) {
              setComments((s) => s.map((c) => (c.$id === payload.$id ? payload : c)));
            } else if (events.some((e) => e.includes('.delete'))) {
              setComments((s) => s.filter((c) => c.$id !== payload.$id));
            }
          } catch (e) {
            console.warn('Realtime handler error', e);
          }
        });
      } catch (e) {
        console.warn('CommentList: subscribeToComments failed', e);
      }
    })();

    return () => {
      mounted = false;
      if (subRef.current && typeof subRef.current.close === 'function') {
        try { subRef.current.close(); } catch (e) { /* ignore */ }
      }
    };
  }, [postId]);

  const handlePosted = (newDoc) => {
    setComments((s) => [newDoc, ...s]);
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    const ok = await service.deleteComment(commentId);
    if (ok) setComments((s) => s.filter((c) => c.$id !== commentId));
  };

  const handleEdit = async (commentId, currentContent) => {
    const newContent = prompt('Edit your comment', currentContent);
    if (newContent === null) return;
    if (!newContent.trim() || newContent.trim() === currentContent) return;
    const updated = await service.updateComment(commentId, { content: newContent.trim() });
    if (updated) setComments((s) => s.map((c) => (c.$id === updated.$id ? updated : c)));
  };

  if (!postId) {
    return <div className="py-4 text-sm text-white/70">Comments unavailable.</div>;
  }

  if (loading) return <div className="py-4 text-sm text-white/70">Loading comments…</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{comments.length} Comment{comments.length===1?'':'s'}</h3>

      <CommentForm postId={postId} onPosted={handlePosted} />

      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.$id} className="rounded border p-3 bg-white/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{c.userId || c.authorId || 'Anonymous'}</div>
                <div className="text-xs text-white/60">{new Date(c.$createdAt).toLocaleString()}</div>
              </div>
              <div className="text-xs text-white/60">{c.edited ? 'edited' : ''}</div>
            </div>

            <p className="mt-2">{c.content}</p>

            <div className="mt-2 flex gap-2">
              {user && user.$id === String(c.userId) && (
                <>
                  <button onClick={() => handleEdit(c.$id, c.content)} className="text-xs">Edit</button>
                  <button onClick={() => handleDelete(c.$id)} className="text-xs text-red-400">Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
