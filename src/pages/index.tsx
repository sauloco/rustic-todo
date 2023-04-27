import {Inter} from 'next/font/google'
import {useEffect, useState} from 'react';
import {ItemInput} from '@/pages/components/ItemInput';
import {TaskList} from '@/pages/components/TaskList';


const inter = Inter({subsets: ['latin']})

const getLS = (key: string) => {
	let savedData;
	if (typeof window !== 'undefined') {
		try {
			savedData = localStorage.getItem(key)
		} catch (e) {
			// intentionally empty
		}
	}
	return savedData ? JSON.parse(savedData) : null
}

const setLS = (key: string, value: any) => {
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem(key, JSON.stringify(value))
			return true;
		} catch (e) {
			// intentionally empty
		}
	}
	return false;
}

export default function Home() {

	const [items, setItems] = useState<Item[]>([]);
	const [isLSAvailable, setIsLSAvailable] = useState(false)
	const filterDeleted = () => items.filter(i => i.deleted)
	const filterDone = () => items.filter(i => i.done)
	const filterPending = () => items.filter(i => !i.done && !i.deleted)

	useEffect(() => {
		if (isLSAvailable) {
			setLS('items', items)
		}
	}, [items, isLSAvailable])

	useEffect(() => {
		const oldData = getLS('items')
		let oldItems: Item[] = []
		if (oldData) {
			oldItems = oldData as Item[]
			setItems(oldItems)
			setIsLSAvailable(true)
		}
	}, [])
	const handleItemSave = (item: Item) => {
		setItems([
			...items,
			item,
		])
	}

	const handleItemChange = (item: Item) => {
		const indexCurrentItem = items.findIndex(i => i.id === item.id);
		if (indexCurrentItem >= 0) {
			const itemsCopy = items.slice()
			itemsCopy.splice(indexCurrentItem, 1, item);
			setItems(itemsCopy)
		}
	}

	const restoreDeletedItems = () => {
		const itemsCopy = items.slice().map(i => ({
			...i,
			deleted: false,
		}))
		setItems(itemsCopy)
	}

	const emptyDeletedItems = () => {
		const itemsCopy = items.slice();
		const deletedItems = filterDeleted();
		for (const deletedItem of deletedItems) {
			const currentIndex = itemsCopy.indexOf(deletedItem)
			itemsCopy.splice(currentIndex, 1)
		}
		setItems(itemsCopy)
	}

	return (
		<main
			className={`flex flex-col gap-4 ${inter.className}`}
		>
			<h1
				className={`
					font-extrabold 
					text-4xl 
					text-center 
					my-3 
					text-transparent 
					bg-clip-text 
					bg-gradient-to-r 
					from-[#FF073A] 
					from-20% 
					via-45% 
					via-[#9C1DE7] 
					to-60% 
					to-[#353535]
					dark:to-[#F7F7F7]
				`}>Rustic
				Tasks</h1>
			<ItemInput onSave={handleItemSave}/>
			<TaskList title={'Pending'} items={filterPending()} onItemChange={handleItemChange}
			          onItemDelete={handleItemChange} emptyMessage={"No pending tasks yet! Add one"}/>
			<TaskList title={'Already Done'} items={filterDone()} onItemChange={handleItemChange}
			          onItemDelete={handleItemChange}/>
			{
				filterDeleted().length
					? <div
						className={`
							sticky 
							bottom-0 
							bg-gray-300
							dark:bg-gray-700 
							p-3 
							backdrop-blur-md
							rounded-lg 
							bg-opacity-25
							flex 
							flex-row 
							items-center 
							justify-between 
							m-3 
							mt-0
							w-auto
						`}>
						<input className={`
							appearance-none
							border-none
							outline-none
							p-3
							rounded-full
							h-6
							w-6
							hover:bg-opacity-50
							bg-blue-400
							bg-opacity-25
							inline
						`} type="button" title={'Restore'} onClick={restoreDeletedItems} value=""/>
						<span
							className={`w-auto`}>{`Trash has ${filterDeleted().length} deleted item${filterDeleted().length === 1 ? '' : 's'}`}</span>
						<input className={`
							appearance-none
							border-none
							outline-none
							p-3
							rounded-full
							h-6
							w-6
							hover:bg-opacity-50
							bg-red-400
							bg-opacity-25
							inline
						`} type="button" title={'Clear trash'} onClick={emptyDeletedItems} value=""/>
					</div>
					: null
			}
		</main>
	)
}
