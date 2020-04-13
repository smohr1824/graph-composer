import { Concept } from './concept';

// this is local to the module as it will be used only to maintain edge
// objects in the editor canvas

export class Edge {
    // unique to the elementary layer during the lifetime of the edit session (not persisted)
    id: number; 
    source: number;
    target: number;
    weight: number;
    labelX: number;
    labelY: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    theta: number;
}

export class Node {
    concept: Concept;
    id: number;
    x: number;
    y: number;
}

