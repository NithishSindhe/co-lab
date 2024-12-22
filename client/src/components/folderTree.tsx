import {useState} from 'react';
//@ts-ignore
import { Treebeard } from 'react-treebeard';

function TreeExample(props:Dictionary) {
    const [data, setData] = useState({
        name: 'root',
        toggled: true,
        children: [
            {
                name: 'parent',
                children: [
                    { name: 'child1' },
                    { name: 'child2' }
                ]
            },
            {
                name: 'loading parent',
                loading: true,
                children: []
            },
            {
                name: 'parent',
                children: [
                    {
                        name: 'nested parent',
                        children: [
                            { name: 'nested child 1' },
                            { name: 'nested child 2' }
                        ]
                    }
                ]
            }
        ]
    });
    const [cursor, setCursor] = useState<boolean>(false);
    
    //@ts-ignore
    const onToggle = (node, toggled:boolean) => {
        if (cursor) {
            //@ts-ignore
            cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        setCursor(node);
        setData(Object.assign({}, data))
    }
    
    return (
    <>
        <div className="p-4 bg-gray-100 rounded-md shadow-sm "> 
            <Treebeard data={data} onToggle={onToggle}/>
        </div>

    </>
    )
}
 
export default TreeExample


