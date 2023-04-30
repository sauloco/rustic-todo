import React, {useEffect, useState} from 'react';
import {v4} from 'uuid';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen, faPlus, faWandMagicSparkles} from '@fortawesome/free-solid-svg-icons';


interface ItemInputProps {
	item?: Item,
	inline?: boolean,
	onSave: (item: Item) => void,
	onAiGenerate: (item: Item) => void,
	enabled: boolean
}

const ItemInput: React.FC<ItemInputProps> = ({item, onSave, onAiGenerate, inline = false, enabled = true}) => {
	const [id, setId] = useState(item?.id || v4());
	const [title, setTitle] = useState(item?.title || "");
	const [description, setDescription] = useState(item?.description || "")
	const [error, setError] = useState("")
	const [currentItem, setCurrentItem] = useState<Item>({
		title,
		description,
		id,
		done: false,
		deleted: false,
		dateCompletion: item?.dateCompletion || null,
	})

	useEffect(() => {
		if (title) {
			setCurrentItem({
				...currentItem,
				title,
				description,
				id,
			})
		}
	}, [id, title, description])

	const validateForm = (useAI: boolean = false) => {
		setError("")
		if (!title) {
			setError("Task title can't be empty")
			return;
		}
		if (useAI) {
			onAiGenerate(currentItem)
		} else {
			onSave(currentItem)
		}


		resetForm()
	}

	const resetForm = () => {
		setTitle("")
		setDescription("")
		setError("")
		setId(v4())
	}
	return <div
		className={`
			flex 
			flex-col 
			gap-3 
			bg-gray-200
			dark:bg-gray-800 
			bg-gradient-to-l
			${inline ? 'from-blue-100' : 'from-purple-50'} 
			${inline ? 'dark:from-blue-900' : 'dark:from-purple-950'} 
			rounded-xl 
			p-3 
			mx-3
		`}>
		{inline && <h2 className={`font-light text-gray-400`}>Editing task</h2>}
		<div className="flex flex-row items-center gap-3">

			<input
				className={`
				appearance-none
				border-none 
				outline-none 
				p-3 
				rounded-xl 
				w-full 
				focus:ring 
				focus:bg-opacity-50
				${inline ? 'focus:outline-blue-100' : 'focus:outline-purple-100'} 
				${inline ? 'dark:focus:outline-blue-900' : 'dark:focus:outline-purple-950'} 
				text-gray-900
				dark:text-gray-50
				bg-white
				dark:bg-gray-700
				bg-opacity-25
				${error && 'placeholder:text-red-300 dark:placeholder:text-pink-400'}
			`}
				type="text"
				value={title}
				disabled={!enabled}
				placeholder={`${inline ? 'Modify task' : 'Add a task'}${error ? ' (we kinda need this)' : '...'}`}
				onKeyDown={(e) => e.key === "Enter" ? validateForm() : null}
				onChange={event => setTitle(event.target.value)}/>
			<button className={`
						border-none 
						outline-none
						p-3
						text-xs
						max-w-fit
						flex
						items-center
						justify-center
						${inline ? 'rounded-full' : 'rounded-xl'}
						${inline ? '' : 'p-1'}
						dark:text-purple-300
						text-purple-700
						disabled:text-slate-500 
						dark:disabled:text-slate-500
						focus:ring-2
						focus:bg-opacity-50
						hover:text-blue-500
						bg-white
						dark:bg-gray-700 
						bg-opacity-75
						dark:bg-opacity-25
					`} disabled={!enabled} onClick={() => validateForm()}>
				{inline
					? <FontAwesomeIcon icon={faPen}/>
					: <div className={'m-1'}>
						<FontAwesomeIcon icon={faPlus}/>
						<span>Add</span>
					</div>
				}

			</button>
		</div>
		<div className="flex flex-row items-center gap-3">
		<textarea
			className={`
				appearance-none
				border-none 
				outline-none 
				p-3 
				rounded-xl 
				w-full 
				resize-none
				focus:ring 
				focus:bg-opacity-50
				${inline ? 'focus:outline-blue-100' : 'focus:outline-purple-100'} 
				${inline ? 'dark:focus:outline-blue-900' : 'dark:focus:outline-purple-950'} 
				text-gray-900
				dark:text-gray-50
				bg-white
				dark:bg-gray-700
				bg-opacity-25
			`}
			value={description}
			disabled={!enabled}
			placeholder={"If you need it, add a description..."}
			onChange={event => setDescription(event.target.value)}></textarea>
			{!inline &&
				<button className={`
						border-none 
						outline-none
						p-3
						text-xs
						flex
						max-w-fit
						items-center
						justify-center
						${inline ? 'rounded-full' : 'rounded-xl'}
						${inline ? '' : 'p-1'}
						dark:text-purple-300
						text-purple-700
						disabled:text-slate-500 
						dark:disabled:text-slate-500
						focus:ring-2
						focus:bg-opacity-50
						hover:text-blue-500
						bg-white
						dark:bg-gray-700 
						bg-opacity-75
						dark:bg-opacity-25
					`} disabled={!enabled} onClick={() => validateForm(true)}>

					<div className={'m-1'}>
						<FontAwesomeIcon icon={faWandMagicSparkles}/>
						<span>GPT</span>
					</div>

				</button>
			}
		</div>
	</div>
}

export default ItemInput