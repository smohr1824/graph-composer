export interface MultilayerCognitiveConceptState
{
    name: string;
    generation: number;
    aggregate: number;

    levels: ILayerActivationLevel[];
}

export interface ILayerActivationLevel
{
    coordinates: string;
    level: number;
}