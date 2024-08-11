import axios from "axios";
import { createResource, Match, Show, Switch } from "solid-js";

export default function Fetching() {
    return (
        <>
            <section class="bg-pink-100 text-gray-700 p-8">
                <h1 class="text-2xl font-bold">Fetching experiments</h1>
                <p class="mt-4">
                    We love data fetching
                </p>
            </section>
            <section>
                <h1 class="text-2xl font-bold">Textbook example</h1>
                {/* <DoFetching /> */}

                <WrapFetching
                    name="call1"
                    fetchCall={fetchCall1}
                    onFetched={call1 => <>
                        <div data-testid="call1-result">{call1.action}: {call1.value}</div>
                        <WrapFetching
                            name="call2"
                            fetchCall={() => fetchCall2(call1.value)}
                            onFetched={call2 => <>
                                <div data-testid="call2-result">{call2.action}: {call2.value}</div>                                
                            </>}
                        />

                    </>}
                 />

            </section>
        </>
    )
}

function WrapFetching<T>(props: {
    name: string,
    fetchCall: () => T | PromiseLike<T>,
    onFetched: (data: T) => any,
}) {
    const [call] = createResource(async () => await props.fetchCall());

    return (
        <div>
            <Show when={call.loading}>
                <p data-testid={`${props.name}-pending`}>{props.name} Loading...</p>
            </Show>
            <Switch>
                <Match when={call.error}>
                    <span data-testid={`${props.name}-err`}>Error: {call.error.message}</span>
                </Match>
                <Match when={call()}>
                    {props.onFetched(call())}
                </Match>
            </Switch>
        </div>
    );
}

const fetchCall1 = async () => (await axios.get(`/api/call1`)).data;

function DoFetching() {
    const [call1] = createResource(fetchCall1);

    return (
        <div>
            <Show when={call1.loading}>
                <p data-testid="call1-pending">Call1 Loading...</p>
            </Show>
            <Switch>
                <Match when={call1.error}>
                    <span data-testid="call1-err">Error: {call1.error.message}</span>
                </Match>
                <Match when={call1()}>
                    <div data-testid="call1-result">{call1().action}: {call1().value}</div>
                    <DoSecondFetching target={call1().value} />
                </Match>
            </Switch>
        </div>
    );
}

const fetchCall2 = async (target: string) => (await axios.get(`/api/${target}`)).data;

function DoSecondFetching({target}: {target: string}) {
    const [call2] = createResource(() => fetchCall2(target));

    return (
        <div>
            <Show when={call2.loading}>
                <p data-testid="call2-pending">Call2 Loading...</p>
            </Show>
            <Switch>
                <Match when={call2.error}>
                    <span>Error: {call2.error.message}</span>
                </Match>
                <Match when={call2()}>
                    <div data-testid="call2-result">{call2().action}: {call2().value}</div>
                </Match>
            </Switch>
        </div>
    );

}