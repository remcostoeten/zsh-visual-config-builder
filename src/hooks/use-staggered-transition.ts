import { useEffect, useState } from 'react';

export const useStaggeredTransition = <T>(items: T[], staggerDelay = 100) => {
	const [visibleItems, setVisibleItems] = useState<T[]>([]);

	useEffect(() => {
		items.forEach((item, index) => {
			setTimeout(() => {
				setVisibleItems((prev) => [...prev, item]);
			}, index * staggerDelay);
		});

		return () => setVisibleItems([]);
	}, [items, staggerDelay]);

	return visibleItems;
};
