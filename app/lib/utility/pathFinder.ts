import metroGraph from '@/app/lib/data/metroGraph.json';
import metroStations from '@/app/lib/data/metroStations.json';
import rawMetroIntersectionTime  from '@/app/lib/data/metroIntersectionTime.json';

export const dynamic = 'force-dynamic';

type GraphType = {
    [key: string]: {
        [key: string]: number;
    };
};

type StationType = {
    id: string;
    id_line: string;
    name_station: string;
};

type TransferTimeType = {
    id1: string;
    id2: string;
    time: number;
};

const metroIntersectionTime: TransferTimeType[] = rawMetroIntersectionTime.map((item: { id1: string, id2: string, time: string }) => ({
    id1: item.id1,
    id2: item.id2,
    time: parseFloat(item.time)
}));

const graph: GraphType = metroGraph;
const stationData: StationType[] = metroStations;
const transferTimes: TransferTimeType[] = metroIntersectionTime;

const findShortestPath = (start: string, end: string) => {
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const queue: string[] = Object.keys(graph);

    // Initialize distances and queue
    for (let node of queue) {
        distances[node] = node === start ? 0 : Infinity;
        previous[node] = null;
    }

    while (queue.length) {
        queue.sort((a, b) => distances[a] - distances[b]);
        const smallest = queue.shift();

        if (smallest === end) {
            let path: string[] = [];
            let current: string | null = smallest;
            while (current) {
                path.push(current);
                current = previous[current];
            }
            path.reverse();
            return { distance: distances[smallest], path };
        }

        if (!smallest || distances[smallest] === Infinity) {
            break;
        }

        for (let neighbor in graph[smallest]) {
            let alt = distances[smallest] + graph[smallest][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = smallest;
            }
        }
    }

    return { distance: distances[end], path: [] };
};

const decodePath = (path: string[]) => {
    return path.map(key => {
        const [id, line] = key.split('_');
        const station = stationData.find(station => station.id === id && station.id_line === line);
        return station ? `${station.name_station} (Line ${line})` : `Station ID ${id} on Line ${line}`;
    });
};

const getTransfers = (path: string[]) => {
    const transfers: any[] = [];

    for (let i = 1; i < path.length; i++) {
        const [prevStationId, prevLine] = path[i - 1].split('_');
        const [currentStationId, currentLine] = path[i].split('_');
        if (prevLine !== currentLine) {
            const transferTime = transferTimes.find(t => (t.id1 === prevStationId && t.id2 === currentStationId) || (t.id1 === currentStationId && t.id2 === prevStationId));
            const transferTimeValue = transferTime ? transferTime.time : 0;
            const prevStation = stationData.find(station => station.id === prevStationId && station.id_line === prevLine);
            const currentStation = stationData.find(station => station.id === currentStationId && station.id_line === currentLine);
            transfers.push({
                transfer_start: `Line ${prevLine}`,
                transfer_end: `Line ${currentLine}`,
                transfer_station_start: prevStation ? prevStation.name_station : `Station ID ${prevStationId}`,
                transfer_station_end: currentStation ? currentStation.name_station : `Station ID ${currentStationId}`,
                transfer_station_start_id: prevStationId,
                transfer_station_end_id: currentStationId,
                transfer_time: transferTimeValue
            });
        }
    }
    return transfers;
};

export const findAndDecodePath = async (start: string, end: string) => {
    const result = findShortestPath(start, end);
    const decodedPath = decodePath(result.path);
    const transfers = getTransfers(result.path);
    // console.log('transfers', transfers)
    return {
        shortestPath: parseFloat(result.distance.toFixed(1)),
        path: decodedPath.join(' -> '),
        transfers
    };
};