enum BehaviorTypes {
    Eval,
    Number,
    Vector3,
    Boolean,
    String
};

class BehaviorPortDefinition {

    constructor(
        public type: BehaviorTypes,
        public name: string
    ) {
    }

}

class NamedValue {

    constructor(
        public name: string,
        public value: any 
    ) {
    }

}

type NamedValueMap = Map<string,any>;

// structure for defining BehaviorNodes
class BehaviorNodeDefinition {

    constructor(
        public type: string,
        public name: string,
        public inputDefinitions: Array<any>,
        public outputDefinitions: Array<any>,
        public func: function(any, NamedValueMap): NamedValueMap
    ) {
    }

}

const BehaviorNodeDefinitions = [

    // TRIGGERS

    new BehaviorNodeDefinition(
        'trigger',
        'sceneStart',
        [],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        (context, inputs) => {
            return new Map<string,any>().set( 'eval', true );
        }
    ),

    new BehaviorNodeDefinition(
        'trigger',
        'tick',
        [],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        (context, inputValues) => {
            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;
        }
    ),

    new BehaviorNodeDefinition(
        'trigger',
        'nodeClick',
        [],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.Number, 'nodeIndex')],
        (context, inputValues) => {
            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            outputValues.set( 'nodeIndex', -1 );
            return outputValues;
        }
    ),

    // LOGIC - multiple eval outputs

    new BehaviorNodeDefinition(
        'logic',
        'if',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.Boolean, 'condition')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'true'), new BehaviorPortDefinition(BehaviorTypes.Eval, 'false')],
        (context, inputValues) => {
            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;

            return inputValues['condition'].value ? { true: true } : { false: true };

        }
    ),

    // ASYNC - asynchronous evaluation

    new BehaviorNodeDefinition(
        'logic',
        'sleep',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.Number, 'milliseconds')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        (context, inputValues) => {
            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;

             // TODO: return a promise that results with an async delay
            return { eval: true };

        }
    ),

    new BehaviorNodeDefinition(
        'logic',
        'sequence',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, '1'), new BehaviorPortDefinition(BehaviorTypes.Eval, '2'), new BehaviorPortDefinition(BehaviorTypes.Eval, '2')],
        (context, inputs) => {

            // TODO: Figure out how to have multiple evals fire one after another.
            return {};

        }
    ),

    new BehaviorNodeDefinition(
        'logic',
        'for',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.Number, 'startIndex'), new BehaviorPortDefinition(BehaviorTypes.Number, 'count')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'loop'), new BehaviorPortDefinition(BehaviorTypes.Number, 'index'), new BehaviorPortDefinition(BehaviorTypes.Eval, 'complete')],
        (context, inputs) => {

            // TODO: Figure out how to have multiple multiple "loop" evals each with an index
            // and then, once done, eval "complete"
            return {};

        }
    ),

    // MATH - note, no evals.

    new BehaviorNodeDefinition(
        'math',
        'random',
        [],
        [new BehaviorPortDefinition(BehaviorTypes.Number, 'sample')],
        (context, inputValues) => {

            return { sample: Math.random() };

        }
    ),
    new BehaviorNodeDefinition(
        'math',
        'add',
        [new BehaviorPortDefinition(BehaviorTypes.Number, 'a'), new BehaviorPortDefinition(BehaviorTypes.Number, 'b')],
        [new BehaviorPortDefinition(BehaviorTypes.Number, 'sum')],
        (context, inputValues) => {
            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;

            return { sum: (inputValues['a'] + inputValues['b']) };

        }
    ),

    // ACTIONS

    new BehaviorNodeDefinition(
        'action',
        'debugOutput',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.String, 'text')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        (context, inputValues) => {

            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;

            console.log('Debug Output: ' + inputs['text']);
            return { eval: true };
        }
    ),
    new BehaviorNodeDefinition(
        'action',
        'show',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.Number, 'nodeIndex')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        (context, inputValues) => {

            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;
           //const node = context.getSceneNodeByIndex(inputs['node']);
            //node.visible = false;
            return { eval: true };

        }
    ),
    new BehaviorNodeDefinition(
        'action',
        'hide',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.Number, 'nodeIndex')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        (context, inputValues) => {

            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;
           //const node = context.getSceneNodeByIndex(inputs['node']);
            //node.visible = true;
            return { eval: true };

        }
    ),
    new BehaviorNodeDefinition(
        'action',
        'translate',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.Number, 'nodeIndex'), new BehaviorPortDefinition(BehaviorTypes.Vector3, 'offset')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        (context, inputValues) => {

            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;
           //const node = context.getSceneNodeByIndex(inputs['node']);
            //node.translation.add(inputs['offset']);
            return { eval: true };

        }
    ),
    new BehaviorNodeDefinition(
        'action',
        'rotation',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.Number, 'nodeIndex'), new BehaviorPortDefinition(BehaviorTypes.Vector3, 'delta')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        (context, inputValues) => {

            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;
           //const node = context.getSceneNodeByIndex(inputs['node']);
            //node.rotation.add(inputs['eulerDelta']);
            return { eval: true };

        }
    ),
    new BehaviorNodeDefinition(
        'action',
        'scale',
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval'), new BehaviorPortDefinition(BehaviorTypes.Number, 'nodeIndex'), new BehaviorPortDefinition(BehaviorTypes.Vector3, 'factor')],
        [new BehaviorPortDefinition(BehaviorTypes.Eval, 'eval')],
        (context, inputValues) => {

            const outputValues = new Map<string,any>();
            outputValues.set( 'eval', true );
            return outputValues;
           //const node = context.getSceneNodeByIndex(inputs['node']);
            //node.scale.multiplyByVector(inputs['factor']);
            return { eval: true };

        }
    ),
];

