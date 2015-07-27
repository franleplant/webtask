import React from 'react';
import webtaskRunner from '../../index.js';

// Define some useful const
const COLLECTION = 'contacts';
const EMAIL_TO = 'franleplant@gmail.com';
const EMAIL_FROM = 'webtask-contact-form@adomain.com';
const EMAIL_SUBJECT = 'Webtask FTW: you have a new contact request';

// Create the tunner for the given container
const runner = webtaskRunner('wt-franleplant-gmail_com-0');
const mongoInsert = runner('mongodb-insert');
const sendEmail = runner('send-email');

export default class  extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contactName: '',
            contactEmail: '',
            contactMessage: '',
            meta: { loading: false }
        };
    }

    handleSubmit(event) {
        // Prevent default actions
        event.preventDefault();

        // Indicate loading
        this.setState({
            meta: { loading: true }
        })

        let name = this.state.contactName;
        let email = this.state.contactEmail;
        let message = this.state.contactMessage;


        // Create webtasks params
        let mongoInsertParams = {
            webtask_no_cache: 1,
            collection: COLLECTION,
            dataToInsert: {
                email: email,
                name: name,
                message: message
            }
        };

        let sendEmailParams = {
            webtask_no_cache: 1,
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject: EMAIL_SUBJECT,
            message: `You have a received a new contact request from
                        ${name}, ${email}:
                        ${message}
                        `
        };

        // Insert user contact request in mongo
        // and send an email notifying about it
        Promise.all([
            mongoInsert(mongoInsertParams),
            sendEmail(sendEmailParams)
        ])
        .then(() => {
            alert('We have saved your contact request, you will be contacted soon');

            // Finish loading and clean up the form
            this.setState({
                meta: { loading: false },
                contactName: '',
                contactEmail: '',
                contactMessage: ''
            })
        })
        .catch((err) => {
            alert('Something went wrong, please try again');
            this.setState({
                meta: { loading: false }
            })
        })
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <h2>Contact Form</h2>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                required
                                className="form-control"
                                placeholder="Name"
                                value={this.state.contactName}
                                onChange={(event) => { this.setState({contactName: event.target.value})} }
                                />
                        </div>
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                required
                                className="form-control"
                                placeholder="Email"
                                value={this.state.contactEmail}
                                onChange={(event) => { this.setState({contactEmail: event.target.value})} }
                                />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                required
                                className="form-control"
                                rows="3"
                                placeholder="Message"
                                value={this.state.contactMessage}
                                onChange={(event) => { this.setState({contactMessage: event.target.value})} }
                                >
                            </textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-default pull-right"
                            disabled={this.state.meta.loading}
                            >
                            Submit
                            &nbsp; {this.state.meta.loading ? <span className="glyphicon glyphicon-repeat glyphicon-spin"></span> : null}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
