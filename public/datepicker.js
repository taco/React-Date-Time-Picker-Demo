define(function () {
	var months = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ];

	var days = [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                ];

	var addDay = function (date, days) {
		var ret = new Date();

		ret.setDate(date.getDate() + days || 1);

		return ret;
	};

	var isSameDay = function (date1, date2) {
		if (!date1 || !date2) return false;
		return date1.getMonth() === date2.getMonth() && date1.getYear() === date2.getYear() && date1.getDate() === date2.getDate();
	};

	var DayHeader = React.createClass({
		render: function () {
			var day = days[this.props.day].substr(0, 1);

			return React.DOM.div({
				className: 'day day-header',
				children: day
			});
		}
	});

	var Day = React.createClass({
		getDefaultProps: function () {
			return {
				date: new Date(),
				current: false,
				receiveStartDate: function () {},
				receiveEndDate: function () {}
			}
		},

		getInitialState: function () {
			return {
				selected: this.isSelected()
			}
		},

		render: function () {
			var className = 'day';

			if (this.props.current) className += ' current';

			if (this.isSelected()) className += ' selected';

			if (isSameDay(this.props.startDate, this.props.date)) className += ' start';

			if (isSameDay(this.props.endDate, this.props.date)) className += ' end';

			return React.DOM.div({
				className: className,
				children: this.props.date.getDate(),
				onClick: this.handleClick
			})
		},

		handleClick: function (e) {
			if (this.isSelected()) {
				if (isSameDay(this.props.date, this.props.startDate)) {
					this.props.receiveStartDate(this.props.endDate);
				} else if (isSameDay(this.props.date, this.props.endDate)) {
					this.props.receiveEndDate(this.props.startDate);
				} else {
					this.props.receiveStartDate(this.props.date);
					this.props.receiveEndDate(this.props.date);
				}

			} else if (this.props.date < this.props.startDate) {
				this.props.receiveStartDate(this.props.date);
			} else {
				this.props.receiveEndDate(this.props.date);
			}
		},

		isSelected: function () {
			return ((this.props.date >= this.props.startDate && this.props.date <= this.props.endDate) || isSameDay(this.props.startDate, this.props.date) || isSameDay(this.props.endDate, this.props.date));
		}
	});

	var Month = React.createClass({
		getDefaultProps: function () {
			return {
				startDate: new Date(),
				endDate: new Date(),
				month: 0,
				year: 2014,
				receiveStartDate: function () {},
				receiveEndDate: function () {}
			}
		},

		render: function () {
			var date = new Date(this.props.year + '-' + (this.props.month + 1) + '-1'),
				offset = date.getDay(),
				items = [],
				counter = 0,
				i;

			for (i = 0; i < days.length; i++) {
				items.push(DayHeader({
					day: i
				}))
			}

			date.setDate(date.getDate() - offset)

			while ((this.props.month !== 11 && (date.getMonth() <= this.props.month || date.getFullYear() < this.props.year)) || (this.props.month === 11 && date.getMonth() !== 0)) {
				items.push(Day({
					date: new Date(date.getTime()),
					current: date.getMonth() === this.props.month,
					startDate: this.props.startDate,
					endDate: this.props.endDate,
					receiveStartDate: this.props.receiveStartDate,
					receiveEndDate: this.props.receiveEndDate,
				}));
				date.setDate(date.getDate() + 1)
			}

			while (date.getDay() !== 0) {
				items.push(Day({
					date: new Date(date.getTime()),
					startDate: this.props.startDate,
					endDate: this.props.endDate,
					receiveStartDate: this.props.receiveStartDate,
					receiveEndDate: this.props.receiveEndDate,
				}));
				date.setDate(date.getDate() + 1)
			}

			return React.DOM.div({
				className: 'month',
				children: items
			});
		}
	});

	var TimePicker = React.createClass({
		getDefaultProps: function () {
			return {
				date: new Date(),
				receiveDate: function () {},
				mode: '',
				timeMode: '',
				changeMode: function () {}
			};
		},

		getInitialState: function () {
			return {
				mode: 'time'
			}
		},

		render: function () {
			var className = 'date-picker-page-time ' + this.props.mode;

			if (this.props.timeMode !== this.props.mode) className += ' hidden';

			return React.DOM.div({
				className: className,
				children: [
                                React.DOM.div({
						className: 'label',
						children: this.props.timeMode === 'start-time' ? 'Start Time' : 'End Time'
					}),
                                React.DOM.div({
						className: 'date-time-container' + (this.state.mode !== 'time' ? ' hidden ' : ''),
						children: [
                                        React.DOM.i({
								className: 'fa fa-angle-up',
								onClick: this.handleClickUpHour
							}),
                                        React.DOM.div(),
                                        React.DOM.i({
								className: 'fa fa-angle-up',
								onClick: this.handleClickUpMinute
							}),
                                        React.DOM.span({
								children: [this.props.date.getHours()],
								onClick: this.handleClickHour
							}),
                                        React.DOM.div({
								children: [':']
							}),
                                        React.DOM.span({
								children: [this.props.date.getMinutes()],
								onClick: this.handleClickMinute
							}),
                                        React.DOM.i({
								className: 'fa fa-angle-down',
								onClick: this.handleClickDownHour
							}),
                                        React.DOM.div(),
                                        React.DOM.i({
								className: 'fa fa-angle-down',
								onClick: this.handleClickDownMinute
							}),
                                    ],
					}),
                                HourPicker({
						mode: this.state.mode,
						hour: this.props.date.getHours(),
						updateTime: this.updateTime,
						changeMode: this.changeMode
					}),
                                MinutePicker({
						mode: this.state.mode,
						minute: this.props.date.getMinutes(),
						updateTime: this.updateTime,
						changeMode: this.changeMode
					}),
                                React.DOM.div({
						className: 'mode-selector',
						children: [
                                        React.DOM.div({
								children: [
                                                React.DOM.i({
										className: 'fa fa-calendar'
									}),
                                                'Date'
                                            ],
							})
                                    ],
						onClick: this.handleClickDate
					})
                            ]
			});
		},

		changeMode: function (mode) {
			this.setState({
				mode: mode
			});
		},

		handleClickHour: function () {
			this.setState({
				mode: 'hours'
			})
		},

		handleClickMinute: function () {
			this.setState({
				mode: 'minutes'
			})
		},

		handleClickUpHour: function () {
			var hours = this.props.date.getHours() + 1;

			if (hours > 23) hours = 0;

			this.updateTime(hours);
		},

		handleClickUpMinute: function () {
			var minutes = this.props.date.getMinutes() + 1;

			if (minutes > 59) minutes = 0;

			this.updateTime(null, minutes);
		},

		handleClickDownHour: function () {
			var hours = this.props.date.getHours() - 1;

			if (hours < 0) hours = 23;

			this.updateTime(hours);

		},

		handleClickDownMinute: function () {
			var minutes = this.props.date.getMinutes() - 1;

			if (minutes < 0) minutes = 59;

			this.updateTime(null, minutes);
		},

		handleClickDate: function () {
			this.props.changeMode('date');
		},

		updateTime: function (hours, minutes) {
			var date = new Date(this.props.date.getTime());

			if (typeof hours !== 'number') hours = this.props.date.getHours();

			if (typeof minutes !== 'number') minutes = this.props.date.getMinutes();

			date.setHours(hours);
			date.setMinutes(minutes);

			this.props.receiveDate(date);
		}
	});

	var HourPicker = React.createClass({
		getDefaultProps: function () {
			return {
				hour: 0
			};
		},

		render: function () {
			var children = [],
				i;

			children.push(React.DOM.div({
				className: 'label',
				children: 'Hours'
			}));

			for (i = 0; i < 24; i++) {
				children.push(React.DOM.div({
					children: i,
					className: i === this.props.hour ? 'selected' : '',
					onClick: this.handleClickHour.bind(this, i)
				}));
			}

			return React.DOM.div({
				className: 'hour-picker picker-selector ' + (this.props.mode !== 'hours' ? 'hidden' : ''),
				children: children
			});
		},

		handleClickHour: function (hour, e) {
			this.props.updateTime(hour);
			this.props.changeMode('time');
		}
	});

	var MinutePicker = React.createClass({
		getDefaultProps: function () {
			return {
				minute: 0
			};
		},

		render: function () {
			var children = [],
				i;

			children.push(React.DOM.div({
				className: 'label',
				children: ['Minutes']
			}));

			for (i = 0; i < 60; i += 3) {
				children.push(React.DOM.div({
					children: i,
					className: i === this.props.minute ? 'selected' : '',
					onClick: this.handleClickMinute.bind(this, i)
				}));
			}

			return React.DOM.div({
				className: 'minute-picker picker-selector ' + (this.props.mode !== 'minutes' ? 'hidden' : ''),
				children: children
			});
		},

		handleClickMinute: function (minute, e) {
			this.props.updateTime(null, minute);
			this.props.changeMode('time');
		}
	});

	var MonthPicker = React.createClass({
		getDefaultProps: function () {
			return {
				month: 0,
				year: 2014,
				hidden: true,
				changeYear: function () {},
				changeMonth: function () {},
				changeMode: function () {}
			}
		},

		render: function () {
			var children = [],
				i;

			for (i = 0; i < 12; i++) {
				children.push(React.DOM.div({
					className: this.props.month === i ? 'selected' : '',
					children: months[i].substr(0, 3),
					onClick: this.handleClickMonth.bind(this, i)
				}));
			}

			return React.DOM.div({
				className: this.props.hidden ? 'hidden' : '',
				children: [
                                React.DOM.div({
						className: 'date-picker-header',
						children: [
                                        React.DOM.i({
								className: 'fa fa-angle-left',
								onClick: this.handlePreviousOnClick
							}),
                                        React.DOM.span({
								children: this.props.year
							}),
                                        React.DOM.i({
								className: 'fa fa-angle-right',
								onClick: this.handleNextOnClick
							})
                                    ]
					}),
                                React.DOM.div({
						className: 'month-picker picker-selector',
						children: children
					}),
                                React.DOM.div({
						className: 'mode-selector',
						children: [
                                        React.DOM.div({
								children: [
                                                React.DOM.i({
										className: 'fa fa-calendar'
									}),
                                                'Date'
                                            ],
							})
                                    ],
						onClick: this.handleClickDate
					})
                            ]
			});
		},

		handlePreviousOnClick: function () {
			this.props.changeYear(this.props.year - 1);
		},

		handleNextOnClick: function () {
			this.props.changeYear(this.props.year + 1);
		},

		handleClickMonth: function (month) {
			this.props.changeMonth(month);
			this.props.changeMode('date');
		},

		handleClickDate: function () {
			this.props.changeMode('date');
		}
	});

	return React.createClass({
		getDefaultProps: function () {
			return {
				startDate: new Date(),
				endDate: new Date(),
				receiveStartDate: function () {},
				receiveEndDate: function () {}
			};
		},

		getInitialState: function () {
			return {
				month: this.props.startDate.getMonth(),
				year: this.props.startDate.getFullYear(),
				mode: 'date',
				previousMode: 'date'
			};
		},

		render: function () {
			var props = {
				startDate: this.props.startDate,
				endDate: this.props.endDate,
				month: this.state.month,
				year: this.state.year,
				receiveStartDate: this.props.receiveStartDate,
				receiveEndDate: this.props.receiveEndDate
			};

			return React.DOM.div({
				className: 'date-picker',
				children: [
                                this.buildDate(props),
                                this.buildTime(props, 'start-time'),
                                this.buildTime(props, 'end-time'),
                                MonthPicker({
						hidden: this.state.mode !== 'month',
						changeMode: this.changeMode,
						changeYear: this.changeYear,
						changeMonth: this.changeMonth,
						year: this.state.year,
						month: this.state.month
					})
                            ]
			});
		},

		buildDate: function (props) {
			var className = 'date-picker-page-date';

			if (this.state.mode !== 'date') className += ' hidden';

			return React.DOM.div({
				className: className,
				children: [
                                React.DOM.div({
						className: 'date-picker-header',
						children: [
                                        React.DOM.i({
								className: 'fa fa-angle-left',
								onClick: this.handlePreviousOnClick
							}),
                                        React.DOM.span({
								children: months[this.state.month] + ' ' + this.state.year,
								onClick: this.handleClickMonth
							}),
                                        React.DOM.i({
								className: 'fa fa-angle-right',
								onClick: this.handleNextOnClick
							})
                                    ]
					}),
                                Month(props),
                                React.DOM.div({
						className: 'mode-selector',
						children: [
                                        React.DOM.div({
								children: [
                                                React.DOM.i({
										className: 'fa fa-clock-o '
									}),
                                                'Start'
                                            ],
								onClick: this.handleClickStart
							}),
                                        React.DOM.div({
								children: [
                                                React.DOM.i({
										className: 'fa fa-clock-o '
									}),
                                                'End'
                                            ],
								onClick: this.handleClickEnd
							})
                                    ]
					})
                            ]
			});
		},

		buildTime: function (props, mode) {
			return TimePicker({
				date: (mode === 'start-time') ? props.startDate : props.endDate,
				receiveDate: (mode === 'start-time') ? props.receiveStartDate : props.receiveEndDate,
				timeMode: mode,
				mode: this.state.mode,
				changeMode: this.changeMode
			});
		},

		changeYear: function (year) {
			this.setState({
				year: year
			});
		},

		changeMonth: function (month) {
			this.setState({
				month: month
			});
		},

		changeMode: function (mode) {
			if (!mode) {
				this.previousMode();
				return;
			}
			this.setState({
				previousMode: this.state.mode
			});
			this.setState({
				mode: mode
			});
		},

		previousMode: function () {
			this.changeMode(this.previousMode);
		},

		handleClickStart: function (e) {
			this.changeMode('start-time');
		},

		handleClickEnd: function (e) {
			this.changeMode('end-time');
		},

		handlePreviousOnClick: function (e) {
			var month = this.state.month - 1,
				year = this.state.year;

			if (month < 0) {
				month = 11;
				year--;
			}

			this.setState({
				month: month,
				year: year
			});
		},

		handleNextOnClick: function (e) {
			var month = this.state.month + 1,
				year = this.state.year;

			if (month > 11) {
				month = 0;
				year++;
			}

			this.setState({
				month: month,
				year: year
			});
		},

		handleClickMonth: function () {
			this.changeMode('month');
		}
	});
});