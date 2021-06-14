import React from 'react';

class Home extends React.Component {
  constructor(props){
    super(props);
      this.state = {Contacts:[],activeItem:{id:null,name:'',email:'',Number:''},update:false,}
      this.getContacts = this.getContacts.bind(this)
      this.NameChange = this.NameChange.bind(this)
      this.EmailChange = this.EmailChange.bind(this)
      this.NumberChange = this.NumberChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.getCookie = this.getCookie.bind(this)
      this.Updating = this.Updating.bind(this)
      this.deleteItem = this.deleteItem.bind(this)
  };

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentWillMount(){
    this.getContacts()
  }

  getContacts(){
    fetch('http://127.0.0.1:8000/contacts/contacts-list/')
    .then(response => response.json())
    .then(data => 
      this.setState({
        Contacts:data
      })
      )
  }

  NameChange(e){
    var name = e.target.name
    var value = e.target.value

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        name:value,
      }
    })
  }
  EmailChange(e){
    var name = e.target.name
    var value = e.target.value

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        email:value,

      }
    })
  }
  NumberChange(e){
    var name = e.target.name
    var value = e.target.value

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        Number:value,

      }
    })
  }


  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')

    var url = 'http://127.0.0.1:8000/contacts/contacts-create/'

    if(this.state.update == true){
      url = `http://127.0.0.1:8000/contacts/contacts-update/${ this.state.activeItem.id}/`
      this.setState({
        editing:false
      })
    }

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response)  => {
        this.getContacts()
        this.setState({
           activeItem:{
        }
        })
    }).catch(function(error){
      console.log('ERROR:', error)
    })

  }

  Updating(contact){
    console.log(contact)
    this.setState({
      activeItem:contact,
      update:true,
    })
  }


  deleteItem(contact){
    var csrftoken = this.getCookie('csrftoken')
    fetch(`http://127.0.0.1:8000/contacts/contacts-delete/${contact.id}/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((response) =>{

      this.getContacts()
    })
  }


  render(){
    var contacts = this.state.Contacts
    var self = this
    return(
        <div className="container">

          <div>
              <div>
                 <form onSubmit={this.handleSubmit}>
                    <div className="flex-wrapper">
                            <input onChange={this.NameChange} className="form-control" id="title" value={this.state.activeItem.name} type="text" name="title" placeholder="Contacts Name" />
                            <input onChange={this.EmailChange} className="form-control" id="title" value={this.state.activeItem.email} type="text" name="title" placeholder="Contacts Email" />
                            <input onChange={this.NumberChange} className="form-control" id="title" value={this.state.activeItem.Number} type="text" name="title" placeholder="Contacts Number" />
                            <input id="submit" type="submit" name="Add" />

                      </div>
                </form>
             
              </div>

              <div  id="list-wrapper">         
                    {contacts.map(function(contact, index){
                      return(
                          <div key={index} className="contacts flex-wrapper">
                                <div>
                                        <h1>{contact.name}</h1>
                                        <p>{contact.email}</p>
                                        <p>{contact.Number}</p>

                                        <button onClick={() => self.Updating(contact)}>Edit</button>

                                        <button onClick={() => self.deleteItem(contact)}>Delete</button>
                                </div>
                          </div>
                        )
                    })}
              </div>
          </div>
          
        </div>
      )
  }
}



export default Home;