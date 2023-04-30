import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFire, faTrashRestore} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface TrashProps {
	onBurn: () => void,
	onRestore: () => void,
	items: Item[]
}

const Trash: React.FC<TrashProps> = ({items, onBurn, onRestore}) => {
	return <div
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
						`} title={'Restore items'} onClick={() => onRestore()} value="">
			<FontAwesomeIcon icon={faTrashRestore}/>
			<span className={'sm:inline hidden'}>&nbsp;Restore {items?.length > 1 ? 'all' : 'it'}</span>
		</button>
		<span
			className={`w-auto`}>{`Trash has ${items?.length} deleted item${items?.length === 1 ? '' : 's'}`}</span>
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
						`} title={'Burn trash'} onClick={() => onBurn()}>
			<FontAwesomeIcon icon={faFire}/>
			<span className={'sm:inline hidden'}>&nbsp;Burn {items?.length > 1 ? 'them' : 'it'}</span>
		</button>
	</div>;
}

export default Trash