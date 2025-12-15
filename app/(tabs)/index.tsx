// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Colors, Text, TextField, TouchableOpacity, View } from 'react-native-ui-lib'; // UI Lib
import { FloatingBottomBar } from '../../components/FloatingBottomBar';
import { NoteCard } from '../../components/NoteCard';
import { getNotes, initDatabase } from '../../services/db';

export default function HomeScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      await initDatabase();
      const data = await getNotes();
      setNotes(data);
      setFilteredNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const lower = text.toLowerCase();
      setFilteredNotes(notes.filter(n =>
        n.title.toLowerCase().includes(lower) ||
        (n.content && n.content.toLowerCase().includes(lower))
      ));
    }
  };

  return (
    <View flex bg-background>
      {/* Wordsy Header with Search */}
      <View row spread centerV paddingH-20 paddingB-16 style={{ paddingTop: 60 }}>
        <Text h1 color={Colors.primary}>Wordsy</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Modern Search Bar */}
      <View paddingH-20 marginB-20>
        <TextField
          placeholder="Search your notes..."
          placeholderTextColor={Colors.secondary}
          value={searchQuery}
          onChangeText={handleSearch}
          containerStyle={styles.searchBar}
          style={{ fontSize: 16, color: Colors.primary }}
          leadingAccessory={<Ionicons name="search" size={20} color={Colors.secondary} style={{ marginRight: 8 }} />}
        />
      </View>

      {/* Filter Pills Layout (Horizontal) - Reimplementing simply for UI Lib */}
      <View paddingH-20 marginB-16>
        {/* Static for now or interactive later */}
        <Text text90 color={Colors.secondary}>All Notes ({filteredNotes.length})</Text>
      </View>

      {loading ? (
        <View flex center>
          <ActivityIndicator size="large" color={Colors.cardBlue} />
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => <NoteCard note={item} index={index} />}
          ListEmptyComponent={
            <View flex center padding-40>
              <Text text70 color={Colors.secondary}>Nothing found...</Text>
            </View>
          }
        />
      )}

      <FloatingBottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  searchBar: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12, // Taller pill
    flexDirection: 'row',
    alignItems: 'center',
  }
});
