import { Shape } from "./shape";
import {chainObjects} from "../../util/object";
import {pixelSnap, PixelSnapBias} from "../../canvas/canvas";

export class Line extends Shape {
    protected static defaultStyles = chainObjects(Shape.defaultStyles, {
        strokeStyle: 'black'
    });

    constructor(coords: [number, number, number, number]) {
        super();

        this._x1 = coords[0];
        this._y1 = coords[1];

        this._x2 = coords[2];
        this._y2 = coords[3];

        this.strokeStyle = Line.defaultStyles.strokeStyle;
    }

    private _x1: number;
    set x1(value: number) {
        if (this._x1 !== value) {
            this._x1 = value;
            this.dirty = true;
        }
    }
    get x1(): number {
        // TODO: Investigate getter performance further in the context
        //       of the scene graph.
        //       In isolated benchmarks using a getter has the same
        //       performance as a direct property access in Firefox 64.
        //       But in Chrome 71 the getter is 60% slower than direct access.
        //       Direct read is 4.5+ times slower in Chrome than it is in Firefox.
        //       Property access and direct read have the same performance
        //       in Safari 12, which is 2+ times faster than Firefox at this.
        // https://jsperf.com/es5-getters-setters-versus-getter-setter-methods/18
        // This is a know Chrome issue. They say it's not a regression, since
        // the behavior is observed since M60, but jsperf.com history shows the
        // 10x slowdown happened between Chrome 48 and Chrome 57.
        // https://bugs.chromium.org/p/chromium/issues/detail?id=908743
        return this._x1;
    }

    private _y1: number;
    set y1(value: number) {
        if (this._y1 !== value) {
            this._y1 = value;
            this.dirty = true;
        }
    }
    get y1(): number {
        return this._y1;
    }

    private _x2: number;
    set x2(value: number) {
        if (this._x2 !== value) {
            this._x2 = value;
            this.dirty = true;
        }
    }
    get x2(): number {
        return this._x2;
    }

    private _y2: number;
    set y2(value: number) {
        if (this._y2 !== value) {
            this._y2 = value;
            this.dirty = true;
        }
    }
    get y2(): number {
        return this._y2;
    }

    private _pixelSnapBias = PixelSnapBias.Positive;
    set pixelSnapBias(value: PixelSnapBias) {
        if (this._pixelSnapBias !== value) {
            this._pixelSnapBias = value;
            this.dirty = true;
        }
    }
    get pixelSnapBias(): PixelSnapBias {
        return this._pixelSnapBias;
    }

    isPointInPath(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
        return false;
    }

    isPointInStroke(ctx: CanvasRenderingContext2D, x: number, y: number): boolean {
        return false;
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.scene) {
            return;
        }

        if (this.dirtyTransform) {
            this.computeTransformMatrix();
        }
        this.matrix.toContext(ctx);

        this.applyContextAttributes(ctx);

        let x1 = this.x1;
        let y1 = this.y1;
        let x2 = this.x2;
        let y2 = this.y2;

        // Align to the pixel grid if the line is strictly vertical
        // or horizontal (but not both, i.e. a dot).
        if (x1 === x2) {
            const delta = pixelSnap(this.lineWidth, this.pixelSnapBias);
            x1 += delta;
            x2 += delta;
        }
        else if (y1 === y2) {
            const delta = pixelSnap(this.lineWidth, this.pixelSnapBias);
            y1 += delta;
            y2 += delta;
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (this.strokeStyle) {
            ctx.stroke();
        }

        this.dirty = false;
    }
}