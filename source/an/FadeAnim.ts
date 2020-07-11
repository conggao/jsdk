/**
 * @project JSDK 
 * @license MIT
 * @website https://github.com/fengboyue/jsdk
 * 
 * @version 2.1.0
 * @author Frank.Feng
 */
module JS {

    export namespace an {

        /**
         * The range is 0.0 ~ 1.0
         */
        export type FadeKeyFrame = number;
        export type FadeKeyFrames = JsonObject<FadeKeyFrame>;

        export class FadeAnimConfig extends ElementAnimConfig {
            frames: FadeKeyFrames
        }

        /**
         * Opacity fade Animation.<br>
         * Fade a element's opacity from number1 to number2.
         */
        export class FadeAnim extends ElementAnim {
            private _o:string;

            constructor(cfg: FadeAnimConfig) {
                super(cfg)
            }

            public config<T extends ElementAnimConfig>(): T
            public config<T extends ElementAnimConfig>(cfg: T): this
            public config(cfg?: ElementAnimConfig): any {
                if (!cfg) return this._cfg;

                let m = super.config(cfg);
                if(this._el) this._o = this._el.computedStyle().opacity||'1';
                
                return m
            }

            protected _onUpdate(f: FadeKeyFrame) {
                this._el.style.opacity = f+'';
            }

            protected _resetInitial(){
                this._el.style.opacity = this._o;
            }
        }
    }
}
import FadeKeyFrame = JS.an.FadeKeyFrame;
import FadeKeyFrames = JS.an.FadeKeyFrames;
import FadeAnimConfig = JS.an.FadeAnimConfig;
import FadeAnim = JS.an.FadeAnim;