// sort in alphabetical order
BehaviorNodeDefinitions.sort((a, b) => (a.type.localeCompare(b.type)));


class BehaviorNodeInput {

    constructor( 
        public definition: BehaviorPortDefinition,
        public nodeIndex: number | undefined,
        public outputName: string | undefined,
        public value: any | undefined,
    ) {
    }

}

class BehaviorNodeOutput {

    constructor(
        public definition: BehaviorPortDefinition
    ) {
    }

}

class BehaviorNode {

    public outputs: Map<string,BehaviorNodeOutput>;

    constructor(
        public index: number,
        public definition: BehaviorNodeDefinition,
        public inputs: { [key:string]: BehaviorNodeInput }) {

        this.outputs = {};
        this.definition.outputDefinitions.forEach((outputDefinition) => {
            this.outputs[outputDefinition.name] = new BehaviorNodeOutput( outputDefinition );
        });
    }
}
class BehaviorContext {

    constructor() {
    }

    log(text: string) {
        console.log(text);
    }

}

class Behavior {

    public name: string = "";
    public nodes: BehaviorNode[] = [];
    public workQueue: BehaviorNode[] = [];

    constructor() {
    }

    trigger(triggerName: string): number {

        // look up any nodes with this trigger name and add them to the executionQueue
        const triggerNodes = this.nodes.filter((item) => (item.definition.type === triggerName));

        if (triggerNodes.length > 0) {
            // add to the back of the queue
            this.workQueue.push(...triggerNodes);
        }

        // inform how many trigger nodes were triggered
        return triggerNodes.length;

    }

    prioritizeNode(node: BehaviorNode) {

        // remove from the queue if it is exists
        this.workQueue = this.workQueue.filter((item) => (item !== node));

        // add to front of queue
        this.workQueue.unshift(node);

    }

    // resolve non-execution inputs so that each has a value stored in them.  Then and only then we can execute the node's function.
    resolveInputs(node: BehaviorNode) {

        let unresolvedInputs = 0;

        node.inputs.forEach((inputName: string, index: number) => {

            const inputDefinition = node.definition.inputDefinitions.find((item) => { item.name === inputName });
            const input = node.inputs[inputName];

            // no need to resolve execution inputs.
            if (inputDefinition.type === BehaviorTypes.Eval) {
                continue;
            }

            // if the input has a value, it is resolved
            if (input.value !== undefined) {
                continue;
            }

            // otherwise follow uplinks...
            if (input.type === 'uplink') {:
                var sourceNode = this.nodes[input.nodeIndex];
                this.prioritizeNode(sourceNode);
                unresolvedInputs++;
            }

        });

        return unresolvedInputs;

    }

