import { useEffect, useRef, useState } from 'react';

interface ThemeVisualProps {
    image: string;
    color: string;
}

const TILE_SIZE = 72;

const FLIP_DURATION = 500;
const FLIP_STAGGER = 24;

const BRUSH_RADIUS = 70;
const BRUSH_BLOBS = 5;

const REVEAL_BRIGHTNESS = 1.08;
const REVEAL_SATURATION = 1.12;

const EDGE_GLOW_BLUR = 12;
const EDGE_GLOW_OPACITY = 0.32;
const EDGE_UPDATE_INTERVAL = 40;

const REVEAL_EXIT_DURATION = 450;

const ThemeVisual = ({
    image,
    color,
}: ThemeVisualProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const colorRef = useRef(color);

    const currentImageRef =
        useRef<HTMLImageElement | null>(null);

    const previousImageRef =
        useRef<HTMLImageElement | null>(null);

    const resetMaskRef = useRef(true);
    const edgeDirtyRef = useRef(true);

    const canvasReadyRef = useRef(false);

    const transitionRef = useRef({
        active: false,
        startedAt: 0,
    });

    const [canvasReady, setCanvasReady] =
        useState(false);

    const [fallbackLoaded, setFallbackLoaded] =
        useState(false);

    const [hasInteracted, setHasInteracted] =
        useState(false);

    useEffect(() => {
        colorRef.current = color;
        edgeDirtyRef.current = true;
    }, [color]);

    /*
     * Changing theme does NOT hide the canvas.
     *
     * The previous image stays visible until the new
     * one is fully loaded, then tile-flip starts.
     */
    useEffect(() => {
        let cancelled = false;

        const img = new Image();

        img.decoding = 'async';

        img.onload = () => {
            if (cancelled) return;

            if (!currentImageRef.current) {
                currentImageRef.current = img;

                resetMaskRef.current = true;
                edgeDirtyRef.current = true;

                return;
            }

            previousImageRef.current =
                currentImageRef.current;

            currentImageRef.current = img;

            transitionRef.current = {
                active: true,
                startedAt: performance.now(),
            };

            edgeDirtyRef.current = false;

            setHasInteracted(false);
        };

        img.src = image;

        return () => {
            cancelled = true;
        };
    }, [image]);

    /*
     * Canvas engine is mounted only once.
     */
    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const context =
            canvas.getContext('2d');

        if (!context) return;

        const maskCanvas =
            document.createElement('canvas');

        const maskContext =
            maskCanvas.getContext('2d');

        const revealCanvas =
            document.createElement('canvas');

        const revealContext =
            revealCanvas.getContext('2d');

        const edgeCanvas =
            document.createElement('canvas');

        const edgeContext =
            edgeCanvas.getContext('2d');

        if (
            !maskContext ||
            !revealContext ||
            !edgeContext
        ) {
            return;
        }

        let width = 0;
        let height = 0;
        let dpr = 1;

        let animationFrame = 0;

        let lastEdgeUpdate = 0;

        let hasPainted = false;

        const pointer = {
            x: 0,
            y: 0,

            previousX: 0,
            previousY: 0,

            inside: false,
            down: false,
        };

        const clamp = (
            value: number,
            min: number,
            max: number,
        ) => Math.min(Math.max(value, min), max);

        const getRevealOpacity = (time: number) => {
            const transition = transitionRef.current;

            if (!transition.active) {
                return 1;
            }

            const progress = clamp(
                (time - transition.startedAt) /
                REVEAL_EXIT_DURATION,
                0,
                1,
            );

            /*
             * Smooth ease-out instead of linear fade.
             */
            const eased =
                progress * progress * (3 - 2 * progress);

            return 1 - eased;
        };

        const noise = (
            x: number,
            y: number,
            seed: number,
        ) => {
            const value =
                Math.sin(
                    x * 12.9898 +
                    y * 78.233 +
                    seed * 37.719,
                ) * 43758.5453;

            return value - Math.floor(value);
        };

        /*
         * Important for desktop -> mobile -> desktop.
         *
         * When hidden with display:none, the canvas may
         * temporarily report 0x0. We ignore that.
         */
        const resize = () => {
            const rect =
                canvas.getBoundingClientRect();

            if (
                rect.width <= 1 ||
                rect.height <= 1
            ) {
                return;
            }

            const nextWidth =
                Math.round(rect.width);

            const nextHeight =
                Math.round(rect.height);

            if (
                nextWidth === width &&
                nextHeight === height
            ) {
                return;
            }

            /*
             * Save the current reveal mask before resizing.
             *
             * Changing canvas.width / canvas.height clears
             * the canvas automatically.
             */
            let savedMask:
                | HTMLCanvasElement
                | null = null;

            const hadPaintedMask =
                hasPainted &&
                width > 0 &&
                height > 0;

            if (hadPaintedMask) {
                savedMask =
                    document.createElement(
                        'canvas',
                    );

                savedMask.width =
                    maskCanvas.width;

                savedMask.height =
                    maskCanvas.height;

                const savedContext =
                    savedMask.getContext('2d');

                if (savedContext) {
                    savedContext.drawImage(
                        maskCanvas,
                        0,
                        0,
                    );
                }
            }

            width = nextWidth;
            height = nextHeight;

            dpr = Math.min(
                window.devicePixelRatio || 1,
                2,
            );

            canvas.width =
                Math.round(width * dpr);

            canvas.height =
                Math.round(height * dpr);

            maskCanvas.width =
                Math.round(width * dpr);

            maskCanvas.height =
                Math.round(height * dpr);

            revealCanvas.width =
                Math.round(width * dpr);

            revealCanvas.height =
                Math.round(height * dpr);

            edgeCanvas.width =
                Math.round(width * dpr);

            edgeCanvas.height =
                Math.round(height * dpr);

            context.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0,
            );

            maskContext.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0,
            );

            revealContext.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0,
            );

            edgeContext.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0,
            );

            revealContext.clearRect(
                0,
                0,
                width,
                height,
            );

            edgeContext.clearRect(
                0,
                0,
                width,
                height,
            );

            /*
             * Restore the previous mask scaled to the
             * new canvas dimensions.
             */
            if (
                savedMask &&
                hadPaintedMask
            ) {
                maskContext.save();

                maskContext.drawImage(
                    savedMask,

                    0,
                    0,
                    savedMask.width,
                    savedMask.height,

                    0,
                    0,
                    width,
                    height,
                );

                maskContext.restore();

                /*
                 * Keep the reveal alive.
                 */
                hasPainted = true;
            } else {
                maskContext.clearRect(
                    0,
                    0,
                    width,
                    height,
                );

                hasPainted = false;
            }

            edgeDirtyRef.current = true;

            /*
             * Do NOT reset the mask after resize.
             */
            resetMaskRef.current = false;
        };

        const getCoverSource = (
            img: HTMLImageElement,
        ) => {
            const imageRatio =
                img.width / img.height;

            const canvasRatio =
                width / height;

            let sourceWidth =
                img.width;

            let sourceHeight =
                img.height;

            let sourceX = 0;
            let sourceY = 0;

            if (imageRatio > canvasRatio) {
                sourceWidth =
                    img.height * canvasRatio;

                sourceX =
                    (img.width - sourceWidth) / 2;
            } else {
                sourceHeight =
                    img.width / canvasRatio;

                sourceY =
                    (img.height - sourceHeight) / 2;
            }

            return {
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
            };
        };

        const drawImage = (
            target: CanvasRenderingContext2D,
            img: HTMLImageElement,
        ) => {
            if (
                width <= 1 ||
                height <= 1
            ) {
                return;
            }

            const source =
                getCoverSource(img);

            target.drawImage(
                img,

                source.sourceX,
                source.sourceY,
                source.sourceWidth,
                source.sourceHeight,

                0,
                0,
                width,
                height,
            );
        };

        const drawDimmedImage = (
            img: HTMLImageElement,
        ) => {
            context.save();

            /*
             * Keep this identical to the fallback <img>
             * filter below.
             */
            context.filter =
                'grayscale(45%) brightness(70%) saturate(75%)';

            drawImage(
                context,
                img,
            );

            context.restore();
        };

        const drawTile = (
            img: HTMLImageElement,

            x: number,
            y: number,

            tileWidth: number,
            tileHeight: number,

            scaleX: number,
        ) => {
            const source =
                getCoverSource(img);

            const sourceX =
                source.sourceX +
                (x / width) *
                source.sourceWidth;

            const sourceY =
                source.sourceY +
                (y / height) *
                source.sourceHeight;

            const sourceWidth =
                (tileWidth / width) *
                source.sourceWidth;

            const sourceHeight =
                (tileHeight / height) *
                source.sourceHeight;

            const visibleWidth =
                Math.max(
                    tileWidth * scaleX,
                    0.5,
                );

            context.drawImage(
                img,

                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,

                x +
                tileWidth / 2 -
                visibleWidth / 2,

                y,

                visibleWidth + 1,
                tileHeight + 1,
            );
        };

        const drawThemeTransition = (
            time: number,
        ) => {
            const current =
                currentImageRef.current;

            const previous =
                previousImageRef.current;

            const transition =
                transitionRef.current;

            if (!current) return;

            if (
                !transition.active ||
                !previous
            ) {
                drawDimmedImage(current);
                return;
            }

            const elapsed =
                time -
                transition.startedAt;

            const columns =
                Math.ceil(
                    width / TILE_SIZE,
                );

            const rows =
                Math.ceil(
                    height / TILE_SIZE,
                );

            let finished = true;

            context.save();

            context.filter =
                'grayscale(45%) brightness(70%) saturate(75%)';

            for (
                let row = 0;
                row < rows;
                row++
            ) {
                for (
                    let column = 0;
                    column < columns;
                    column++
                ) {
                    const x =
                        column *
                        TILE_SIZE;

                    const y =
                        row *
                        TILE_SIZE;

                    const tileWidth =
                        Math.min(
                            TILE_SIZE,
                            width - x,
                        );

                    const tileHeight =
                        Math.min(
                            TILE_SIZE,
                            height - y,
                        );

                    const delay =
                        (column + row) *
                        FLIP_STAGGER;

                    const progress =
                        clamp(
                            (
                                elapsed -
                                delay
                            ) /
                            FLIP_DURATION,

                            0,
                            1,
                        );

                    if (progress < 1) {
                        finished = false;
                    }

                    const scaleX =
                        Math.abs(
                            Math.cos(
                                progress *
                                Math.PI,
                            ),
                        );

                    const imageToDraw =
                        progress < 0.5
                            ? previous
                            : current;

                    drawTile(
                        imageToDraw,

                        x,
                        y,

                        tileWidth,
                        tileHeight,

                        scaleX,
                    );
                }
            }

            context.restore();

            if (finished) {
                /*
                 * Clear the old reveal BEFORE marking the
                 * transition as finished.
                 *
                 * Otherwise one frame can render the new theme
                 * together with the previous reveal / glow.
                 */
                maskContext.clearRect(
                    0,
                    0,
                    width,
                    height,
                );

                revealContext.clearRect(
                    0,
                    0,
                    width,
                    height,
                );

                edgeContext.clearRect(
                    0,
                    0,
                    width,
                    height,
                );

                hasPainted = false;

                resetMaskRef.current = false;
                edgeDirtyRef.current = false;

                previousImageRef.current = null;

                transition.active = false;

                setHasInteracted(false);
            }
        };

        const paintBlob = (
            x: number,
            y: number,

            radius: number,
            strength = 1,
        ) => {
            const gradient =
                maskContext.createRadialGradient(
                    x,
                    y,
                    0,

                    x,
                    y,
                    radius,
                );

            gradient.addColorStop(
                0,
                `rgba(255,255,255,${strength})`,
            );

            gradient.addColorStop(
                0.55,
                `rgba(255,255,255,${strength * 0.92
                })`,
            );

            gradient.addColorStop(
                0.82,
                `rgba(255,255,255,${strength * 0.45
                })`,
            );

            gradient.addColorStop(
                1,
                'rgba(255,255,255,0)',
            );

            maskContext.fillStyle =
                gradient;

            maskContext.fillRect(
                x - radius,
                y - radius,
                radius * 2,
                radius * 2,
            );
        };

        const paintMask = (
            x: number,
            y: number,
        ) => {
            paintBlob(
                x,
                y,
                BRUSH_RADIUS * 0.78,
                1,
            );

            for (
                let i = 0;
                i < BRUSH_BLOBS;
                i++
            ) {
                const angle =
                    noise(
                        x,
                        y,
                        i,
                    ) *
                    Math.PI *
                    2;

                const distance =
                    BRUSH_RADIUS *
                    (
                        0.25 +
                        noise(
                            x,
                            y,
                            i + 10,
                        ) *
                        0.33
                    );

                const radius =
                    BRUSH_RADIUS *
                    (
                        0.24 +
                        noise(
                            x,
                            y,
                            i + 20,
                        ) *
                        0.22
                    );

                paintBlob(
                    x +
                    Math.cos(angle) *
                    distance,

                    y +
                    Math.sin(angle) *
                    distance,

                    radius,

                    0.78,
                );
            }

            hasPainted = true;

            edgeDirtyRef.current = true;

        };

        const paintLine = (
            fromX: number,
            fromY: number,

            toX: number,
            toY: number,
        ) => {
            const dx =
                toX - fromX;

            const dy =
                toY - fromY;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy,
                );

            const steps =
                Math.max(
                    1,
                    Math.ceil(
                        distance /
                        (
                            BRUSH_RADIUS *
                            0.3
                        ),
                    ),
                );

            for (
                let i = 0;
                i <= steps;
                i++
            ) {
                const progress =
                    i / steps;

                paintMask(
                    fromX +
                    dx * progress,

                    fromY +
                    dy * progress,
                );
            }
        };

        const updateEdgeGlow = (
            time: number,
        ) => {
            if (
                transitionRef.current.active
            ) {
                return;
            }

            if (
                !edgeDirtyRef.current ||
                time -
                lastEdgeUpdate <
                EDGE_UPDATE_INTERVAL
            ) {
                return;
            }

            edgeContext.clearRect(
                0,
                0,
                width,
                height,
            );

            edgeContext.save();

            edgeContext.filter =
                `blur(${EDGE_GLOW_BLUR}px)`;

            edgeContext.globalAlpha =
                EDGE_GLOW_OPACITY;

            edgeContext.drawImage(
                maskCanvas,

                0,
                0,
                maskCanvas.width,
                maskCanvas.height,

                0,
                0,
                width,
                height,
            );

            edgeContext.restore();

            edgeContext.save();

            edgeContext.globalCompositeOperation =
                'destination-out';

            edgeContext.drawImage(
                maskCanvas,

                0,
                0,
                maskCanvas.width,
                maskCanvas.height,

                0,
                0,
                width,
                height,
            );

            edgeContext.restore();

            edgeContext.save();

            edgeContext.globalCompositeOperation =
                'source-in';

            edgeContext.fillStyle =
                colorRef.current;

            edgeContext.fillRect(
                0,
                0,
                width,
                height,
            );

            edgeContext.restore();

            edgeDirtyRef.current = false;

            lastEdgeUpdate = time;
        };

        const drawReveal = (time: number) => {
            const current =
                currentImageRef.current;

            const previous =
                previousImageRef.current;

            if (
                !current ||
                !hasPainted
            ) {
                return;
            }

            const transition =
                transitionRef.current;

            /*
             * During theme transition we keep revealing
             * the OLD image for a short moment and smoothly
             * fade it out.
             */
            const revealImage =
                transition.active &&
                    previous
                    ? previous
                    : current;

            const opacity =
                getRevealOpacity(time);

            if (opacity <= 0.001) {
                return;
            }

            revealContext.clearRect(
                0,
                0,
                width,
                height,
            );

            revealContext.save();

            revealContext.filter =
                `brightness(${REVEAL_BRIGHTNESS}) saturate(${REVEAL_SATURATION})`;

            drawImage(
                revealContext,
                revealImage,
            );

            revealContext.restore();

            revealContext.save();

            revealContext.globalCompositeOperation =
                'destination-in';

            revealContext.drawImage(
                maskCanvas,

                0,
                0,
                maskCanvas.width,
                maskCanvas.height,

                0,
                0,
                width,
                height,
            );

            revealContext.restore();

            /*
             * Bloom.
             */
            context.save();

            context.globalAlpha =
                0.14 * opacity;

            context.filter =
                'blur(7px) brightness(1.2) saturate(1.2)';

            context.drawImage(
                revealCanvas,

                0,
                0,
                revealCanvas.width,
                revealCanvas.height,

                0,
                0,
                width,
                height,
            );

            context.restore();

            /*
             * Main reveal.
             */
            context.save();

            context.globalAlpha =
                opacity;

            context.drawImage(
                revealCanvas,

                0,
                0,
                revealCanvas.width,
                revealCanvas.height,

                0,
                0,
                width,
                height,
            );

            context.restore();
        };

        const drawCursor = () => {
            if (
                !pointer.inside ||
                transitionRef.current.active
            ) {
                return;
            }

            const currentColor =
                colorRef.current;

            context.save();

            const halo =
                context.createRadialGradient(
                    pointer.x,
                    pointer.y,
                    0,

                    pointer.x,
                    pointer.y,
                    18,
                );

            halo.addColorStop(
                0,
                currentColor,
            );

            halo.addColorStop(
                0.18,
                pointer.down
                    ? `${currentColor}80`
                    : `${currentColor}50`,
            );

            halo.addColorStop(
                1,
                'rgba(0,0,0,0)',
            );

            context.fillStyle =
                halo;

            context.beginPath();

            context.arc(
                pointer.x,
                pointer.y,
                18,
                0,
                Math.PI * 2,
            );

            context.fill();

            context.globalAlpha =
                pointer.down
                    ? 0.9
                    : 0.65;

            context.fillStyle =
                currentColor;

            context.beginPath();

            context.arc(
                pointer.x,
                pointer.y,

                pointer.down
                    ? 2.5
                    : 2,

                0,
                Math.PI * 2,
            );

            context.fill();

            context.restore();
        };

        /*
         * Mark canvas ready ONLY after it has
         * actually rendered a valid image frame.
         *
         * This prevents:
         * fallback disappears -> empty canvas -> flash.
         */
        const markCanvasReady = () => {
            if (
                canvasReadyRef.current
            ) {
                return;
            }

            canvasReadyRef.current = true;

            setCanvasReady(true);
        };

        const draw = (
            time: number,
        ) => {

            if (
                width <= 1 ||
                height <= 1
            ) {
                animationFrame =
                    requestAnimationFrame(
                        draw,
                    );

                return;
            }

            const current =
                currentImageRef.current;

            if (!current) {
                animationFrame =
                    requestAnimationFrame(
                        draw,
                    );

                return;
            }

            if (
                resetMaskRef.current
            ) {
                maskContext.clearRect(
                    0,
                    0,
                    width,
                    height,
                );

                revealContext.clearRect(
                    0,
                    0,
                    width,
                    height,
                );

                edgeContext.clearRect(
                    0,
                    0,
                    width,
                    height,
                );

                hasPainted = false;

                edgeDirtyRef.current = true;

                resetMaskRef.current = false;
            }

            context.clearRect(
                0,
                0,
                width,
                height,
            );

            drawThemeTransition(
                time,
            );

            drawReveal(time);

            updateEdgeGlow(
                time,
            );

            const revealOpacity =
                getRevealOpacity(time);

            if (
                hasPainted &&
                !transitionRef.current.active &&
                revealOpacity > 0.001
            ) {
                context.save();

                context.globalAlpha =
                    revealOpacity;

                context.globalCompositeOperation =
                    'screen';

                context.drawImage(
                    edgeCanvas,

                    0,
                    0,
                    edgeCanvas.width,
                    edgeCanvas.height,

                    0,
                    0,
                    width,
                    height,
                );

                context.restore();
            }

            drawCursor();

            /*
             * The frame is now really painted.
             */
            markCanvasReady();

            animationFrame =
                requestAnimationFrame(
                    draw,
                );
        };

        const updatePointer = (
            event: PointerEvent,
        ) => {
            const rect =
                canvas.getBoundingClientRect();

            pointer.previousX =
                pointer.x;

            pointer.previousY =
                pointer.y;

            pointer.x =
                event.clientX -
                rect.left;

            pointer.y =
                event.clientY -
                rect.top;
        };

        const handlePointerEnter = (
            event: PointerEvent,
        ) => {
            updatePointer(event);

            pointer.previousX =
                pointer.x;

            pointer.previousY =
                pointer.y;

            pointer.inside = true;
        };

        const handlePointerMove = (
            event: PointerEvent,
        ) => {
            updatePointer(event);

            if (!pointer.down) return;

            paintLine(
                pointer.previousX,
                pointer.previousY,

                pointer.x,
                pointer.y,
            );
        };

        const handlePointerDown = (
            event: PointerEvent,
        ) => {
            if (
                transitionRef.current.active
            ) {
                return;
            }

            updatePointer(event);

            pointer.previousX =
                pointer.x;

            pointer.previousY =
                pointer.y;

            pointer.down = true;

            paintMask(
                pointer.x,
                pointer.y,
            );

            setHasInteracted(true);

            canvas.setPointerCapture(
                event.pointerId,
            );
        };

        const handlePointerUp = (
            event: PointerEvent,
        ) => {
            pointer.down = false;

            if (
                canvas.hasPointerCapture(
                    event.pointerId,
                )
            ) {
                canvas.releasePointerCapture(
                    event.pointerId,
                );
            }
        };

        const handlePointerLeave =
            () => {
                pointer.inside = false;
            };

        const handlePointerCancel =
            () => {
                pointer.down = false;
                pointer.inside = false;
            };

        const resizeObserver =
            new ResizeObserver(
                resize,
            );

        resizeObserver.observe(
            canvas,
        );

        window.addEventListener(
            'resize',
            resize,
        );

        canvas.addEventListener(
            'pointerenter',
            handlePointerEnter,
        );

        canvas.addEventListener(
            'pointermove',
            handlePointerMove,
        );

        canvas.addEventListener(
            'pointerdown',
            handlePointerDown,
        );

        canvas.addEventListener(
            'pointerup',
            handlePointerUp,
        );

        canvas.addEventListener(
            'pointerleave',
            handlePointerLeave,
        );

        canvas.addEventListener(
            'pointercancel',
            handlePointerCancel,
        );

        resize();

        animationFrame =
            requestAnimationFrame(
                draw,
            );

        return () => {
            cancelAnimationFrame(
                animationFrame,
            );

            resizeObserver.disconnect();

            window.removeEventListener(
                'resize',
                resize,
            );

            canvas.removeEventListener(
                'pointerenter',
                handlePointerEnter,
            );

            canvas.removeEventListener(
                'pointermove',
                handlePointerMove,
            );

            canvas.removeEventListener(
                'pointerdown',
                handlePointerDown,
            );

            canvas.removeEventListener(
                'pointerup',
                handlePointerUp,
            );

            canvas.removeEventListener(
                'pointerleave',
                handlePointerLeave,
            );

            canvas.removeEventListener(
                'pointercancel',
                handlePointerCancel,
            );
        };
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/*
       * Fallback for cold first load.
       *
       * It starts hidden and fades in ONLY after
       * the actual image file has loaded.
       */}
            <img
                src={image}
                alt=""
                draggable={false}
                fetchPriority="high"
                decoding="async"
                onLoad={() =>
                    setFallbackLoaded(true)
                }
                style={{
                    filter:
                        'grayscale(45%) brightness(70%) saturate(75%)',
                }}
                className={`
          pointer-events-none
          absolute inset-0
          h-full w-full
          select-none object-cover
          transition-opacity duration-500

          ${fallbackLoaded &&
                        !canvasReady
                        ? 'opacity-100'
                        : 'opacity-0'
                    }
        `}
            />

            {/*
       * Canvas stays mounted and visible forever
       * after its first valid frame.
       *
       * Theme changes do NOT hide it.
       */}
            <canvas
                ref={canvasRef}
                aria-label="Interactive theme visual"
                className={`
          absolute inset-0
          h-full w-full
          touch-none cursor-none
          transition-opacity duration-300

          ${canvasReady
                        ? 'opacity-100'
                        : 'opacity-0'
                    }
        `}
            />

            {!hasInteracted &&
                canvasReady && (
                    <div
                        className="
              pointer-events-none
              absolute right-6 bottom-6
              text-xs tracking-widest
              text-white/40
            "
                    >
                        drag to reveal
                    </div>
                )}
        </div>
    );
};

export default ThemeVisual;