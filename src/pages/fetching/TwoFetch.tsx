import { createEffect, createResource, createSignal, Match, Show, Suspense, Switch } from "solid-js";

export default function GuidesFetchingData() {
    return (
        <>
            <section class="bg-pink-100 text-gray-700 p-8">
                <App />
            </section>
        </>
    )
}

const fetchUser = async (id: string) => {
    const response = await fetch(`https://swapi.dev/api/people/${id}/`);
    if (!response.ok) {
        throw new Error(`Response nok ${response.status} ${response.statusText}`)
    }
    await new Promise((r) => setTimeout(r, 500))
    return response.json();
}

function App() {

    const [user1] = createResource(() => fetchUser("1"));
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