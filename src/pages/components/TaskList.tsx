import TaskItem from '@/pages/components/TaskItem';
import React from 'react';
import {Item} from '@/types';

export interface TaskListProps {
	title?: string,
	items?: Item[],
	emptyMessage?: string,
	onItemChange: (item: Item) => void,
	onItemDelete: (item: Item) => void,
	onContextFilter: (prop: keyof Item, value: any) => void,
	filtering: boolean,
	onClearFilter: () => void,
	filteredValue?: string,
}

const TaskList: React.FC<TaskListProps> = ({
	                                           title,
	                                           items,
	                                           emptyMessage,
	                                           onItemChange,
	                                           onItemDelete,
	                                           filtering = false,
	                                           onContextFilter,
	                                           onClearFilter,
	                                           filteredValue
                                           }) => {
	return (items?.length || (!items?.length && emptyMessage)
			? <div
				className={`
					flex 
					flex-col 
					gap-3
					bg-gray-200
					shadow-md
					dark:shadow-none
					dark:bg-gray-800 
					rounded-xl 
					p-3 
					mx-3
				`}>
				{title && <h2 className={'font-light text-gray-400 text-2xl'}>{title}</h2>}
				{items?.length
					? <ul>
						{
							items.map(item => (
								<TaskItem key={item.id} item={item} onDone={onItemChange} onInlineSave={onItemChange}
								          onDelete={onItemDelete} filtering={filtering} onContextFilter={onContextFilter}
								          onClearFilter={onClearFilter} filteredValue={filteredValue}/>))
						}
					</ul>
					: (emptyMessage && <p className={"font-light text-gray-400"}>{emptyMessage}</p>)
				}
			</div>
			: null
	);
}

export default TaskList