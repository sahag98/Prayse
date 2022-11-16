import React, { useState, useEffect } from 'react';
import { Appearance, Text, View, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Container, HeaderView, HeaderTitle, ModalButton2, StyledInput } from '../styles/appStyles';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { firebase } from '../firebase'
import { FlashList } from "@shopify/flash-list";
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading';
import { LinearGradient } from 'expo-linear-gradient';

const Community = ({ navigation: { goBack } }) => {
    const [theme, setTheme] = useState(Appearance.getColorScheme());
    const [todos, setTodos] = useState([])
    const todoRef = firebase.firestore().collection('todos')
    const [addData, setAddData] = useState('')
    const [error, setError] = useState(false)
    const [swearError, setSwearError] = useState(false)

    useEffect(() => {
        todoRef
            .orderBy('createdAt', 'desc', 'likes')
            .onSnapshot(
                querySnapshot => {
                    const todos = []
                    querySnapshot.forEach((doc) => {
                        const { heading } = doc.data()
                        const { likes } = doc.data()
                        const { complete } = doc.data()
                        try {
                            const sec = doc.data().createdAt.seconds
                            const time = new Date(sec * 1000).toLocaleString()
                            todos.push({
                                id: doc.id,
                                heading,
                                date: time,
                                likes: likes,
                                complete: complete,
                            })
                        }
                        catch (error) {
                            console.log(error)
                        }
                    })
                    setTodos(todos)
                }
            )
    }, [])

    const updateTodo = (id) => {
        todoRef
            .doc(id)
            .update({
                likes: firebase.firestore.FieldValue.increment(1)
            })

    }

    const complete = (id) => {
        todoRef
            .doc(id)
            .update({
                complete: true,
            })
    }

    var badwordsArray = require('badwords/array')

    const addTodo = () => {
        if (addData && addData.length > 0) {
            setError(false)
            const foundSwears = badwordsArray.filter(word => addData.toLowerCase().includes(word.toLowerCase()))
            if (foundSwears.length) {
                // setError(true)
                setSwearError(true)
                setAddData('')
                return
            }
            const timestamp = firebase.firestore.FieldValue.serverTimestamp()
            const data = {
                heading: addData,
                createdAt: timestamp,
                likes: 0,
                complete: false,
            }
            todoRef
                .add(data)
                .then(() => {
                    setAddData('')
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error)
                })
        }
        else {
            setError(!error)
            setSwearError(false)
        }

    }

    Appearance.addChangeListener((scheme) => {
        setTheme(scheme.colorScheme)
    })

    let [fontsLoaded] = useFonts({
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
    })

    if (!fontsLoaded) {
        return <AppLoading />
    }

    return (
        <Container style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
            <HeaderView>
                <HeaderTitle
                    style={theme == 'dark' ? { fontFamily: 'Inter-Medium', color: 'white' } :
                        { fontFamily: 'Inter-Medium', color: '#2F2D51', marginBottom: 0 }}>
                    Community
                </HeaderTitle>

            </HeaderView>
            <Text
                style={theme == 'dark' ? { fontFamily: 'Inter-Light', color: 'white', textAlign: 'center', fontSize: 15 } :
                    { fontFamily: 'Inter-Light', color: '#2F2D51', textAlign: 'center', fontSize: 15 }}>
                Welcome to the community! A place to share your prayers with others.Click on the red prayer button to let them know you are praying for them.
            </Text>

            <Text
                style={theme == 'dark' ? { fontFamily: 'Inter-Medium', color: 'white', textAlign: 'left', fontSize: 14, paddingBottom: 10 }
                    : { fontFamily: 'Inter-Medium', color: '#2F2D51', textAlign: 'left', fontSize: 15, paddingBottom: 10 }}>
                If YOUR prayer gets answered let us know by clicking on the check mark that's on your prayer!
            </Text>
            <ModalButton2 style={theme == 'dark' ? { zIndex: 99, backgroundColor: '#7272FF' } : { zIndex: 99, backgroundColor: '#2F2D51' }}>
                <AntDesign name='back' size={40} color={theme == 'dark' ? 'black' : 'white'} onPress={() => goBack()} />
            </ModalButton2>
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                <StyledInput
                    style={theme == 'dark' ? styles.inputDark : styles.input}
                    onChangeText={(heading) => setAddData(heading)}
                    value={addData}
                    placeholder="Add a prayer"
                    placeholderTextColor={'white'}
                    selectionColor={'white'}
                    onSubmitEditing={(e) => { e.key === 'Enter' && e.preventDefault() }}
                    multiline={true}
                />
                <TouchableOpacity style={theme == 'dark' ? styles.buttonDark : styles.button} onPress={addTodo}>
                    <AntDesign name='plus' size={35} color={theme == 'dark' ? 'black' : 'white'} />
                </TouchableOpacity>
            </View>
            {error == true && <Text style={{ fontFamily: 'Inter-Light', fontSize: 13.5, color: '#FE5050', paddingBottom: 10 }}>Type in a prayer and try again.</Text>}
            {swearError == true && <Text style={{ fontFamily: 'Inter-Light', fontSize: 13.5, color: '#FE5050', paddingBottom: 10 }}>Can't have any swear words in a prayer. Try again.</Text>}
            <FlashList
                data={todos}
                estimatedItemSize={30}
                numColumns={1}
                renderItem={({ item }) => (
                    <View style={theme == 'dark' ? styles.listDark : styles.list}>
                        <Text style={theme == 'dark' ? styles.itemHeadingDark : styles.itemHeading}>
                            {item.heading[0].toUpperCase() + item.heading.slice(1)}
                        </Text>
                        <View style={{ alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                            <Text style={theme == 'dark' ? styles.dateDark : styles.date}>
                                {item.date}
                            </Text>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => updateTodo(item.id)}>
                                    <MaterialCommunityIcons name="hands-pray" size={24} color={theme == "dark" ? "#FE5050" : "#AD1616"} />
                                    <Text style={theme == 'dark' ? { paddingLeft: 3, color: '#FE5050' } : { paddingLeft: 3, color: '#AD1616' }}>{item.likes}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {item.complete == false &&
                                        <AntDesign style={{ paddingLeft: 20 }}
                                            onPress={() => complete(item.id)} name="check" size={24} color={theme == "dark" ? "#9C9C9C" : "#4e4a8a"} />}
                                    {item.complete == true &&
                                        <AntDesign style={{ paddingLeft: 20 }} name="check" size={24} color={theme == "dark" ? "green" : "#14641B"} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </Container>
    );
}


export default Community;

const styles = StyleSheet.create({
    itemHeading: {
        fontSize: 18,
        fontFamily: 'Inter-Regular',
        color: '#2F2D51',
        fontSize: 15,
        paddingBottom: 5
    },
    itemHeadingDark: {
        fontFamily: 'Inter-Regular',
        color: 'white',
        fontSize: 15,
        paddingBottom: 5
    },
    input: {
        width: '80%',
        height: 60,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#2F2D51',
        fontSize: 14,
        letterSpacing: 1,
        alignItems: 'center'
    },
    inputDark: {
        width: '80%',
        height: 60,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#212121',
        fontSize: 14,
        letterSpacing: 1,
        alignItems: 'center'
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#2F2D51',
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDark: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: 'white',
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    list: {
        backgroundColor: 'white',
        minHeight: 60,
        width: '100%',
        padding: 15,
        justifyContent: 'space-around',
        marginBottom: 20,
        borderRadius: 10
    },
    listDark: {
        backgroundColor: '#212121',
        minHeight: 60,
        width: '100%',
        padding: 15,
        justifyContent: 'space-around',
        marginBottom: 20,
        borderRadius: 10
    },
    date: {
        fontSize: 10,
        letterSpacing: 1,
        color: '#4e4a8a',
        fontFamily: 'Inter-Bold',
        textTransform: 'uppercase',
        paddingTop: 8,
        textAlign: 'right'
    },
    dateDark: {
        fontSize: 10,
        letterSpacing: 1,
        color: '#8C8C8C',
        fontFamily: 'Inter-Bold',
        textTransform: 'uppercase',
        paddingTop: 8,
        textAlign: 'right'
    }
})
