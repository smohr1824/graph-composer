import { Concept } from '../shared/concept';

// this is local to the module as it will be used only to maintain edge
// objects in the editor canvas

export class Edge {
    // unique to the elementary layer during the lifetime of the edit session (not persisted)
    id: number; 
    source: string;
    target: string;
    weight: number;
    srcX: number;
    srcY: number;
    tgtX: number;
    tgtY: number;
}

export class Node {
    concept: Concept;
    id: number;
    x: number;
    y: number;
}

