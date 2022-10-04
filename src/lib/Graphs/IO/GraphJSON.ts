import { Metadata } from '../../Metadata';

export type LinkJSON = { nodeId: string; socket: string };

export type InputJSON = {
  value?: string;
  links?: LinkJSON[];
};

export type NodeJSON = {
  label?: string;
  type: string;
  id: string;

  // old style.
  inputs?: {
    [key: string]: InputJSON;
  };
  parameters?: {
    [key: string]: InputJSON;
  };
  flows?: {
    [key: string]: LinkJSON;
  };
  metadata?: Metadata;
};

export type VariableJSON = {
  label?: string;
  id: string;
  name: string;
  valueTypeName: string;
  initialValue: string;
  metadata?: Metadata;
};

export type CustomEventJSON = {
  label?: string;
  id: string;
  name: string;
  metadata?: Metadata;
};

export type GraphJSON = {
  name?: string;
  nodes: NodeJSON[];
  variables: VariableJSON[];
  customEvents: CustomEventJSON[];
  metadata?: Metadata;
};
