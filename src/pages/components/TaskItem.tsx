import React, {useEffect, useState} from 'react';
import ItemInputInline from '@/pages/components/ItemInputInline';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faTrash} from '@fortawesome/free-solid-svg-icons';

interface TaskItemProps {
	item: Item,
	onDone: (item: Item) => void,
	onInlineSave: (item: Item) => void,
	onDelete: (item: Item) => void,
}

const TaskItem: React.FC<TaskItemProps> = ({item, onDone, onInlineSave, onDelete}) => {
	const [editMode, setEditMode] = useState(false)
	const [done, setDone] = useState(item?.done || false)

	useEffect(() => {
		onDone({...item, done})
	}, [done])

	const onInlineSaveClickHandler = (item: Item) => {
		setEditMode(false)
		onInlineSave(item)
	}
	const markItemDeleted = (item: Item) => {
		onDelete({...item, deleted: true})
	}

	const handleDone = () => {
		setDone(!done);
	}

	const displayItemFragment = (
		<div className={'select-text dark:bg-gray-800 rounded-xl p-3 mx-3 flex flex-col gap-3'}>
			<div className={`
			flex flex-col gap-3`}>
				<div className={'flex flex-row gap-3 items-center'}>
					<button className={`
						appearance-none
						text-sm
						flex
						items-center
						justify-center
						${done ? 'dark:hover:bg-green-500' : ''}
						${done ? 'dark:bg-opacity-25' : ''}
						border-none 
						outline-none
						p-3 
						rounded-full
						h-6 
						w-6
						focus:bg-opacity-50
						hover:text-green-200
						focus:ring-2
						ring-green-200
						${done ? 'text-green-500' : ''}
						${done ? 'hover:bg-opacity-50' : ''}
						bg-white
						dark:bg-gray-700 
						bg-opacity-75
						dark:bg-opacity-25
					`} onClick={handleDone}>
						<FontAwesomeIcon icon={faCheck}/>
					</button>

					<div className={`
						appearance-none
						border-none 
						outline-none 
						font-bold
						p-3
						rounded-xl 
						w-full 
						focus:ring 
						focus:bg-opacity-50
						text-gray-900
						dark:text-gray-50
						dark:bg-gray-700 
						bg-opacity-75
						dark:bg-opacity-25
						${done ? 'line-through' : ''}
					`} onClick={() => setEditMode(true)}>{item?.title || ''}</div>

					<button className={`
						appearance-none
						border-none 
						outline-none
						p-3
						text-xs
						flex
						items-center
						justify-center
						rounded-full
						focus:ring-2
						ring-red-200
						h-6 
						w-6
						focus:bg-opacity-50
						hover:text-red-300
						bg-white
						dark:bg-gray-700 
						bg-opacity-75
						dark:bg-opacity-25
					`} onClick={() => markItemDeleted(item)}>
						<FontAwesomeIcon icon={faTrash}/>
					</button>
				</div>
				{item?.description && <div className={`
					appearance-none
					border-none 
					outline-none 
					p-3 
					ml-9 
					rounded-xl 
					w-auto
					focus:ring 
					focus:bg-opacity-50
					text-gray-900
					dark:text-gray-50 
					dark:bg-gray-700 
					dark:bg-opacity-25
					whitespace-pre-line
					${done ? 'line-through' : ''}
				`} onClick={() => setEditMode(true)}
				>{item?.description}</div>}
			</div>
		</div>
	)
	const editItemFragment = (
		<ItemInputInline item={item} onSave={onInlineSaveClickHandler}/>
	)
	return (
		<li>
			{editMode
				? editItemFragment
				: displayItemFragment
			}
		</li>)
}

export default TaskItem;