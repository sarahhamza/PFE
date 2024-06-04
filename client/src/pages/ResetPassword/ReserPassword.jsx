import React , {Component} from 'react';
import './ResetPass.css';
import { BASE_URL }  from '../../config';

export default class ForgotPassword extends Component {

constructor(props){
    super(props);
    this.state={
        email: "",
    };
    this.handlesubmit =this.handlesubmit.bind(this)
}
    handlesubmit(e) {
        e.preventDefault()
        const { email } = this.state;
        console.log(email);
        fetch(`${BASE_URL}/api/auth/forgot-password`,{
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                email,
            }),
            
        })
        .then((res)=> res.json())
        .then((data)=> {
            console.log(data )
            alert(data.status)
         
        });
    }

    render() {
  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={this.handlesubmit}>
        <h1 className="forgot-password-title">Forgot Password</h1>
        <input
          type="email"
          className="forgot-password-input"
          placeholder="Enter email"
          onChange={(e)=> this.setState({email: e.target.value})}
        />
        <button className="forgot-password-button">Submit</button>
        <a href="#" className="forgot-password-link">Sign Up</a>
      </form>
    </div>
  );
};
}

