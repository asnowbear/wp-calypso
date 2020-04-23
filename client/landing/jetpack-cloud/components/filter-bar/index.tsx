/**
 * External dependencies
 */
import { useSelector } from 'react-redux';
import { useTranslate } from 'i18n-calypso';
import React, { FunctionComponent, useEffect, useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import { Button } from '@automattic/components';
import ActivityTypeSelector from './activity-type-selector';
import {
	getRequestActivityActionTypeCountsId,
	requestActivityActionTypeCounts,
} from 'state/data-getters';
import { getHttpData } from 'state/data-layer/http-data';
/**
 * Style dependencies
 */
import './style.scss';

interface Filter {
	group?: string[];
	after?: string;
	before?: string;
	page: number;
}

interface ActivityCount {
	count: number;
	key: string;
	name: string;
}

interface Props {
	siteId: number;
	// group?: string[];
	filter: Filter;
	onFilterChange: ( newFilter: Filter ) => void;
	showActivityTypeSelector?: boolean;
	showDateRangeSelector?: boolean;
}

const FilterBar: FunctionComponent< Props > = ( {
	siteId,
	filter,
	showActivityTypeSelector = true,
	showDateRangeSelector = true,
	onFilterChange,
} ) => {
	const translate = useTranslate();
	const [ isActivityTypeSelectorVisible, setIsActivityTypeSelectorVisible ] = useState( false );
	const [ isDateRangeSelectorVisible, setIsDateRangeSelectorVisible ] = useState( false );

	const activityActionTypeCounts = useSelector< object, ActivityCount[] >(
		() => getHttpData( getRequestActivityActionTypeCountsId( siteId, filter ) ).data
	);

	const toggleIsActivityTypeSelectorVisible = () => {
		setIsDateRangeSelectorVisible( false );
		setIsActivityTypeSelectorVisible( ! isActivityTypeSelectorVisible );
	};

	const closeActivityTypeSelector = () => {
		setIsActivityTypeSelectorVisible( false );
	};

	const toggleIsDateRangeSelectorVisible = () => {
		setIsActivityTypeSelectorVisible( false );
		setIsDateRangeSelectorVisible( ! isDateRangeSelectorVisible );
	};

	const activityTypeButtonRef = useRef< Button >( null );
	const dateRangeButtonRef = useRef< Button >( null );

	// const closeDateRangeSelector = () => {
	// 	setIsDateRangeSelectorVisible( false );
	// };

	// when the filter changes re-request the activity counts
	// the activity counts only use the date values, but the underlying data layer handles unnecessary re-requests via freshness
	useEffect( () => {
		requestActivityActionTypeCounts( siteId, filter );
	}, [ filter, siteId ] );

	const render = () => (
		<>
			<p>{ translate( 'Filter by:' ) }</p>
			{ showActivityTypeSelector && (
				<>
					<Button
						className={
							isActivityTypeSelectorVisible ? 'filter-bar__button-active' : 'filter-bar__button'
						}
						compact
						onClick={ toggleIsActivityTypeSelectorVisible }
						ref={ activityTypeButtonRef }
					>
						{ translate( 'Activity type' ) }
					</Button>
					<ActivityTypeSelector
						isVisible={ isActivityTypeSelectorVisible }
						onClose={ closeActivityTypeSelector }
						activityCounts={ activityActionTypeCounts }
						onGroupsChange={ ( newGroups ) =>
							onFilterChange( {
								...filter,
								group: newGroups.length > 0 ? newGroups : undefined,
							} )
						}
						groups={ filter.group || [] }
						context={ activityTypeButtonRef }
					/>
				</>
			) }
			{ showDateRangeSelector && (
				<Button
					className={
						isDateRangeSelectorVisible ? 'filter-bar__button-active' : 'filter-bar__button'
					}
					compact
					onClick={ toggleIsDateRangeSelectorVisible }
					ref={ dateRangeButtonRef }
				>
					{ translate( 'Date range' ) }
				</Button>
			) }
		</>
	);

	return <div className="filter-bar">{ activityActionTypeCounts && render() }</div>;
};

export default FilterBar;