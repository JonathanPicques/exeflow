<script lang="ts">
    import {getGraphContext} from '$lib/graph/data';
    import type {ActionExecStep} from '$lib/plugins/@action';
    import type {ActionNode, TriggerNode} from '$lib/graph/nodes';

    const {findAction, findNextActionNode} = getGraphContext();

    let {node}: {node: TriggerNode} = $props();

    let logs = $state([] as {node: ActionNode; step: ActionExecStep}[]);
    let dialog: HTMLDialogElement;

    const run = async () => {
        const runAction = async function* (node: ActionNode): AsyncGenerator<{node: ActionNode; step: ActionExecStep}> {
            const action = findAction(node.data.id);
            const generator = action.exec({config: node.data.data.config});

            let iterator = await generator.next();
            do {
                const step = iterator.value;
                yield {node, step};
                if (step.out) {
                    const nextNode = findNextActionNode(node.id, step.out);

                    if (nextNode) {
                        yield* runAction(nextNode);
                    }
                }
                iterator = await generator.next();
            } while (!iterator.done);
        };

        const nextNode = findNextActionNode(node.id, 'out');
        if (nextNode) {
            for await (const step of runAction(nextNode)) {
                logs.push(step);
            }
        }
    };
    const show = () => {
        run();
        dialog.showModal();
    };
</script>

<button onclick={show}>Run</button>
<dialog bind:this={dialog}>
    {#each logs as log}
        <fieldset>
            <legend>{log.node.data.id}</legend>
            <p>
                {log.step.out}
            </p>
        </fieldset>
    {/each}
    <button onclick={() => dialog.close()}>Close</button>
</dialog>
