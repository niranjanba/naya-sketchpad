import React, { useState } from "react";
import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";
import { useGlobalContext } from "../context/sketches";
import { useAuthContext } from "../context/authContext";

function SketchPad() {
    const ref = useRef(null);
    const { saveSketches, sketches, currentSketch, app, container, socket } =
        useGlobalContext();
    const { user } = useAuthContext();
    const [line, setLine] = useState(null);
    let isDrawing = false,
        x = 0,
        y = 0,
        isDrawingPrevLines = false;
    const pts = [];

    /**
     * @desc Initailises the PIXI graphics
     */
    const init = () => {
        setLine(new PIXI.Graphics());
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.ROUND_PIXELS = true;
    };

    /**
     * @desc Check for the previous data and draw it on screen
     */
    const checkPrevData = React.useCallback(function () {
        if (sketches && sketches.length && line) {
            if (currentSketch && currentSketch.lines.length) {
                const prevLines = currentSketch.lines;
                if (prevLines) {
                    for (let prevline of prevLines) {
                        line.lineStyle({
                            width: 3,
                            alpha: 1,
                            join: "round",
                            color: PIXI.utils.string2hex(prevline.color),
                            cap: "round",
                        });
                        const points = prevline.points;
                        if (points) {
                            isDrawingPrevLines = true;
                            for (let i = 3; i < points.length; i += 4) {
                                drawLine(
                                    points[i - 3],
                                    points[i - 2],
                                    points[i - 1],
                                    points[i]
                                );
                            }
                        }
                    }
                }
            }
            isDrawingPrevLines = false;
            line.lineStyle({
                width: 3,
                alpha: 1,
                join: "round",
                color: PIXI.utils.string2hex(user.color),
                cap: "round",
            });
        }
    });

    /**
     * @desc Mouse down eventlistener to initialize x,y co-ordinates
     * @param {e} e
     */
    const mouseDown = (e) => {
        x = e.nativeEvent.offsetX;
        y = e.nativeEvent.offsetY;
        isDrawing = true;
    };

    const mouseMove = (e) => {
        if (isDrawing) {
            drawLine(x, y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            x = e.nativeEvent.offsetX;
            y = e.nativeEvent.offsetY;
        }
    };

    /**
     * @desc Listen to the mouse up and save the line draw to the database
     * @param {e} e
     */
    const mouseUp = (e) => {
        if (isDrawing) {
            drawLine(x, y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
            if (pts.length > 4) {
                const line = {
                    color: user.color,
                    points: [...pts],
                };
                currentSketch.lines.push(line);
                saveSketches(currentSketch.name, line);
                socket.emit("send-new-line", {
                    line,
                    room: currentSketch.name,
                });
            }
            pts.length = 0;
        }
    };

    /**
     * @desc Draw line on the screen
     * @param {Number} x1 - Bigining of line
     * @param {Number} y1 - Bigining of line
     * @param {Number} x2 - End of line
     * @param {Number} y2 - End of line
     */
    function drawLine(x1, y1, x2, y2) {
        line.moveTo(x1, y1);
        line.lineTo(x2, y2);
        container.addChild(line);
        if (!isDrawingPrevLines) {
            pts.push(x1);
            pts.push(y1);
            pts.push(x2);
            pts.push(y2);
        }
    }

    useEffect(() => {
        if (line) {
            line.clear();
        }
        init();
    }, [currentSketch]);

    useEffect(() => {
        if (line && container && app && user.color) {
            line.lineStyle({
                width: 3,
                alpha: 1,
                join: "round",
                color: PIXI.utils.string2hex(user.color),
                cap: "round",
            });
            checkPrevData();
            app.stage.addChild(container);
            ref.current.appendChild(app.view);
            app.start(); //starting app
            app.renderer.resize(
                ref.current.clientWidth,
                ref.current.clientHeight
            );
            window.addEventListener("resize", () => {
                app.renderer.resize(
                    ref.current?.clientWidth,
                    ref.current?.clientHeight
                );
            });

            return () => {
                return app.stop();
            };
        }
    }, [line, container, app, checkPrevData, user]);

    return (
        <div
            className="stage-container"
            onMouseMove={mouseMove}
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            style={{
                width: "80vw",
                height: "80vh",
                cursor: new URL(
                    "https://cur.cursors-4u.net/others/oth-7/oth697.cur"
                ),
            }}
            onMouseOut={() => (isDrawing = false)}
            ref={ref}
        />
    );
}

export default SketchPad;
