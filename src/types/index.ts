export interface Item {
	id: string,
	title: string,
	description?: string,
	done: boolean,
	deleted: boolean,
	createdAt?: number,
	goalAt?: number,
	completedAt?: number,
	location?: string,
	people?: string[],
	flag?: boolean,
	ai: boolean,
	prompt?: string
	promptDescription?: string,
}

export enum SupportedSortingTypes {
	Custom = 'custom',
	goalAt = 'by goal date ↓',
	goalAtDesc = 'by goal date ↑',
	completedAt = 'by completion date ↓',
	completedAtDesc = 'by completion date ↑',
	createdAt = 'by creation date ↓',
	createdAtDesc = 'by creation date ↑',
}

export type SortingMethod = (a: Item, b: Item) => number

export interface SupportedSortingInterface extends Record<SupportedSortingTypes, SortingMethod> {
}

export interface ItemsByStatus {
	done?: Item[],
	pending?: Item[],
	deleted?: Item[],
	all?: Item[]
}