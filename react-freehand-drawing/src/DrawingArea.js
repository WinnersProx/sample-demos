
import * as React from 'react'
import { getStroke } from 'perfect-freehand';

const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";

    const strokePoints = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
        },
        ["M", ...stroke[0], "Q"]
    );
    strokePoints.push("Z");

    return strokePoints.join(" ");
}

const getAdjustedPoints = (e) => {
    const parent = e.target.parentElement;

    return {
        x: e.pageX - parent.offsetLeft,
        y: e.pageY - parent.offsetTop,
        pressure: e.pressure
    };
}

const FreeHandDrawing = () => {
    const [points, setPoints] = React.useState([]);
    const [ currentPointsId, setCurrentPointsId ] = React.useState(0);

    const getDynamicStroke = points => (
        getStroke(points, { size: 6 })
    );

    const pathsData = React.useMemo(() => (
        Object.entries(points).map(([_, points]) => getSvgPathFromStroke(
            getDynamicStroke(points))
        )
    ), [points]);

    const handlePointerDown = (e) => {
        const { x, y, pressure } = getAdjustedPoints(e);

        if(!isNaN(x) && !isNaN(y)) {
            const currentpointsId = +(new Date());
            setCurrentPointsId(currentpointsId);
            e.target.setPointerCapture(e.pointerId);
            setPoints({
                ...points,
                [currentpointsId]: [ [x, y, pressure] ]
            });
        }
    }

    const handlePointerMove = (e) => {
        const { x, y, pressure } = getAdjustedPoints(e);
        if(e.buttons !== 1 || isNaN(x) || isNaN(y)) return;

        setPoints({
            ...points,
            [currentPointsId]: [ ...points[currentPointsId], [x, y, pressure] ]
        });
    }

    return (
        <svg
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            style={{ touchAction: 'none', width: '100%', height: '100%' }}
            >
            {pathsData && pathsData.map((pathData, key) => (
                <g key={key}><path d={pathData} /></g>
            ))}
        </svg>
    )

}

export default function DrawingArea () {

    return (
        <div className='free-hand-zone' style={{ width: '100%', height: '100%'}}>
            <FreeHandDrawing />
        </div>
    );
}
