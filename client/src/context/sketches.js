import axios from "axios";
import * as PIXI from "pixi.js";

import io from "socket.io-client";

export const socket = io("http://localhost:4001");
socket.on("connect", () => {
    console.log("connected", socket.id);
});

const {
    useContext,
    createContext,
    useState,
    useEffect,
    useRef,
    useCallback,
} = require("react");

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [sketches, setSketches] = useState([]);
    const [sketchNames, setSketchNames] = useState([]);
    const [currentSketch, setCurrentSketch] = useState(null);
    const [container, setContainer] = useState(null);
    const [app, setApp] = useState(null);

    const containers = useRef({}); //to store all the container(sketchs)

    /**
     * @desc Initialize pixi app
     */
    function initializePIXIApp() {
        const _app = new PIXI.Application({
            transparent: true,
            antialias: true,
            autoDensity: true,
            resolution: window.devicePixelRatio,
        });
        _app.renderer.backgroundColor = 0xffffff;
        _app.renderer.plugins.interaction.cursorStyles.default =
            "url('https://cur.cursors-4u.net/others/oth-7/oth697.cur'), auto";
        _app.stage.interactive = true;
        setApp(_app);
    }

    /**
     * Save sketch data to database
     * @param {String} name
     * @param {Object} sketchData
     */
    const saveSketches = async (name, sketchData) => {
        await axios.post("sketches", { name, sketchData });
        getSketchNames();
    };

    /**
     * @desc Gets existing sketchpad and stores them in state
     * @param {String} name - Name of a Sketchpad
     */
    const getSketch = useCallback(
        async (name) => {
            const {
                data: { data: sketch },
            } = await axios.get(`sketches?name=${name}`);
            if (sketch && Object.keys(sketch).length) {
                setCurrentSketch({ ...sketch });
                createNewContainer(sketch.name);
                const existingSketchIdx = sketches.findIndex(
                    (sketch) => sketch.name === name
                );
                if (existingSketchIdx >= 0) {
                    sketches[existingSketchIdx] = sketch;
                    setSketches(sketches);
                } else {
                    setSketches([...sketches, sketch]);
                }
                joinCrntSketchRoom(sketch.name);
            } else {
                createNewSketch();
            }
            return sketch;
        },
        [sketches, createNewSketch]
    );

    /**
     * @desc Get all the Sketchpad names
     */
    const getSketchNames = async () => {
        const { data } = await axios.get("sketches?onlynames=true");
        setSketchNames(data.data);
    };

    /**
     * @desc Create new sketch
     */
    function createNewSketch() {
        const newSketch = {
            name: `sketch-${sketches.length + 1}`,
            users: [],
            lines: [],
        };
        setCurrentSketch({ ...newSketch });
        setSketches([...sketches, newSketch]);
        createNewContainer(newSketch.name);
        setContainer(containers.current[newSketch.name]);
        saveSketches(newSketch.name, newSketch);
        if (Object.keys(containers.current).length > 1)
            switchContainer(newSketch.name, true);
        socket.emit("send-new-sketch", newSketch);
        joinCrntSketchRoom(newSketch.name);
    }

    /**
     * @desc Create New Container and store it containers obj
     * @param {String} name
     */
    function createNewContainer(name) {
        const _container = new PIXI.Container();
        _container.name = name;
        containers.current[name] = _container;
        setContainer(_container);
    }

    /**
     * @decs Switch Container(sketchpad)
     * @param {String} cntrName
     */
    async function switchContainer(cntrName, isNew = false) {
        if (!isNew) {
            const sketch = await getSketch(cntrName);
            joinCrntSketchRoom(sketch.name, currentSketch.name);
            setCurrentSketch(sketch);
        }
        container.visible = false;
        containers.current[cntrName].visible = true;
        setContainer(containers.current[cntrName]);
    }

    function joinCrntSketchRoom(name, name2) {
        socket.emit("join-sketch", { toSketch: name, fromSketch: name2 });
    }

    useEffect(() => {
        getSketch("sketch-1");
        getSketchNames();
        initializePIXIApp();
    }, []);

    useEffect(() => {
        if (socket && sketchNames && sketches)
            socket.on("receive-new-sketch", (sketch) => {
                const isExisitingSketch = sketches.find(
                    (sk) => sk.name === sketch.name
                );
                if (!isExisitingSketch) {
                    setSketches([...sketches, sketch]);
                    setSketchNames([...sketchNames, { name: sketch.name }]);
                }
            });
    }, [sketchNames, sketches]);
    useEffect(() => {
        if (container) {
            socket.on("receive-new-line", (_line) => {
                const points = _line.points;
                const line = new PIXI.Graphics();
                line.lineStyle({
                    width: 3,
                    alpha: 1,
                    join: "round",
                    color: PIXI.utils.string2hex(_line.color),
                    cap: "round",
                });
                container.addChild(line);
                for (let i = 3; i < points.length; i += 4) {
                    line.moveTo(points[i - 3], points[i - 2]);
                    line.lineTo(points[i - 1], points[i]);
                }
            });
        }
    }, [container]);
    return (
        <AppContext.Provider
            value={{
                saveSketches,
                currentSketch,
                setCurrentSketch,
                sketches,
                setSketches,
                app,
                container,
                createNewContainer,
                switchContainer,
                createNewSketch,
                sketchNames,
                socket,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
export const useGlobalContext = () => useContext(AppContext);
export default AppProvider;
