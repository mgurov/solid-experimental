import { createEffect, createResource, createSignal, Match, Show, Suspense, Switch } from "solid-js";

export default function GuidesFetchingData() {
    return (
        <>
            <section class="bg-pink-100 text-gray-700 p-8">
                <h1 class="text-2xl font-bold">Fetching experiments</h1>
                <p class="mt-4">
                    Fetching data as per <a href="https://docs.solidjs.com/guides/fetching-data">the guild 1</a>
                </p>
                <App />
                {/* <AppSuspence /> */}
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
    const [userId, setUserId] = createSignal<string>();
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
            <Show when={user.loading}>
                <p data-testid="loading">Loading...</p>
            </Show>
            <Switch>
                <Match when={user.error}>
                    <span data-testid="error">Error: {user.error.message}</span>
                </Match>
                <Match when={user()}>
                    <div data-testid="result">{JSON.stringify(user())}</div>
                </Match>
            </Switch>

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