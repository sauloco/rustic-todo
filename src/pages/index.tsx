import {Inter} from 'next/font/google'
import React, {useEffect, useState} from 'react';
import ItemInput from '@/pages/components/ItemInput';
import TaskList from '@/pages/components/TaskList';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFire, faTrashRestore} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const inter = Inter({subsets: ['latin']})

const getLS = (key: string) => {
	const savedData = localStorage.getItem(key)
	return savedData ? JSON.parse(savedData) : null
}

const setLS = (key: string, value: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(value))
		return true;
	} catch (e) {
		console.error(`Error setting '${key}' to "${value.toString()}" on Local Storage`)
		console.error(e)
	}
	return false;
}

const Home: React.FC = () => {

	const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(false);
	const [items, setItems] = useState<Item[]>([]);
	const [isLocalStorageSavingEnabled, setIsLocalStorageSavingEnabled] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const filterDeleted = () => items.filter(i => i.deleted)
	const filterDone = () => items.filter(i => i.done && !i.deleted)
	const filterPending = () => items.filter(i => !i.done && !i.deleted)

	useEffect(() => {
		if (isLocalStorageAvailable && isLocalStorageSavingEnabled) {
			setLS('items', items)
		}
	}, [items, isLocalStorageSavingEnabled, isLocalStorageAvailable])

	useEffect(() => {
		const isWindow = typeof window !== 'undefined';
		const hasLS = isWindow && !!window?.localStorage;

		setIsLocalStorageAvailable(hasLS);

	}, [])

	useEffect(() => {
		if (!isLocalStorageAvailable) {
			return;
		}
		const oldData = getLS('items')
		let oldItems: Item[] = []
		if (oldData) {
			oldItems = oldData as Item[]
			setItems(oldItems)
		}
		setIsLocalStorageSavingEnabled(true)
	}, [isLocalStorageAvailable])
	const handleItemSave = (item: Item) => {
		setItems([
			...items,
			item,
		])
	}

	const handleChatGPTItemSave = async (item: Item) => {
		setIsLoading(true)
		const response = await axios.get('/api/assistant', {
			params: {
				prompt: item.title,
				description: item.description,
			}
		})

		if (response.status !== 200) {
			const {message} = response.data
			console.error(message)
			return;
		}

		const suggestedItems = response.data

		setIsLoading(false)

		if (suggestedItems.length) {
			setItems([
				...items,
				...suggestedItems,
			])
			return;
		}
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
			<ItemInput onSave={handleItemSave} onAiGenerate={handleChatGPTItemSave} enabled={!isLoading}/>
			<TaskList title={`Pending ${filterPending().length ? filterPending().length : ''}`} items={filterPending()}
			          onItemChange={handleItemChange}
			          onItemDelete={handleItemChange} emptyMessage={"No pending tasks yet! Add one"}/>
			<TaskList title={`Already Done ${filterDone().length ? filterDone().length : ''}`} items={filterDone()}
			          onItemChange={handleItemChange}
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
						<button className={`
							appearance-none
							border-none
							outline-none
							p-3
							text-sm
							flex
							items-center
							justify-center
							rounded-full
							h-6
							w-auto
							hover:bg-opacity-50
							bg-blue-400
							bg-opacity-25
							inline
						`} title={'Restore'} onClick={restoreDeletedItems} value="">
							<FontAwesomeIcon icon={faTrashRestore}/>&nbsp;Restore {filterDeleted().length > 1 ? 'all' : 'it'}
						</button>
						<span
							className={`w-auto`}>{`Trash has ${filterDeleted().length} deleted item${filterDeleted().length === 1 ? '' : 's'}`}</span>
						<button className={`
							appearance-none
							border-none
							outline-none
							p-3
							text-sm
							flex
							items-center
							justify-center
							rounded-full
							h-6
							w-auto
							hover:bg-opacity-50
							bg-red-400
							bg-opacity-25
							inline
						`} title={'Clear trash'} onClick={emptyDeletedItems}>
							<FontAwesomeIcon icon={faFire}/>&nbsp;Burn {filterDeleted().length > 1 ? 'them' : 'it'}
						</button>
					</div>
					: null
			}
		</main>
	)
}

export default Home;