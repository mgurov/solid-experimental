import axios from "axios";
import { createResource, createSignal, Match, Show, Suspense, Switch } from "solid-js";

export default function GuidesFetchingDataAxios() {
    return (
        <>
            <section class="bg-pink-100 text-gray-700 p-8">
                <h1 class="text-2xl font-bold">Fetching experiments</h1>
                <p class="mt-4">
                    Fetching data as per <a href="https://docs.solidjs.com/guides/fetching-data">the guide, but this time with the axios lib under the hood</a>
                </p>
                <App />
                {/* <AppSuspence /> */}
            </section>
        </>
    )
}

const fetchUser = async (id) => {
    const { data } = await axios.get(`https://swapi.dev/api/people/${id}/`);
    return data
}

function App() {
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