import { useEffect, useRef, useState } from 'react'

type UseInViewOptions = {
    threshold?: number
    rootMargin?: string
    once?: boolean
}

/**
 * Observes an element and reports when it enters the viewport.
 * State starts as `false` on both server and client, and the observer only
 * runs after mount, so there is nothing to mismatch during hydration.
 */
export const useInView = <T extends HTMLElement>({
    threshold = 0.2,
    rootMargin = '0px 0px -10% 0px',
    once = true
}: UseInViewOptions = {}) => {
    const ref = useRef<T>(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const node = ref.current

        if (!node) return

        // Very old browsers: show the content rather than hiding it forever.
        if (typeof IntersectionObserver === 'undefined') {
            setInView(true)

            return
        }

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setInView(true)

                        if (once) observer.unobserve(entry.target)
                    } else if (!once) {
                        setInView(false)
                    }
                })
            },
            { threshold, rootMargin }
        )

        observer.observe(node)

        return () => observer.disconnect()
    }, [threshold, rootMargin, once])

    return { ref, inView }
}