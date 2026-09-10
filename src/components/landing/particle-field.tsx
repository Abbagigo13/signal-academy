import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

type Particle = {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    color: string
}

const PARTICLE_COLORS = ['53, 208, 226', '29, 162, 180', '76, 99, 201', '136, 153, 187']

/** Max distance in CSS pixels at which two particles are linked by a line. */
const LINK_DISTANCE = 130

/** Radius of the cursor's influence. */
const POINTER_DISTANCE = 170

/** Ceiling on particle speed so the repulsion can never make them fly off. */
const MAX_SPEED = 0.42

/**
 * Full-viewport canvas of drifting particles that link up when they get close
 * and lean away from the cursor. Everything touches `window` inside `useEffect`,
 * so the component is safe to render on the server.
 */
export const ParticleField: FC = (): ReactNode => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) return

        const context = canvas.getContext('2d')

        if (!context) return

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let particles: Particle[] = []
        let width = 0
        let height = 0
        let frameId = 0

        const pointer = { x: -9999, y: -9999, active: false }

        const buildParticles = () => {
            // Roughly one particle per 17k css pixels, clamped for phones and ultrawides.
            const density = Math.round((width * height) / 17000)
            const count = Math.max(26, Math.min(density, 92))

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.34,
                vy: (Math.random() - 0.5) * 0.34,
                radius: Math.random() * 1.6 + 0.8,
                color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
            }))
        }

        const resize = () => {
            const ratio = Math.min(window.devicePixelRatio || 1, 2)

            width = canvas.clientWidth
            height = canvas.clientHeight

            canvas.width = Math.floor(width * ratio)
            canvas.height = Math.floor(height * ratio)

            context.setTransform(ratio, 0, 0, ratio, 0, 0)

            buildParticles()

            // Resizing wipes the canvas, so a held-still field needs a repaint.
            if (reduceMotion) paint()
        }

        const paint = () => {
            context.clearRect(0, 0, width, height)

            // Links between neighbouring particles.
            for (let i = 0; i < particles.length; i += 1) {
                for (let j = i + 1; j < particles.length; j += 1) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.hypot(dx, dy)

                    if (distance >= LINK_DISTANCE) continue

                    const alpha = (1 - distance / LINK_DISTANCE) * 0.28

                    context.strokeStyle = `rgba(29, 162, 180, ${alpha})`
                    context.lineWidth = 1
                    context.beginPath()
                    context.moveTo(particles[i].x, particles[i].y)
                    context.lineTo(particles[j].x, particles[j].y)
                    context.stroke()
                }
            }

            // Links from the cursor to whatever is near it.
            if (pointer.active) {
                for (const particle of particles) {
                    const dx = particle.x - pointer.x
                    const dy = particle.y - pointer.y
                    const distance = Math.hypot(dx, dy)

                    if (distance >= POINTER_DISTANCE) continue

                    const alpha = (1 - distance / POINTER_DISTANCE) * 0.5

                    context.strokeStyle = `rgba(53, 208, 226, ${alpha})`
                    context.lineWidth = 1
                    context.beginPath()
                    context.moveTo(particle.x, particle.y)
                    context.lineTo(pointer.x, pointer.y)
                    context.stroke()
                }
            }

            // The particles themselves, drawn on top of the web.
            for (const particle of particles) {
                context.fillStyle = `rgba(${particle.color}, 0.75)`
                context.beginPath()
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
                context.fill()
            }
        }

        const step = () => {
            for (const particle of particles) {
                particle.x += particle.vx
                particle.y += particle.vy

                // Soft bounce so nothing ever leaves the field.
                if (particle.x <= 0 || particle.x >= width) particle.vx *= -1
                if (particle.y <= 0 || particle.y >= height) particle.vy *= -1

                particle.x = Math.min(Math.max(particle.x, 0), width)
                particle.y = Math.min(Math.max(particle.y, 0), height)

                if (!pointer.active) continue

                const dx = particle.x - pointer.x
                const dy = particle.y - pointer.y
                const distance = Math.hypot(dx, dy) || 1

                if (distance >= POINTER_DISTANCE) continue

                // Gentle push away from the cursor, strongest at the centre.
                const force = (1 - distance / POINTER_DISTANCE) * 0.06

                particle.vx += (dx / distance) * force
                particle.vy += (dy / distance) * force

                const speed = Math.hypot(particle.vx, particle.vy)

                if (speed > MAX_SPEED) {
                    particle.vx = (particle.vx / speed) * MAX_SPEED
                    particle.vy = (particle.vy / speed) * MAX_SPEED
                }
            }

            paint()

            frameId = window.requestAnimationFrame(step)
        }

        const handlePointerMove = (event: PointerEvent) => {
            const bounds = canvas.getBoundingClientRect()

            pointer.x = event.clientX - bounds.left
            pointer.y = event.clientY - bounds.top
            pointer.active = event.pointerType === 'mouse'
        }

        const handlePointerLeave = () => {
            pointer.active = false
            pointer.x = -9999
            pointer.y = -9999
        }

        const handleVisibility = () => {
            if (document.hidden) {
                window.cancelAnimationFrame(frameId)
            } else if (!reduceMotion) {
                frameId = window.requestAnimationFrame(step)
            }
        }

        resize()

        window.addEventListener('resize', resize)
        document.addEventListener('visibilitychange', handleVisibility)

        if (reduceMotion) {
            // Still render the constellation, just hold it perfectly still.
            paint()
        } else {
            window.addEventListener('pointermove', handlePointerMove, { passive: true })
            window.addEventListener('pointerleave', handlePointerLeave)

            frameId = window.requestAnimationFrame(step)
        }

        return () => {
            window.cancelAnimationFrame(frameId)
            window.removeEventListener('resize', resize)
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerleave', handlePointerLeave)
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden='true'
            className='pointer-events-none fixed inset-0 -z-10 h-full w-full'
        />
    )
}