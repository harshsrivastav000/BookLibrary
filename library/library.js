import React, {Component} from 'react';
import { AsyncStorage } from 'react-native';
import Keys from './keys.js';


export default class Library extends Component {

//Creating instance for Library Class
  static sharedInstance = null;
  static getInstance() {
       if (this.sharedInstance == null) {
           this.sharedInstance = new Library();
       }
       return this.sharedInstance;
   }

  constructor(props) {
    super(props)
    this.state = {
       bookArray:[]
    }
  }

//adding book in shelf Prams(title , author, publisher) ISBN is auto generated
//returns boolean value
  _addBooksToShelf = async (title,author,publisher) =>{
    finalBookData = {
      'title': title,
      'isbn': this.getISBN(),
      'author': author,
      'publisher': publisher
    }
    this.state.bookArray.push(finalBookData)
    try {
       const isSuccess = await this._saveBooksInShelf();
       if (isSuccess == true) {
         return true
       } else {
         return false
       }
    } catch (error) {
       console.log('error',error);
       return false
    }
  }

//Method to fetch book data from Async storage
  _fetchBookFromStorage = async () =>{
    try {
      const value = await AsyncStorage.getItem(Keys.bookDetails);
        if (value !== null){
          this.state.bookArray = JSON.parse(value);
          return true
        }
      } catch (error) {
        console.log('error',error);
        return false
      }
  }

//Method to save books in Async Storage
  _saveBooksInShelf = async () => {
    try {
       await AsyncStorage.setItem(Keys.bookDetails, JSON.stringify(this.state.bookArray));
       return true
    } catch (error) {
       console.log('error',error);
       return false
    }
  }

//Method to retreive book from shelf return Array of book details
  _getBooksFromShelf = async () =>{
    try {
      var isSuccess = await this._fetchBookFromStorage()
      if (isSuccess == true) {
        return this.state.bookArray
      }
    }catch (error) {
        console.log('error',error);
        return null
    }
  }

//Method to remove book from shelf param bookdata (details)
//return boolean value
  _removeBookFromShelf = async (bookData) => {
    var index = this.state.bookArray.findIndex(o => o.isbn == bookData.isbn)
    this.state.bookArray.splice(index, 1);
    try {
       const isSuccess = await this._saveBooksInShelf();
       if (isSuccess == true) {
         return true
       } else {
         return false
       }
    } catch (error) {
       console.log('error',error);
       return false
    }
  }

//Method to edit/update book details at particular index Param (author, publisher, title , isbn)
//return boolean value
  _updateBookDetails = async (author, publisher, title, isbn) => {
    var index = this.state.bookArray.findIndex(o => o.isbn == isbn)
    this.state.bookArray[index].title = title
    this.state.bookArray[index].author = author
    this.state.bookArray[index].publisher = publisher

    try {
       const isSuccess = await this._saveBooksInShelf();
       if (isSuccess == true) {
         return true
       } else {
         return false
       }
    } catch (error) {
       console.log('error',error);
       return false
    }

  }

//Generate ISBN automatically
  getISBN=()=> {
  return "ISBN" + '-' + this.digits() + '-' + this.digits() + '-' + this.digits();
  }
  digits=()=> {
    return Math.floor(1000 + Math.random() * 9000);
  }

//Search Module Methods

//Search books for a particular title param (booktitle)
//return array of books with common book title
  _searchonBasisofTitle=(booktitle)=> {
    const result = this.state.bookArray.filter(data => data.title == booktitle);
    return result
  }

  //Search books for a particular Author param (bookauthor)
  //return array of books with common book title
  _searchonBasisofAuthor=(bookauthor)=> {
    const result = this.state.bookArray.filter(data => data.author == bookauthor);
    return result
  }

  //Search books for a particular title param (bookpublisher)
  //return array of books with common book title
  _searchonBasisofPublisher=(bookpublisher)=> {
    const result = this.state.bookArray.filter(data => data.publisher == bookpublisher);
    return result
  }

  //Search books for a particular title param (bookISBN)
  //return array of books with common book title
  _searchonBasisofISBN=(bookISBN)=> {
    const result = this.state.bookArray.filter(data => data.isbn == bookISBN);
    return result
  }


}
