"use client"

import { useEffect, useRef } from 'react'

/**
 * Perlin-like noise fog background
 * Canvas-based for organic, flowing effect
 * Optimized: low resolution, throttled updates
 */
export function FogBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Low resolution for performance (will be scaled up)
    const SCALE = 4 // render at 1/4 resolution
    let width = Math.floor(window.innerWidth / SCALE)
    let height = Math.floor(window.innerHeight / SCALE)
    
    const resize = () => {
      width = Math.floor(window.innerWidth / SCALE)
      height = Math.floor(window.innerHeight / SCALE)
      canvas.width = width
      canvas.height = height
      canvas.style.width = '100vw'
      canvas.style.height = '100vh'
    }
    resize()
    window.addEventListener('resize', resize)
    
    // Simple noise function (simplex-like)
    const noise = (() => {
      const permutation = new Uint8Array(512)
      for (let i = 0; i < 256; i++) permutation[i] = i
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[permutation[i], permutation[j]] = [permutation[j], permutation[i]]
      }
      for (let i = 0; i < 256; i++) permutation[i + 256] = permutation[i]
      
      const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
      const lerp = (a: number, b: number, t: number) => a + t * (b - a)
      const grad = (hash: number, x: number, y: number) => {
        const h = hash & 3
        const u = h < 2 ? x : y
        const v = h < 2 ? y : x
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v)
      }
      
      return (x: number, y: number) => {
        const X = Math.floor(x) & 255
        const Y = Math.floor(y) & 255
        x -= Math.floor(x)
        y -= Math.floor(y)
        const u = fade(x)
        const v = fade(y)
        const A = permutation[X] + Y
        const B = permutation[X + 1] + Y
        return lerp(
          lerp(grad(permutation[A], x, y), grad(permutation[B], x - 1, y), u),
          lerp(grad(permutation[A + 1], x, y - 1), grad(permutation[B + 1], x - 1, y - 1), u),
          v
        )
      }
    })()
    
    // Multi-octave noise for more natural look
    const fbm = (x: number, y: number, octaves: number = 4) => {
      let value = 0
      let amplitude = 0.5
      let frequency = 1
      for (let i = 0; i < octaves; i++) {
        value += amplitude * noise(x * frequency, y * frequency)
        amplitude *= 0.5
        frequency *= 2
      }
      return value
    }
    
    let animationId: number
    let time = 0
    const FPS = 24 // Limit FPS for performance
    const frameInterval = 1000 / FPS
    let lastFrameTime = 0
    
    const render = (currentTime: number) => {
      animationId = requestAnimationFrame(render)
      
      // Throttle frame rate
      if (currentTime - lastFrameTime < frameInterval) return
      lastFrameTime = currentTime
      
      time += 0.003 // Slow movement
      
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Multiple noise layers at different scales
          const nx = x / width
          const ny = y / height
          
          const n1 = fbm(nx * 3 + time * 0.5, ny * 2 + time * 0.3, 4)
          const n2 = fbm(nx * 2 - time * 0.4, ny * 3 + time * 0.2, 3)
          const n3 = fbm(nx * 4 + time * 0.2, ny * 2.5 - time * 0.35, 3)
          
          // Combine layers
          let value = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2 + 0.5)
          
          // Add vignette effect
          const dx = nx - 0.5
          const dy = ny - 0.5
          const vignette = 1 - Math.sqrt(dx * dx + dy * dy) * 0.8
          value *= vignette
          
          // Fog color - warm gray with slight variation
          const intensity = Math.max(0, Math.min(1, value)) * 0.4
          const i = (y * width + x) * 4
          
          // Subtle color variation in fog
          data[i] = 100 + n1 * 18     // R
          data[i + 1] = 95 + n2 * 14  // G  
          data[i + 2] = 92 + n3 * 16  // B
          data[i + 3] = intensity * 255 // A
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(render)
    } else {
      // Render single static frame
      render(0)
    }
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none hidden sm:block"
      style={{ 
        imageRendering: 'auto',
        filter: 'blur(8px)',
      }}
      aria-hidden="true"
    />
  )
}

