import { NextRequest, NextResponse } from 'next/server';
import stationData from '@/app/lib/data/metroStations.json';
import connectionData from '@/app/lib/data/metroBetweenStationsTime.json';
import intersectionData from '@/app/lib/data/metroIntersectionTime.json';

export const dynamic = 'force-dynamic';

type Station = {
  id: string;
  id_line: string;
  name_station: string;
};

type Connection = {
  id_st1: string;
  id_st2: string;
  time: string;
};

type Intersection = {
  id1: string;
  id2: string;
  time: string;
};

type Graph = {
  [key: string]: {
    [key: string]: number;
  };
};

// Function to build the graph
const buildGraph = async (): Promise<Graph | undefined> => {
  try {
    const graph: Graph = {};

    // Add stations to the graph
    stationData.forEach((station: Station) => {
      const key = `${station.id}_${station.id_line}`;
      graph[key] = {};
    });

    // Add connections between stations
    connectionData.forEach((connection: Connection) => {
      const key1 = `${connection.id_st1}_${stationData.find(s => s.id === connection.id_st1)?.id_line}`;
      const key2 = `${connection.id_st2}_${stationData.find(s => s.id === connection.id_st2)?.id_line}`;
      const time = parseFloat(connection.time.replace(',', '.'));
      if (key1 && key2) {
        graph[key1][key2] = time;
        graph[key2][key1] = time;
      }
    });

    // Add interchange times
    intersectionData.forEach((intersection: Intersection) => {
      const key1 = `${intersection.id1}_${stationData.find(s => s.id === intersection.id1)?.id_line}`;
      const key2 = `${intersection.id2}_${stationData.find(s => s.id === intersection.id2)?.id_line}`;
      const time = parseFloat(intersection.time);
      if (key1 && key2) {
        graph[key1][key2] = time;
        graph[key2][key1] = time;
      }
    });

    return graph;
  } catch (err) {
    console.error('Error building graph:', err);
    return undefined;
  }
};

// API Route to build the graph and return it
export async function GET(request: NextRequest) {
  try {
    const graph = await buildGraph();
    if (graph) {
      return NextResponse.json({ message: 'Graph built successfully', graph }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Failed to build graph' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error building graph:', error);
    return NextResponse.json({ message: 'Error building graph', error: (error as Error).message }, { status: 500 });
  }
}