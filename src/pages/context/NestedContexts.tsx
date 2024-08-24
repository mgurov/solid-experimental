import { createContext, JSX } from "solid-js"

export default function GuidesFetchingData() {
    return (
        <>
            <section class="bg-pink-100 text-gray-700 p-8">
                <TreeProvider name="root">
                    Here be root
                </TreeProvider>
            </section>
        </>
    )
}

type TreeNode = {
    name: string,
    path: string[],
}

const TreeContext = createContext<TreeNode>()

export function TreeProvider(props: {name: string, path?: string[], children: JSX.Element}) {
    return (
        <TreeContext.Provider value={{
            name: props.name,
            path: props.path || []
        }}>
            {props.children}
        </TreeContext.Provider>
    )
}
