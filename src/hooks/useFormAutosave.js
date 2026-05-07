import { useState, useCallback, useEffect, useRef } from 'react';

const STORAGE_PREFIX = 'form_autosave_';

export function useFormAutosave(formId, initialData = {}) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const saveTimeoutRef = useRef(null);
  const storageKeyRef = useRef(`${STORAGE_PREFIX}${formId}`);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(storageKeyRef.current);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse autosaved form data:', e);
      }
    }
  }, [formId]);

  // Auto-save to localStorage
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      try {
        localStorage.setItem(storageKeyRef.current, JSON.stringify(data));
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (e) {
        console.error('Failed to autosave form:', e);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Debounce by 1 second

    return () => clearTimeout(saveTimeoutRef.current);
  }, [data]);

  const updateField = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  }, []);

  const updateMultiple = useCallback((updates) => {
    setData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKeyRef.current);
    setData(initialData);
    setHasUnsavedChanges(false);
    setLastSaved(null);
  }, [initialData]);

  const hasSavedDraft = () => {
    return !!localStorage.getItem(storageKeyRef.current);
  };

  return {
    data,
    setData,
    updateField,
    updateMultiple,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    clearDraft,
    hasSavedDraft,
  };
}