import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Book from '../../library';
import dismissKeyboard from 'react-native-dismiss-keyboard';

export default class AddBookScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      book_title: "",
      author: "",
      published_by: ""
    }
  }

  render() {
    return (
      <View style = {styles.viewContainer}>
       <View style = {styles.TextView}>
       <TextInput
         style={styles.TextInputView}
         placeholder="Title"
         onChangeText={(book_title) => this.setState({book_title})}
         onKeyPress={this.handleKeyDown}
         value={this.state.book_title}
       />
       <TextInput
         style={styles.TextInputView}
         placeholder="Author"
         onChangeText={(author) => this.setState({author})}
         onKeyPress={this.handleKeyDown}
         value={this.state.author}
       />
       <TextInput
         style={styles.TextInputView}
         placeholder="Publisher"
         onChangeText={(published_by) => this.setState({published_by})}
         onKeyPress={this.handleKeyDown}
         value={this.state.published_by}
       />
       </View>
       <TouchableOpacity
         onPress={() => this._addAction()}>
            <View style={styles.ButtonContainer}>
              <Text style={styles.textStyle}>ADD BOOK</Text>
            </View>
       </TouchableOpacity>
      </View>
    )
  }

  //return key action keyboard
  handleKeyDown=(e)=>{
      if(e.nativeEvent.key == "Enter"){
         dismissKeyboard();
      }
  }
//add button action
  _addAction=()=>{
    this._addBook()
  }

  //add book method call
  _addBook = async () => {
    try {
      const isSuccess = await Book.library.getInstance()._addBooksToShelf(this.state.book_title, this.state.author, this.state.published_by)
      if (isSuccess == true) {
        Alert.alert('Added successfully')
        //Refreshing the array in book_shelf_screen
        this.props.pointer._getBooks()
      } else {
        Alert.alert('Something went wrong saving not successful')
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong saving not successful')
    }
  }

}
const styles = StyleSheet.create({
  viewContainer:{
    flex: 1,
    backgroundColor: 'white',
  },
  TextView :{
     height: '40%',
     backgroundColor: '#DDDDDD',
     justifyContent: 'space-around',
   },
   TextInputView:{
     height: 50,
     backgroundColor: 'white',
     padding: 10,
     marginLeft: 10,
     marginRight: 10,
   },
   ButtonContainer: {
     marginTop:20,
     height: 50,
     marginLeft: 30,
     marginRight: 30,
     backgroundColor: '#DDDDDD',
     justifyContent: 'center',
   },
   textStyle: {
     fontSize: 18,
     color: 'black',
     alignSelf: 'center',
   },
})
