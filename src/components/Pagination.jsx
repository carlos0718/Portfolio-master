import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginationComponent = ({numpages, currentPage, onPageChange}) => {
	const renderPaginationItems = () => {
		const items = [];
		for (let number = 1; number <= numpages; number++) {
			items.push(
				<Pagination.Item key={number} active={number === currentPage} onClick={() => onPageChange(number)}>
					{number}
				</Pagination.Item>
			);
		}
		return items;
	};

	return (
		<div>
			<Pagination>
				<Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
				{renderPaginationItems()}
				<Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === numpages} />
			</Pagination>
		</div>
	);
};

export default PaginationComponent;
