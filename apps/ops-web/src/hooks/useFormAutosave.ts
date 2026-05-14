import { useEffect, useCallback } from 'react'
import { saveDiscoveryFormDraft } from '@/app/[locale]/f/[slug]/actions'

export function useFormAutosave<T>(
  slug: string,
  formValues: T
) {
  // Save on every change (debounced)
  const save = useCallback(
    debounce((values: T) => {
      if (!slug) return
      saveDiscoveryFormDraft(slug, values).catch(() => {
        // Silently fail on draft save errors to avoid disrupting UX
      });
    }, 1500),
    [slug]
  )

  useEffect(() => {
    // We stringify and parse to avoid reference equality issues triggering infinite loops
    // but React's useEffect dependency array handles reference equality of the object itself.
    // If formValues changes reference frequently, this might trigger too often.
    // The debounce protects the server from being hammered.
    save(formValues)
  }, [formValues, save])

  return {}
}

// Simple debounce util
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}
