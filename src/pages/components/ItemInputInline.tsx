import {ItemInput} from '@/pages/components/ItemInput';

interface ItemInputInlineProps {
	item: Item,
	onSave: (item: Item) => void
}

export const ItemInputInline = ({item, onSave}: ItemInputInlineProps) => {
	return <ItemInput item={item} inline onSave={onSave}/>
}