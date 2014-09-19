define(['datepicker'], function (DatePicker) {

    return React.createClass({
        getInitialState: function () {
            return {
                startDate: new Date(),
                endDate: new Date()
            };
        },

        render: function () {


            return React.DOM.div({
                children: [
                    React.DOM.input({
                        type: 'text'
                    }),
                    DatePicker({
                        receiveStartDate: this.receiveStartDate,
                        receiveEndDate: this.receiveEndDate,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate
                    })
                ]
            });
        },

        receiveStartDate: function (date) {
            this.setState({
                startDate: date
            });
        },

        receiveEndDate: function (date) {
            this.setState({
                endDate: date
            });
        }
    })
});