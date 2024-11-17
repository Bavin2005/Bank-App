import { Text, View, StyleSheet,TextInput} from "react-native";
import { Link } from "expo-router";
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyD4iapPT4rXMP_CmPe-yIfQm9PVgUcgqkw",
  authDomain: "bank-application-ca249.firebaseapp.com",
  projectId: "bank-application-ca249",
  storageBucket: "bank-application-ca249.appspot.com",
  messagingSenderId: "724398708214",
  appId: "1:724398708214:web:2b7a9f3aef0664f51e23d7"
};
const app = initializeApp(firebaseConfig);

export default function Index() {
  return (
    <View style={styles.main}>
      <View style={styles.container}
    >
      <Text style={styles.text}>Login</Text>
      <TextInput
      style={styles.input}
      placeholder="Username"/>
      <TextInput
      style={styles.input}
      placeholder="Password"/>
      <Link href="/about" style={styles.text}>Sign Up</Link>
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
  container : {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth : 2,
    borderRadius : 5,
    width : 300,
    height : 250,
    backgroundColor : 'skyblue',
  },

  text : {
    fontSize :25,
    color : 'white',
    fontWeight : 'bold', 
  },

  input :{
    margin : 12,
    borderWidth : 2,
    borderRadius : 8,
    width : 150
  }
})
