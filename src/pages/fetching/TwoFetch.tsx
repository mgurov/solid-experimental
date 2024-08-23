import { createResource, Match, Switch } from "solid-js";

export default function GuidesFetchingData() {
    return (
        <>
            <section class="bg-pink-100 text-gray-700 p-8">
                <DependentFetch />
            </section>
        </>
    )
}

const startingUser = "1"

const fetchUser = async (id: string) => {
    const response = await fetch(`https://swapi.dev/api/people/${id}/`);
    if (!response.ok) {
        throw new Error(`Response nok ${response.status} ${response.statusText}`)
    }
    await new Promise((r) => setTimeout(r, 500))
    return response.json();
}

function DependentFetch_ExtraComponent2() {
    const [user1] = createResource(() => fetchUser(startingUser));

    return (
        <div>
            <div>
                User1:
                <Switch>
                    <Match when={user1.loading}>Loading...</Match>
                    <Match when={user1.error}>
                        <span data-testid="error">Error: {user1.error.message}</span>
                    </Match>
                    <Match when={user1()}>
                        <div data-testid="result">{JSON.stringify(user1())}</div>
                        <DependentFetch_ExtraComponent2_D user1={user1} />
                    </Match>
                </Switch>
            </div>
            <div>
            </div>
        </div>
    );
}

function DependentFetch_ExtraComponent2_D(props: { user1: any }) {
    const [user2] = createResource(props.user1, (u) => fetchUser(u.mass));

    return (
        <div>
            User2:
            <Switch>
                <Match when={user2.loading}>Loading...</Match>
                <Match when={user2.error}>
                    <span data-testid="error">Error: {user2.error.message}</span>
                </Match>
                <Match when={user2()}>
                    <div data-testid="result">{JSON.stringify(user2())}</div>
                </Match>
            </Switch>

        </div>
    );
}

function DependentFetch() {

    const [user1] = createResource(() => fetchUser(startingUser));
    const [user2] = createResource(user1, (u) => fetchUser(u.mass));

    return (
        <div>
            <div>
                User1:
                <Switch>
                    <Match when={user1.loading}>Loading...</Match>
                    <Match when={user1.error}>
                        <span data-testid="error">Error: {user1.error.message}</span>
                    </Match>
                    <Match when={user1()}>
                        <div data-testid="result">{JSON.stringify(user1())}</div>
                    </Match>
                </Switch>
            </div>
            <div>
                User2:
                <Switch>
                    <Match when={user2.loading}>Loading...</Match>
                    <Match when={user2.error}>
                        <span data-testid="error">Error: {user2.error.message}</span>
                    </Match>
                    <Match when={user2()}>
                        <div data-testid="result">{JSON.stringify(user2())}</div>
                    </Match>
                </Switch>
            </div>
        </div>
    );
}

function DependentFetch_Nested() {
    const [user1] = createResource(() => fetchUser(startingUser));
    const [user2] = createResource(user1, (u) => fetchUser(u.mass));

    return (
        <div>
            <div>
                User1:
                <Switch>
                    <Match when={user1.loading}>Loading...</Match>
                    <Match when={user1.error}>
                        <span data-testid="error">Error: {user1.error.message}</span>
                    </Match>
                    <Match when={user1()}>
                        <div data-testid="result">{JSON.stringify(user1())}</div>
                        User2:
                        <Switch>
                            <Match when={user2.loading}>Loading...</Match>
                            <Match when={user2.error}>
                                <span data-testid="error">Error: {user2.error.message}</span>
                            </Match>
                            <Match when={user2()}>
                                <div data-testid="result">{JSON.stringify(user2())}</div>
                            </Match>
                        </Switch>

                    </Match>
                </Switch>
            </div>
            <div>
            </div>
        </div>
    );
}