    // returns the number of new execution steps created as a result of this one step
    executeStep() {

        // no work waiting!
        if (this.workQeueue.length === 0) {
            return 0;
        }

        // look at the next item in the queue
        const peekNextItem = this.workQueue[0];

        // resolve inputs if they are not.  If all are resolved, function returns 0, and we can execute it.
        if (this.resolveInputs(peekNextItem) > 0) {

            return this.executeStep();

        }

        // pop off item
        const nextItem = this.workQueue.shift();
        if (peekNextItem !== nextItem) {
            throw new Error('should not happen');
        }

        // collect all inputs, while clearing their values.
        // TODO: could this be replaced by a map?
        let inputValues = {};
        node.inputs.forEach((inputName, index) => {

            const input = node.inputs[inputName];

            if (input.value !== undefined) {

                inputValues[input.name] = input.value;
                delete input.value;

            }

        });

        console.log('inputs: ', inputValues);
        console.log(`type: ${nextItem.definition.type}`);

        // this is where the promise would be;
        const outputs = nextItem.definition.func(inputValues);

        console.log('outputs: ', outputs);

        // push results to the inputs of downstream nodes.
        // TODO: ensure all non-eval outputs have values.  Otherwise throw an error.
        outputs.forEach((output, outputIndex) => {

            if (output.downlinks !== undefined) {

                output.downlinks.forEach((downLinks) => {

                    var downlinkNode = this.nodes[downlinks.nodeIndex];

                    if (output.value !== undefined) {

                        downlinkNode.inputs[downlinkNode.inputName].value = output.value;

                    }
                    else {

                        if (nextItem.definition.outputs[output.name] !== BehaviorTypes.Eval) {

                            throw new Error("outputs without values must be execution");

                        }

                        this.workQueue.push(downlinkNode);
                    }

                });

            }

        });

        return 1;
    }

    executeSteps(maximumSteps: number): number {
        let stepsExecuted = 0;
        while ((maximumSteps - stepsExecuted) > 0) {
            if (this.executeStep() === 0) break;
            stepsExecuted++;
        }
        return stepsExecuted;
    }

}

class BehaviorParser {

    constructor() {

        this.behavior = new Behavior();

    }

    parse(json) {

        const nodesJson = json;

        // create new BehaviorNode instances for each node in the json.
        for (let i = 0; i < nodesJson.length; i++) {

            const nodeJson = nodesJson[i];
            const nodeType = nodeJson['type'];
            const definitions = BehaviorNodeDefinitions.filter((item) => (item.type === nodeType));

            if (definitions.length <= 0) {

                throw new Error(`Can not find Behavior Node Definition for ${nodeType}`);

            }
            if (definitions.length > 1) {

                throw new Error(`Too many matching Behavior Node Definition for ${nodeType}`);

            }

            this.behavior.nodes.push(new BehaviorNode(i, definitions[0], nodeJson['inputs']);

        }

        // connect up the graph edges from BehaviorNode inputs to outputs.  This is required to follow execution
        this.behavior.nodes.forEach((node) => {
            // initialize the inputs by resolving to the reference nodes.
            node.inputs.forEach((inputName, index) => {
                const input = node.inputs[inputName];

                if (input['type'] === 'link') {
                    const uplinkNode = this.behavior.nodes[input['node']];
                    const uplinkOutput = uplink.outputs[input['output']];
                    if (!uplinkOutput.downlinks) {
                        uplinkOutput.downlinks = [];
                    }
                    uplinkOutput.downlinks.push({ node: value['node'], input: input.name })
                }
            });

        })
    }

}

const behaviorExample = [
    {
        'type': 'trigger/sceneStart'
    },
    {
        'type': 'action/debugOutput',
        'inputs': {
            'eval': { 'type': 'uplink', 'nodeIndex': 0, 'outputName': 'execute' },
            'text': { 'type': 'constant', 'value': 'Hello World!' }
        }
    }
];

const behaviorExample2 = [
    {
        'type': 'trigger/sceneStart'
    },
    {
        'type': 'action/setter',
        'inputs': {
            'eval': { 'type': 'uplink', 'nodeIndex': 0, 'outputName': 'execute' },
            'jsonPointer': { 'type': 'constant', 'value': '/node/0/translation' },
            'value': { 'type': 'constant', 'value': [3.0, 1.0, 1.0] }
        }
    }
];


class BehaviorTest {

    constructor() {
        this.parser = new BehaviorParser();
        this.behavior = parser.behavior;
    }

    load(json) {
        parser.parse(json);
    }

    init() {
        behavior.trigger("trigger/sceneStart");
    }

    tick() {
        behavior.trigger("trigger/tick");
    }

    executeSteps(maximumSteps) {
        this.behavior.executeSteps(maximumSteps);
    }

}

export { ... };

