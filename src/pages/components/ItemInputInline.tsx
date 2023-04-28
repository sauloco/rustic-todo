import ItemInput from '@/pages/components/ItemInput';
import React from 'react';

interface ItemInputInlineProps {
	item: Item,
	onSave: (item: Item) => void
}

const ItemInputInline: React.FC<ItemInputInlineProps> = ({item, onSave}) => {
	return <ItemInput item={item} inline onSave={onSave}/>
}

export default ItemInputInline;