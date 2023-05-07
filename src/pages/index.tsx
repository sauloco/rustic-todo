import {Inter} from 'next/font/google'
import React, {useEffect, useState} from 'react';
import ItemInput from '@/pages/components/ItemInput';
import TaskList from '@/pages/components/TaskList';
import axios from 'axios';
import Trash from '@/pages/components/Trash';
import {Item, ItemsByStatus, SortingMethod} from '@/types';
import SortingHandler from '@/pages/components/SortingHandler';
import {DEFAULT_SORTING_TYPE, SupportedSortingMethods} from '@/utils/sort';
import {v4} from 'uuid';

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
	const [serverError, setServerError] = useState('');
	const [sortingFn, setSortingFn] = useState<SortingMethod>(() => SupportedSortingMethods[DEFAULT_SORTING_TYPE])
	const [itemsStatusMap, setItemsStatusMap] = useState<ItemsByStatus>({})
	const [sessionId, setSessionId] = useState(() => v4())
	const [contextFilter, setContextFilter] = useState<[keyof Item, any] | undefined>()
	const [filtering, setFiltering] = useState(false)

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
		let contextItems = items.slice().sort(sortingFn);
		setFiltering(false)
		if (contextFilter && contextFilter.length === 2) {
			const [prop, value] = contextFilter;
			contextItems = items.filter(i => {
				if (Object.hasOwn(i, prop)) {
					if (Array.isArray(i[prop])) {
						// @ts-ignore
						return i[prop].includes(value)
					}
					return i[prop] === value
				}
				return false;
			});
			setFiltering(true)
		}


		setItemsStatusMap({
			pending: [...contextItems.filter(i => !i.done && !i.deleted)],
			done: [...contextItems.filter(i => i.done && !i.deleted)],
			deleted: [...contextItems.filter(i => i.deleted)],
		})
	}, [items, sortingFn, contextFilter, filtering])

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
	const handleItemSave = (newItems: Item[] | Item) => {
		if (!Array.isArray(newItems)) {
			newItems = [newItems]
		}
		setItems([
			...items,
			...newItems,
		])
		setSessionId(() => v4())
	}

	const handleSortingMethodChange = (method: SortingMethod) => {
		setSortingFn(() => method)
	}

	const handleChatGPTItemSave = async (item: Item) => {
		setIsLoading(true)
		try {
			const response = await axios.get('/api/assistant', {
				params: {
					prompt: item.title,
					description: item.description,
				}
			})

			if (response.status !== 200) {
				const {message} = response.data
				console.error(message)
				setIsLoading(false)
				return;
			}

			const suggestedItems = response.data


			if (suggestedItems.length) {
				handleItemSave(suggestedItems);
			} else {
				item.createdAt = item.createdAt || Date.now()
				handleItemSave([item])
			}
		} catch (e) {
			console.error(e)
			// @ts-ignore
			if (e && typeof e === 'object' && (e?.response?.data?.message || e?.message)) {
				// @ts-ignore
				setServerError(e?.response?.data?.message || e?.message)
			} else {
				setServerError('Unexpected error.')
			}
		}
		setIsLoading(false)
	}

	const handleItemChange = (item: Item) => {
		const indexCurrentItem = items.findIndex(i => i.id === item.id);
		if (indexCurrentItem >= 0) {
			const itemsCopy = items.slice()
			itemsCopy.splice(indexCurrentItem, 1, item);
			setItems(itemsCopy)
		}
	}

	const handleContextFilter = (prop: keyof Item, value: any) => {
		setContextFilter([prop, value])
	}
	const handleClearFilter = () => {
		setContextFilter(undefined)
	}

	const restoreDeletedItems = () => {
		const itemsCopy = items.slice().map(i => ({
			...i,
			deleted: false,
		}))
		setItems(itemsCopy)


	}

	const emptyDeletedItems = () => {
		const notMarkedForDeletion = items.filter(i => !i.deleted)
		console.log('wtf', Object.is(items, notMarkedForDeletion))
		setItems([...notMarkedForDeletion])
	}

	return (
		<main
			className={`flex flex-col gap-4 ${inter.className}`}
		>
			<h1
				className={`
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
				`}>todo<b>ai</b>d</h1>
			<ItemInput displayError={serverError} onSave={handleItemSave} onAiGenerate={handleChatGPTItemSave}
			           enabled={!isLoading} key={sessionId}/>
			<SortingHandler onChange={handleSortingMethodChange}/>
			<TaskList
				title={`Pending${filtering ? ` in ${contextFilter?.[1].toLowerCase() || ''} context` : ''}${itemsStatusMap.pending?.length ? ` ${itemsStatusMap.pending?.length}` : ''}`}
				items={itemsStatusMap.pending}
				onItemChange={handleItemChange}
				onItemDelete={handleItemChange}
				onContextFilter={handleContextFilter}
				filtering={filtering}
				filteredValue={contextFilter?.length === 2 ? contextFilter[1] : undefined}
				onClearFilter={handleClearFilter}
				emptyMessage={"No pending tasks yet! Add one"}/>
			<TaskList
				title={`Done${filtering ? ` in ${contextFilter?.[1].toLowerCase() || ''} context` : ''}${itemsStatusMap.done?.length ? ` ${itemsStatusMap.done?.length}` : ''}`}
				items={itemsStatusMap.done}
				onItemChange={handleItemChange}
				onItemDelete={handleItemChange}
				filtering={filtering}
				filteredValue={contextFilter?.length === 2 ? contextFilter[1] : undefined}
				onContextFilter={handleContextFilter}
				onClearFilter={handleClearFilter}
			/>
			<Trash items={itemsStatusMap.deleted} onBurn={emptyDeletedItems} onRestore={restoreDeletedItems}/>

		</main>
	)
}

export default Home;