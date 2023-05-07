import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFilter, faThumbtack} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {Item} from '@/types';

interface ContextFilterProps {
	filterProperty: keyof Item,
	filterValue?: any,
	prefix?: string,
	onFilter: (prop: keyof Item, value: any) => void,
	onClearFilter: () => void,
	pinned: boolean,
}

const ContextFilter: React.FC<ContextFilterProps> = ({
	                                                     filterProperty,
	                                                     filterValue,
	                                                     onFilter,
	                                                     onClearFilter,
	                                                     prefix,
	                                                     pinned = false,
                                                     }) => {
	return <button
		className="text-xs inline-flex items-center font-bold leading-sm px-2 py-1 bg-blue-200 text-blue-700 rounded-full group"
		title={`Only show ${filterValue || 'this'} context`}
		onClick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			if (pinned) {
				onClearFilter();
			} else {
				onFilter(filterProperty, filterValue)
			}
		}}
	>
		{`${prefix ? `${prefix} ` : ''}${filterValue}`}
		{pinned
			? <span>&nbsp;<FontAwesomeIcon icon={faThumbtack}/></span>
			: <span className={'hidden group-hover:inline'}>&nbsp;<FontAwesomeIcon icon={faFilter}/></span>
		}
	</button>;
}

export default ContextFilter