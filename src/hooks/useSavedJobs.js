import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

/**
 * Tracks which jobs the current jobseeker has bookmarked, and exposes a
 * toggleSave function so any page (Home, Jobs, JobDetails, SavedJobs) can
 * show/update bookmark state without duplicating fetch logic.
 *
 * Returns { savedIds: Set<string>, toggleSave: (jobId) => void, loading }
 */
export function useSavedJobs() {
  const { isAuthenticated, user } = useAuthStore();
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const isJobseeker = isAuthenticated && user?.role === 'jobseeker';

  useEffect(() => {
    if (!isJobseeker) {
      setSavedIds(new Set());
      return;
    }
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const res = await api.get('/saved-jobs');
        const ids = (res.data.savedJobs || []).map((s) => s.job._id);
        setSavedIds(new Set(ids));
      } catch (err) {
        // Silent — bookmark state just won't be pre-filled, not critical enough for a toast
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [isJobseeker]);

  const toggleSave = useCallback(
    async (jobId) => {
      if (!isJobseeker) {
        toast.error('Log in as a job seeker to save jobs');
        return;
      }

      const alreadySaved = savedIds.has(jobId);

      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (alreadySaved) next.delete(jobId);
        else next.add(jobId);
        return next;
      });

      try {
        if (alreadySaved) {
          await api.delete(`/saved-jobs/${jobId}`);
          toast.success('Removed from saved jobs');
        } else {
          await api.post(`/saved-jobs/${jobId}`);
          toast.success('Job saved');
        }
      } catch (err) {
        // Roll back on failure
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (alreadySaved) next.add(jobId);
          else next.delete(jobId);
          return next;
        });
        toast.error(err.response?.data?.message || 'Could not update saved jobs');
      }
    },
    [isJobseeker, savedIds]
  );

  return { savedIds, toggleSave, loading, isJobseeker };
}
