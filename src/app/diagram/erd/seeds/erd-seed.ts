import { ConceptualErd, ERDiagramType } from "../models/erd-model";

const mockDiagram: ConceptualErd = {
    type: "ConceptualErd",
    id: "diagram1",
    /** placeholder for easier write operations later */
    accountID: "acc1",
    projectID: "proj1",
    diagramType: ERDiagramType.conceptual,
    name: "erdName",
    entities: [
        {
            type: "Entity",
            id: "11wononeracehorse",

            name: "Drug",
            /// Could use a map type for efficient index evaluation?
            attributes: [
                {
                    type: "Attribute",
                    id: "att1000",
                    attributeName: "drugName",
                    isOptional: false,
                    isPartOfPrimaryKey: false,
                    isUnique: false,
                    x: 1,
                    y: 1,
                },
            ],
            x: 1,
            y: 1,
        },
        {
            type: "Entity",
            id: "22twowononetoo",

            name: "Item",
            /// Could use a map type for efficient index evaluation?
            attributes: [
                {
                    type: "Attribute",
                    id: "att1001",
                    attributeName: "itemName",
                    isOptional: false,
                    isPartOfPrimaryKey: false,
                    isUnique: false,
                    x: 1,
                    y: 1,
                },
            ],
            x: 1,
            y: 1,
        },
    ],
    relationships: [
        {
            type: "Relationship",
            firstEntityID: "11wononeracehose",
            secondEntityID: "22wononetoo",
            relationshipName: "is quantified as",
            x: 1,
            y: 1,
        },
    ],
    createdAt: 1619130189000,
    updatedAt: 1619130191000,
};
