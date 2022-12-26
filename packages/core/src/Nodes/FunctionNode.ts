import { Assert } from '../Diagnostics/Assert';
import { Graph } from '../Graphs/Graph';
import { Socket } from '../Sockets/Socket';
import { Node, NodeConfiguration } from './Node';
import {
  makeFunctionNodeDefinition,
  NodeCategory,
  SocketsDefinition
} from './NodeDefinition';
import { IFunctionNode, INode } from './NodeInstance';
import { NodeDescription } from './Registry/NodeDescription';

export class FunctionNode extends Node implements IFunctionNode {
  constructor(
    description: NodeDescription,
    graph: Graph,
    inputs: Socket[] = [],
    outputs: Socket[] = [],
    public readonly exec: (node: INode) => void,
    configuration: NodeConfiguration = {}
  ) {
    super(description, graph, inputs, outputs, configuration);

    // must have no input flow sockets
    Assert.mustBeTrue(
      !this.inputs.some((socket) => socket.valueTypeName === 'flow')
    );

    // must have no output flow sockets
    Assert.mustBeTrue(
      !this.outputs.some((socket) => socket.valueTypeName === 'flow')
    );
  }

  get category(): NodeCategory.Function {
    return NodeCategory.Function;
  }
}

const alpha = 'abcdefghijklmnop';
const getAlphabeticalKey = (index: number) => alpha[index];

type OrderedSocketsResult = {
  socketKeys: string[];
  sockets: SocketsDefinition;
};
/** Converts list of sockets specifying value type names to an ordeered list of sockets,
 */
const toOrderedSockets = (
  socketValueTypes: string[] | string | undefined = [],
  getKey: (index: number) => string
): OrderedSocketsResult => {
  // const alpha = 'abcdefghijklmnop';

  return [...socketValueTypes].reduce(
    ({ socketKeys, sockets }: OrderedSocketsResult, socketValueType) => {
      const name = getKey(socketKeys.length);
      return {
        socketKeys: [...sockets.socketsKeys, name],
        sockets: {
          ...sockets,
          [name]: socketValueType
        }
      };
    },
    {
      socketKeys: [],
      sockets: {}
    }
  );
};

export function makeInNOutFunctionDesc({
  in: inputValueTypes,
  inputKeys,
  out,
  exec,
  ...rest
}: {
  name: string;
  label: string;
  aliases?: string[];
  in?: string[];
  inputKeys?: string[];
  out: string[] | string;
  exec: (...args: any[]) => any;
}) {
  if (inputKeys) {
    Assert.mustEqual(
      inputKeys.length,
      inputValueTypes?.length || 0,
      'inputKeys length must match inputValueTypes length'
    );
  }

  const getInputFunction = inputKeys
    ? (index: number) => inputKeys[index]
    : getAlphabeticalKey;
  const inputSockets = toOrderedSockets(inputValueTypes, getInputFunction);

  // function to get output socket key - if there is only one output, then use 'result' as the key
  // otherwise use alphtabetical keys
  const outputKeyFunc =
    Array.isArray(out) && out.length > 1 ? () => 'result' : getAlphabeticalKey;
  const outputSockets = toOrderedSockets(out, outputKeyFunc);

  const definition = makeFunctionNodeDefinition({
    typeName: rest.name,
    label: rest.label,
    category: NodeCategory.Function,
    in: inputSockets.sockets,
    out: outputSockets.sockets,
    exec: ({ read, write }) => {
      const args = inputSockets.socketKeys.map((key) => read(key));
      const results = exec(...args);
      if (
        outputSockets.socketKeys.length === 1 &&
        outputSockets.socketKeys[0] === 'result'
      ) {
        write('result', results);
      } else {
        outputSockets.socketKeys.forEach((key) => {
          write(key, results[key]);
        });
      }
    }
  });

  return definition;
}