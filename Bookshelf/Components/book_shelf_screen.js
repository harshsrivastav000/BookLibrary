import React,{Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Images from '../Images/images.js'
import { Actions } from 'react-native-router-flux';
import dismissKeyboard from 'react-native-dismiss-keyboard';

import Book from '../../library'; //import statement for book library management


export default class  BookShelf extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataArray:[],
      isSearch: false,
      searchText: '',
      value: 0,
    }

  }

//Called after components are mounted (render())
  componentDidMount(){
    this._getBooks()
  }

//Calling get books method
  _getBooks = async () =>{
    try {
      var bookArray = await Book.library.getInstance()._getBooksFromShelf()
      if (bookArray != null) {
        this.setState({
          dataArray: Array.from(bookArray)
        })
      }
    }catch (error) {
        console.log('error',error);
    }
  }

  render() {
    return (
      <View style = {styles.viewContainer}>
       {this._conditionalRenderForSearch()}
       {this._conditionalRenderForEmptyShelf()}
      <View style = {styles.tableContainer}>

       </View>
      </View>
    )
  }

  _conditionalRenderForEmptyShelf =()=> {
    console.log(this.state.dataArray.length);
    if (this.state.dataArray.length == 0) {
      return(
        <View style={styles.emptyTextContainer}>
         <Text style={styles.emptyText}> No Books Added </Text>
        </View>
      )
    } else {
      return(
        <View>
        <FlatList
         data = {this.state.dataArray}
         keyExtractor ={item => item.isbn}
         renderItem={({item}) =>
         <TouchableOpacity onPress={() => this._onPress(item)}>
          <View style = {styles.rowContainer}>
           <View style = {styles.textContainer}>
             <Text style = {styles.text}>{item.title}</Text>
           </View>
           <TouchableOpacity onPress={() => this._DeleteAction(item)}>
            <View style={styles.deleteButtonContainer}>
              <Image style={styles.Button} source={Images.remove}/>
            </View>
          </TouchableOpacity>
          </View>
         </TouchableOpacity>
          }
         />
         </View>
      )
    }
  }

//Conditional render method for changing UI for search functionality
  _conditionalRenderForSearch = () => {

    if(this.state.isSearch == false) {
      return(
        <View>
        <TouchableOpacity style={styles.addButtonContainer}onPress={this._addButtonAction}>
         <Text> Add Books </Text>
         <Image style={styles.buttonImageContainer} source={Images.add}/>
        </TouchableOpacity>
         <TouchableOpacity style={styles.addButtonContainer}onPress={this._searchMethodAction}>
          <Text> Search Books </Text>
          <Image style={styles.buttonImageContainer} source={Images.search}/>
         </TouchableOpacity>
        </View>
      )
    } else {
      var radio_props = [
       {label: 'Title', value: 0 },
       {label: 'Author', value: 1 },
       {label: 'Publisher', value: 2 },
       {label: 'ISBN', value: 3 },
      ];
      return(
        <View>
         <View style={styles.searchViewContainer}>
         <TextInput
           style={styles.searchTextContainer}
           placeholder="Search"
           onKeyPress={this.handleKeyDown}
           onChangeText={(searchText) => this.setState({searchText})}
           value={this.state.searchText}
         />
         <TouchableOpacity style={styles.searchButtonContainer}onPress={this._searchAction}>
           <Image style={styles.buttonImageContainer} source={Images.search}/>
         </TouchableOpacity>
         <TouchableOpacity style={styles.searchButtonContainer}onPress={this._cancelAction}>
           <Image style={styles.buttonImageContainer} source={Images.cancel}/>
         </TouchableOpacity>
         </View>
         <View style = {styles.radioButtonViewContainer}>
         <RadioForm
         radio_props={radio_props}
         initial={0}
         formHorizontal={true}
         labelHorizontal={false}
         buttonSize={15}
         buttonOuterSize={17}
         onPress={(value) => {this.setState({value:value})}}
         />
         </View>
        </View>
      )
    }
  }

  //return key action keyboard
  handleKeyDown=(e)=>{
    if(e.nativeEvent.key == "Enter"){
       dismissKeyboard();
    }
  }

