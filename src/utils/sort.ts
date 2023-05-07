import {SupportedSortingInterface, SupportedSortingTypes} from '@/types';

export const DEFAULT_SORTING_TYPE = SupportedSortingTypes.createdAt

const dateOrNow = (date: number | undefined) => date || Date.now()
export const SupportedSortingMethods: SupportedSortingInterface = {
	[SupportedSortingTypes.Custom]: (a, b) => (1),
	[SupportedSortingTypes.completedAt]: (a, b) => dateOrNow(a.completedAt) <= dateOrNow(b.completedAt) ? -1 : 1,
	[SupportedSortingTypes.completedAtDesc]: (a, b) => dateOrNow(a.completedAt) <= dateOrNow(b.completedAt) ? 1 : -1,
	[SupportedSortingTypes.createdAt]: (a, b) => dateOrNow(a.createdAt) <= dateOrNow(b.createdAt) ? -1 : 1,
	[SupportedSortingTypes.createdAtDesc]: (a, b) => dateOrNow(a.createdAt) <= dateOrNow(b.createdAt) ? 1 : -1,
	[SupportedSortingTypes.goalAt]: (a, b) => dateOrNow(a.goalAt) <= dateOrNow(b.goalAt) ? -1 : 1,
	[SupportedSortingTypes.goalAtDesc]: (a, b) => dateOrNow(a.goalAt) <= dateOrNow(b.goalAt) ? -1 : 1,
}