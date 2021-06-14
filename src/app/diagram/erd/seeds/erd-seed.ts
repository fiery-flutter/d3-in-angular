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
      id: "11onewononeracehorsedrug",

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
          isDerivedCalculated: false,
          x: 1,
          y: 1,
        },
      ],
      x: 1,
      y: 1,
    },
    {
      type: "Entity",
      id: "22twowononetooitem",

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
          isDerivedCalculated: false,
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
      // Entity names are guaranteed unique anyway...
      // Should not have name clashes for entities or table names in a database or model...
      firstEntityID: "11onewononeracehorsedrug",
      secondEntityID: "22twowononetooitem",
      relationshipName: "is quantified as",
      firstLinkCardinality: "one",

      // Evaluation of participation relates to when read from the other entity to this one
      // i.e. For the second entity, can the first entity be optional unlinked?
      // Depending on order of events
      // Drug is not required for an item (item can be other components)
      firstLinkParticipation: "optional",
      firstLinkisWeak: false,

      // Formally speaking, drug can be related to multiple items through the ingredient model
      // That we do not represent here
      secondLinkCardinality: "many",
      secondLinkParticipation: "optional",
      secondLinkIsWeak: false,

      x: 1,
      y: 1,
    },
  ],
  createdAt: 1619130189000,
  updatedAt: 1619130191000,
};
