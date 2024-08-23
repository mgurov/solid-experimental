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
    return response.json();
}

function App() {

    const [user1] = createResource(() => fetchUser("1"));
    const [user2] = createResource(() => fetchUser("2"));

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

function AppSignals() {
    const [userId, setUserId] = createSignal<string>();
    const [user_loading, setLoading] = createSignal(false);
    const [user_error, setError] = createSignal(null);
    const [user_data, setUser] = createSignal();

    createEffect(() => {
        if (userId()) {
            console.log('got a user id', userId())
            fetchUser(userId())
                .then(setUser)
                .catch(e => { console.log('got an error', e); setError(e) })
                .finally(() => setLoading(false))
        } else {
            console.log('no user id nothing')
        }
    })

    return (
        <div>
            <input
                data-testid="user-id-input"
                type="number"
                min="1"
                placeholder="Enter Numeric Id"
                onInput={(e) => setUserId(e.currentTarget.value)}
            />
            <p>Error type: {typeof (user_error())} {JSON.stringify(user_error())}</p>
            <Show when={user_loading()}>
                <p data-testid="loading">Loading...1</p>
            </Show>
            <Switch>
                <Match when={user_error()}>
                    <span data-testid="error">Error: {JSON.stringify(user_error().message)}</span>
                </Match>
                <Match when={user_data()}>
                    <div data-testid="result">{JSON.stringify(user_data())}</div>
                </Match>
            </Switch>

        </div>
    );
}


function AppSuspence() {
    const [userId, setUserId] = createSignal();
    const [user] = createResource(userId, fetchUser);

    return (
        <div>
            <input
                data-testid="user-id-input"
                type="number"
                min="1"
                placeholder="Enter Numeric Id"
                onInput={(e) => setUserId(e.currentTarget.value)}
            />
            <Suspense fallback={<div data-testid="loading">Loading...</div>}>

                <Switch>
                    <Match when={user.error}>
                        <span data-testid="error">Error: {user.error.message}</span>
                    </Match>
                    <Match when={user()}>
                        <div data-testid="result">{JSON.stringify(user())}</div>
                    </Match>
                </Switch>
            </Suspense>
        </div>
    );
}