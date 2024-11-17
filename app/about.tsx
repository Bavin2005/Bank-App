import { Text, View, StyleSheet, TextInput} from 'react-native';
import { Link } from "expo-router";
import { initializeApp } from '@firebase/app';
//import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyD4iapPT4rXMP_CmPe-yIfQm9PVgUcgqkw",
  authDomain: "bank-application-ca249.firebaseapp.com",
  projectId: "bank-application-ca249",
  storageBucket: "bank-application-ca249.appspot.com",
  messagingSenderId: "724398708214",
  appId: "1:724398708214:web:2b7a9f3aef0664f51e23d7"
};
const app = initializeApp(firebaseConfig);

//const auth = ({email,setEmail,password,setpassword,isLogin,setIsLogin,handleAuthentication})

export default function AboutScreen() {
  return (
    <View style={styles.main}>
      <View style={styles.container}>
      <Text style={styles.text}>Sign Up</Text>
      <TextInput
      style={styles.input}
      placeholder="Name"/>
      <TextInput
      style={styles.input}
      placeholder="Email"/>
      <TextInput
      style={styles.input}
      placeholder="Password"/>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main : {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth : 2,
    borderRadius : 5,
    width : 310,
    height : 270,
    backgroundColor : 'skyblue',
  },
  text: {
    color: 'black',
  },

  input :{
    margin : 12,
    borderWidth : 2,
    borderRadius : 8,
    width : 150
  }
});
