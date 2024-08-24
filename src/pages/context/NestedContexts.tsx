import { createContext, JSX, useContext } from "solid-js"

export default function GuidesFetchingData() {
    return (
        <>
            <section class="bg-pink-100 text-gray-700 p-8">
                <TreeProvider name="root">
                    <TreeNoder />
                </TreeProvider>
            </section>
        </>
    )
}

function TreeNoder(props: {children?: JSX.Element}) {
    const node = useTree()
    return (
        <> <span>{node.name}</span> {props.children} </>
    );
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

export function useTree() {
    return useContext(TreeContext);
}
