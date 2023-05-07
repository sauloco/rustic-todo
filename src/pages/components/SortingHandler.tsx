import React, {useEffect, useState} from 'react';
import {DEFAULT_SORTING_TYPE, SupportedSortingMethods} from '@/utils/sort';
import {SortingMethod, SupportedSortingTypes} from '@/types';

interface SortingHandlerProps {
	onChange: (method: SortingMethod) => void,
}

const SortingHandler: React.FC<SortingHandlerProps> = ({onChange}) => {
	const [selectedMethodName, setSelectedMethodName] = useState(DEFAULT_SORTING_TYPE);
	const methods = SupportedSortingMethods;


	useEffect(() => {
		const selectedMethod = SupportedSortingMethods[selectedMethodName];
		onChange(selectedMethod);
	}, [selectedMethodName, onChange])

	const selectNextMethod = () => {
		const methodsLabels = Object.keys(methods).filter(m => m !== SupportedSortingTypes.Custom) as SupportedSortingTypes[]
		const currentIdx = methodsLabels.indexOf(selectedMethodName);
		const nextMethod = currentIdx === methodsLabels.length - 1 ? methodsLabels[0] : methodsLabels[currentIdx + 1];
		setSelectedMethodName(nextMethod)
	}


	return (
		<div className={'w-100 pr-3 mx-3 text-right text-xs text-gray-500'} onClick={selectNextMethod}>
			Sorted&nbsp;
			<span className={'underline cursor-pointer'}>{selectedMethodName}</span>
		</div>
	)
}

export default SortingHandler