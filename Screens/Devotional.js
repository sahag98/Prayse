import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, RefreshControl, Linking } from 'react-native';
import { client } from '../lib/client';
import 'react-native-url-polyfill/auto'
import { Container, HeaderTitle } from '../styles/appStyles';
import { useSelector } from 'react-redux';
import { Divider } from 'react-native-paper';
import useIsReady from '../hooks/useIsReady';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import tbf from '../assets/tbf-logo.jpg'
import NetInfo from '@react-native-community/netinfo';

const Devotional = () => {
  const isFocused = useIsFocused();
  const theme = useSelector(state => state.user.theme)
  const isReady = useIsReady()
  const [devotionals, setDevotionals] = useState([])
  const [refresh, setRefresh] = useState(true)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    loadDevotionals()
  }, [isFocused])

  const loadDevotionals = () => {
    const query = '*[_type=="devotional"]'
    client.fetch(query)
      .then((data) => {
        setRefresh(false)
        setDevotionals(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  NetInfo.fetch().then(state => {
    setConnected(state.isConnected)
  });


  const BusyIndicator = () => {
    return (
      <View style={theme == 'dark' ? { backgroundColor: "#121212", flex: 1, justifyContent: "center" } : { backgroundColor: '#F2F7FF', flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={theme == 'dark' ? "white" : "#2f2d51"} />
      </View>
    );
  };

  if (!isReady || !connected) {
    return <BusyIndicator />;
  }

  return (

    <>
      {refresh ? <ActivityIndicator /> : null}
      <Container style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
        {devotionals?.map((d) => (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={loadDevotionals} />
            }
            showsVerticalScrollIndicator={false}
            key={d._id}
          >
            <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', marginTop: 20, marginBottom: 5, fontSize: 24, color: 'white' }
              : { fontFamily: 'Inter-Bold', marginTop: 20, fontSize: 24, marginBottom: 5, color: '#2F2D51' }}>{d.title}</HeaderTitle>
            <Text style={theme == 'dark' ? styles.descriptionDark : styles.description}>{d.description}</Text>
            <View style={theme == 'dark' ? styles.refreshDark : styles.refresh}>
              <Text style={{ fontFamily: 'Inter-Regular', color: '#7a7a7a' }}>Pull page down to refresh</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/triedbyfireministry/')} style={{ marginTop: 5, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={theme == 'dark' ? styles.ownerDark : styles.owner}>TRIED BY FIRE</Text>
                  <Text style={theme == 'dark' ? { color: '#d6d6d6', fontSize: 13, fontFamily: 'Inter-Light' } : { color: '#2f2d51', fontSize: 13, fontFamily: 'Inter-Light' }}>{d.date}</Text>
                </View>
                <Image
                  style={styles.img}
                  source={tbf}
                />
              </TouchableOpacity>
              <View style={theme == 'dark' ? { marginTop: 10, borderLeftWidth: 2, borderLeftColor: '#A5C9FF', paddingHorizontal: 10 } : { marginTop: 5, borderLeftWidth: 2, borderLeftColor: '#599bff', paddingHorizontal: 10 }}>
                <Text style={theme == 'dark' ? { color: '#d6d6d6', fontSize: 15, fontFamily: 'Inter-Regular' } : { color: '#2f2d51', fontSize: 15, fontFamily: 'Inter-Regular' }}>{d.verse}</Text>
              </View>
            </View>
            <Divider style={{ marginTop: 10, marginBottom: 5 }} />
            <Text style={theme == 'dark' ? styles.dayDark : styles.day}>{d.day}</Text>
            <Text style={theme == 'dark' ? styles.contentDark : styles.content}>{d.content}</Text>
          </ScrollView>
        ))
        }
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    backgroundColor: 'white',
    height: 180,
    width: 180,
    borderRadius: 100,
    marginVertical: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: 35,
    height: 35,
    borderRadius: 100
  },
  refreshDark: {
    width: '100%',
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  refresh: {
    width: '100%',
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  descriptionDark: {
    color: '#d6d6d6',
    fontFamily: 'Inter-Medium',
    fontSize: 16
  },
  description: {
    color: '#2F2D51',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  ownerDark: {
    color: '#d6d6d6',
    fontFamily: 'Inter-Bold'
  },
  owner: {
    color: '#2F2D51',
    fontFamily: 'Inter-Bold'
  },
  dayDark: {
    color: '#d6d6d6',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  day: {
    color: '#2F2D51',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  contentDark: {
    color: '#d6d6d6',
    fontSize: 15,
    lineHeight: 40,
    fontFamily: 'Inter-Regular',
  },
  content: {
    color: '#2F2D51',
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 40,
  },
})

export default Devotional;
