import React,{Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';

import dismissKeyboard from 'react-native-dismiss-keyboard';
import Book from '../../library'; //import statement for book library management


export default class BooksDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      author:this.props.book.author,
      publisher:this.props.book.publisher,
      title:this.props.book.title,
      isbn:this.props.book.isbn,
    }
  }

  render() {
    return(
      <View style={styles.viewContainer}>
       <View style={styles.editViewContainer}>
        <View style={styles.textViewContainer}>
         <Text style={styles.textContainer}>Book Title:</Text>
         <TextInput
           style={styles.inputTextContainer}
           placeholder="Title"
           onChangeText={(title) => this.setState({title})}
           value={this.state.title}
           onKeyPress={this.handleKeyDown}
         />
        </View>
        <View style={styles.textViewContainer}>
        <Text style={styles.textContainer}>Book Author:</Text>
        <TextInput
          style={styles.inputTextContainer}
          placeholder="Author"
          onChangeText={(author) => this.setState({author})}
          value={this.state.author}
          onKeyPress={this.handleKeyDown}
        />
        </View>
        <View style={styles.textViewContainer}>
        <Text style={styles.textContainer}>Book Publisher:</Text>
        <TextInput
          style={styles.inputTextContainer}
          placeholder="Publisher"
          onChangeText={(publisher) => this.setState({publisher})}
          value={this.state.publisher}
          onKeyPress={this.handleKeyDown}
        />
        </View>
        <View style={styles.textViewContainer}>
        <Text style={styles.textContainer}>Book ISBN:</Text>
        <Text style={styles.inputTextContainer}>{this.state.isbn}</Text>
        </View>
       </View>
       <TouchableOpacity
         onPress={() => this._updateAction()}>
            <View style={styles.buttonContainer}>
              <Text style={styles.textStyle}>UPDATE</Text>
            </View>
       </TouchableOpacity>
      </View>
    )
  }

//Update button action
  _updateAction=()=>{
    this._updateBook()
  }

  //Retun key action keyboard
 handleKeyDown=(e)=>{
   if(e.nativeEvent.key == "Enter"){
      dismissKeyboard();
   }
 }
  //Update book details method call
  _updateBook = async () => {
    try {
      const isSuccess = await Book.library.getInstance()._updateBookDetails(this.state.author, this.state.publisher, this.state.title, this.state.isbn)
      if (isSuccess == true) {
        Alert.alert('Updated successfully')
        //Refreshing the array in book_shelf_screen
        this.props.pointer._getBooks()
      } else {
        Alert.alert('Something went wrong update not successful')
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong update not successful')
    }
  }


}
const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  editViewContainer :{
     height: '50%',
     backgroundColor: 'white',
     justifyContent: 'space-around',
  },
  textViewContainer: {
    marginLeft: 10,
    marginRight: 10,
    height: 65,
    backgroundColor:'white',
  },
  textContainer: {
    marginLeft: 10,
    fontSize: 15,
    color: 'black',
    height: 15,
  },
  inputTextContainer: {
    marginLeft:10,
    marginTop:5,
    marginRight: 10,
    height: 40,
    padding: 10,
    backgroundColor: "#DDDDDD"
  },
  buttonContainer: {
    marginTop:20,
    height: 50,
    marginLeft: 30,
    marginRight: 30,
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
  },
  textStyle: {
    fontSize: 18,
    color: 'black',
    alignSelf: 'center',
  },
})
