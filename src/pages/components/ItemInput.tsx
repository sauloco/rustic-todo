import React, {useEffect, useState} from 'react';
import {v4} from 'uuid';


interface ItemInputProps {
	item?: Item,
	inline?: boolean,
	onSave: (item: Item) => void,
}

const ItemInput: React.FC<ItemInputProps> = ({item, onSave, inline = false}) => {
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

	const validateForm = () => {
		setError("")
		if (!title) {
			setError("Task title can't be empty")
			return;
		}
		onSave(currentItem)

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
			placeholder={`${inline ? 'Modify task' : 'Add a task'}${error ? ' (we kinda need this)' : '...'}`}
			onKeyDown={(e) => e.key === "Enter" ? validateForm() : null}
			onChange={event => setTitle(event.target.value)}/>
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
			placeholder={"If you need it, add a description..."}
			onChange={event => setDescription(event.target.value)}></textarea>

		<input
			className={`
				appearance-none
				border-none 
				outline-none 
				focus:ring 
				${inline ? 'focus:outline-blue-100' : 'focus:outline-purple-100'} 
				${inline ? 'dark:focus:outline-blue-900' : 'dark:focus:outline-purple-950'} 
				text-gray-700
				dark:text-gray-50 
				${inline ? 'dark:bg-blue-900' : 'dark:bg-purple-950'} 
				${inline ? 'bg-blue-100' : 'bg-purple-50'} 
				p-3 
				rounded-xl 
				w-full
				font-semibold
				uppercase 
			`}
			type="button" value={inline ? "Save changes" : "Add task"} onClick={validateForm}/>
	</div>
}

export default ItemInput