//Add button aciton
  _addButtonAction =()=> {
    Actions.AddBookScreen({pointer:this})
  }

//Search method button action to toggle search functionality
  _searchMethodAction =()=> {
    if (this.state.isSearch == false) {
      this.setState({
        isSearch : true
      })
    }
  }

//Cancel button action cancels search functionality
  _cancelAction =()=> {
    this.setState({
      isSearch: false
    })
    this._getBooks()
  }

//Select row method action redirects to book_details screen
  _onPress = (data) => {
    Actions.BookDetails({book:data,pointer:this})
  }

//Delete button action
  _DeleteAction = (data) => {
    this._deleteBook(data)
  }

//Calling method to delete book from shelf
  _deleteBook = async (data) =>{
    try {
      const isSuccess = await Book.library.getInstance()._removeBookFromShelf(data)
      if (isSuccess) {
        this._getBooks()
      } else {
        Alert.alert('Something went wrong deletion not successful')
      }
      }catch (error) {
        console.log('error',error);
    }
  }

//Search button action (author, title, publisher, isbn)
  _searchAction = () => {
    switch (this.state.value) {
      case 0:
        this._searchTitle()
        break;
      case 1:
        this._searchAuthor()
        break;
      case 2:
        this._searchPublisher()
        break;
      default:
        this._searchIsbn()
    }
  }

//Calling search author method in library
  _searchAuthor = () => {
    var filterArray = Book.library.getInstance()._searchonBasisofAuthor(this.state.searchText)
    if (filterArray.length == 0)  {
      Alert.alert('No results found')
    } else {
      this.setState({
        dataArray:Array.from(filterArray)
      })
    }
  }

//Calling search publisher method in library
  _searchPublisher = () =>{
    var filterArray = Book.library.getInstance()._searchonBasisofPublisher(this.state.searchText)
    if (filterArray.length == 0)  {
      Alert.alert('No results found')
    } else {
      this.setState({
        dataArray:Array.from(filterArray)
      })
    }
  }

//Calling search isbn method in library
  _searchIsbn = () =>{
    var filterArray = Book.library.getInstance()._searchonBasisofISBN(this.state.searchText)
    if (filterArray.length == 0)  {
      Alert.alert('No results found')
    } else {
      this.setState({
        dataArray:Array.from(filterArray)
      })
    }
  }

  //Calling search title method in library
  _searchTitle = () => {
    var filterArray = Book.library.getInstance()._searchonBasisofTitle(this.state.searchText)
    if (filterArray.length == 0)  {
      Alert.alert('No results found')
    } else {
      this.setState({
        dataArray:Array.from(filterArray)
      })
    }
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  addButtonContainer: {
     alignItems: 'center',
     backgroundColor: '#DDDDDD',
     padding: 10,
     height: 40,
     flexDirection: 'row',
     justifyContent: 'center',
  },
  buttonImageContainer: {
    width: 25,
    height: 25,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  rowContainer: {
    width: '100%',
    height: 40,
    backgroundColor:'#DDDDDD',
    flexDirection: 'row',
  },
  textContainer: {
    marginLeft: 10,
    width: '85%',
    height:35,
    marginTop: 2.5,
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
  },
  deleteButtonContainer: {
    marginTop: 2.5,
    marginRight: 10,
    width: 35,
    height: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  Button : {
   height: 25,
   width: 25,
  },
  searchButtonContainer: {
    height: 35,
    width: 35,
    padding: 5,
  },
  searchViewContainer:{
    width: '100%',
    height: 40,
    backgroundColor:'#DDDDDD',
    flexDirection: 'row',
  },
  radioButtonViewContainer:{
    width: '100%',
    height: 40,
    backgroundColor:'#DDDDDD',
    flexDirection: 'row',
  },
  searchTextContainer: {
    marginTop: 2.5,
    marginLeft: 5,
    padding: 10,
    width: '80%',
    height: 35,
    backgroundColor: 'white',
  },
  emptyTextContainer:{
    marginTop:20,
    justifyContent:'center',
    alignItems: 'center'
  },
  emptyText:{
    fontSize:20,
  },
})
