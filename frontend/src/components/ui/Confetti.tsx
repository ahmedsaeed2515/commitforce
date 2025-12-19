'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  rotation: number;
  rotationSpeed: number;
}

const COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#f97316', // Orange
];

/**
 * Confetti Component
 * Shows celebration confetti animation
 */
export default function Confetti({
  active = false,
  duration = 3000,
  pieceCount = 100,
  onComplete,
}: {
  active: boolean;
  duration?: number;
  pieceCount?: number;
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const createPieces = useCallback((count: number): ConfettiPiece[] => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -100 - 50,
        size: Math.random() * 10 + 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
      });
    }
    return pieces;
  }, []);

  useEffect(() => {
    if (!active) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      piecesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create confetti pieces
    piecesRef.current = createPieces(pieceCount);

    // Animation function
    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      piecesRef.current = piecesRef.current.filter((piece) => {
        // Update position
        piece.y += piece.speed;
        piece.x += Math.sin(piece.angle) * 2;
        piece.rotation += piece.rotationSpeed;

        // Draw piece
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;

        // Draw rectangle or circle randomly
        if (piece.size > 7) {
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Remove if off screen
        return piece.y < canvas.height + 50;
      });

      if (piecesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onCompleteRef.current?.();
      }
    };

    // Start animation
    animate();

    // Stop after duration
    const timeout = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      onCompleteRef.current?.();
    }, duration);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, duration, pieceCount, createPieces]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-9999"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}

/**
 * Hook to trigger confetti
 */
export function useConfetti() {
  const triggerRef = useRef<(() => void) | null>(null);

  const trigger = useCallback(() => {
    triggerRef.current?.();
  }, []);

  return { trigger, triggerRef };
}
