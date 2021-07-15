import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';

type DragBoxProp = {
    width: number,
    height: number,
    initX: number,
    initY: number
}

const DragBox = ({ width, height, initX, initY }: DragBoxProp) => {
    const [x, setX] = useState(initX);
    const [y, setY] = useState(initY);
    const isDrg = useRef(false);
    const ox = useRef(0);
    const oy = useRef(0);
    useEffect(() => {
        setX(initX);
        setY(initY);
    }, [initX, initY]);
    const onMove = useCallback((e: any) => {
        if (!isDrg.current) return;
        let bd = e.target.ownerDocument.scrollingElement;
        const px = e.clientX + bd.scrollLeft - ox.current;
        const py = e.clientY + bd.scrollTop - oy.current;
        setX(px);
        setY(py);
    }, [setX, setY]);
    const _onUp = useCallback(async (e: any) => {
        ox.current = 0;
        oy.current = 0;
        isDrg.current = false;
        let el = e.target.ownerDocument;
        el.removeEventListener('mousemove', onMove, { capture: true });
        el.removeEventListener('mouseup', _onUp, { capture: true });
    }, [onMove, x, y]);
    const _onDown = useCallback(async (e: any) => {
        ox.current = e.nativeEvent.offsetX;
        oy.current = e.nativeEvent.offsetY;
        isDrg.current = true;
        let el = e.target.ownerDocument;
        el.addEventListener('mouseup', _onUp, { capture: true });
        el.addEventListener('mousemove', onMove, { capture: true });
    }, [_onUp, onMove, x, y]);
    return (
        <div onMouseUp={_onUp} onMouseDown={_onDown} style={{ width: width, height: height, background: "red", position: 'absolute', left: x, top: y, }} />
    );
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <DragBox initX={100} initY={100} width={100} height={100} />
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
