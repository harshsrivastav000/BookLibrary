import React,{Component} from 'react';
import {
  View,
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';


//screens
import BookShelf from '../Components/book_shelf_screen.js';
import AddBookScreen from '../Components/add_book_screen.js';
import BookDetails from '../Components/book_details.js';

const Stack = () => {
  return (
    <Router>
      <Scene key="root">
        <Scene key="BookShelf"
          component={BookShelf}
          title="Book Shelf"
          initial
        />
        <Scene
          key="AddBookScreen"
          component={AddBookScreen}
          title="Add Book"
        />
        <Scene
          key="BookDetails"
          component={BookDetails}
          title="Book Details"
        />
      </Scene>
    </Router>
  );
}

export default Stack;
